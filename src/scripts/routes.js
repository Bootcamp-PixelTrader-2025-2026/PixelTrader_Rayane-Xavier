import express from 'express'
import mysql from 'mysql2/promise'

const router = express.Router()

// Database connection
async function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pixel_trader'
    })
}

const ADMIN_PASSWORD = 'admin123'

// Verify admin password
function checkPassword(req, res) {
    const password = req.body.password
    if (password !== ADMIN_PASSWORD) {
        res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
        return false
    }
    return true
}

// ============================================
// ROUTES PUBLIQUES (Consultation)
// ============================================

// Get all jeux vidéo
router.get('/jeux', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            `SELECT 
                id, 
                titre_jeu, 
                plateforme, 
                annee_sortie, 
                etat, 
                emplacement,
                prix_achat, 
                valeur_estimee,
                date_ajout
            FROM jeux_video
            ORDER BY titre_jeu`
        )
        await connection.end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get jeu by ID
router.get('/jeux/:id', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM jeux_video WHERE id = ?',
            [req. params.id]
        )
        await connection.end()
        
        if (rows.length === 0) {
            return res. status(404).json({ error: 'Jeu non trouvé' })
        }
        
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get all plateformes
router.get('/plateformes', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM plateformes ORDER BY nom'
        )
        await connection.end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get all etats
router.get('/etats', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection. execute(
            'SELECT * FROM etats ORDER BY nom'
        )
        await connection.end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get all emplacements
router.get('/emplacements', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM emplacements ORDER BY nom'
        )
        await connection. end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get statistiques par plateforme
router.get('/stats/plateformes', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM v_stats_plateforme'
        )
        await connection. end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get meilleurs investissements
router.get('/stats/investissements', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM v_meilleurs_investissements LIMIT 20'
        )
        await connection.end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get inventaire par emplacement
router.get('/stats/emplacements', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT * FROM v_inventaire_emplacement'
        )
        await connection.end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get top jeux par valeur
router.get('/stats/top-valeur', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection. execute(
            'SELECT * FROM v_top_jeux_valeur'
        )
        await connection. end()
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Get valeur totale du stock
router. get('/stats/stock-total', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection. execute(
            'CALL sp_valeur_totale_stock()'
        )
        await connection.end()
        res.json(rows[0][0])
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Recherche de jeux
router.get('/recherche', async (req, res) => {
    try {
        const { titre, plateforme, annee_min, annee_max } = req.query
        
        const connection = await getConnection()
        const [rows] = await connection. execute(
            'CALL sp_rechercher_jeux(?, ?, ?, ?)',
            [titre || null, plateforme || null, annee_min || null, annee_max || null]
        )
        await connection.end()
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// ============================================
// ROUTES ADMIN (Authentification requise)
// ============================================

// Admin login
router.post('/admin/login', (req, res) => {
    const password = req.body.password
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true })
    } else {
        res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
    }
})

// Create new jeu
router.post('/admin/jeux', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const { 
            titre_jeu, 
            plateforme, 
            annee_sortie, 
            etat, 
            emplacement, 
            prix_achat, 
            valeur_estimee 
        } = req.body
        
        const connection = await getConnection()
        const [result] = await connection.execute(
            `INSERT INTO jeux_video 
            (titre_jeu, plateforme, annee_sortie, etat, emplacement, prix_achat, valeur_estimee) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                titre_jeu, 
                plateforme, 
                annee_sortie || null, 
                etat, 
                emplacement, 
                prix_achat || 0, 
                valeur_estimee || null
            ]
        )
        await connection.end()
        
        res.json({ success: true, id: result.insertId })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Update jeu
router.put('/admin/jeux/:id', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const id = req.params.id
        const { 
            titre_jeu, 
            plateforme, 
            annee_sortie, 
            etat, 
            emplacement, 
            prix_achat, 
            valeur_estimee 
        } = req.body
        
        const connection = await getConnection()
        await connection.execute(
            `UPDATE jeux_video 
            SET titre_jeu = ?, plateforme = ?, annee_sortie = ?, etat = ?, 
                emplacement = ?, prix_achat = ?, valeur_estimee = ? 
            WHERE id = ?`,
            [
                titre_jeu, 
                plateforme, 
                annee_sortie || null, 
                etat, 
                emplacement, 
                prix_achat, 
                valeur_estimee || null, 
                id
            ]
        )
        await connection.end()
        
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Delete jeu
router.delete('/admin/jeux/:id', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const id = req. params.id
        
        const connection = await getConnection()
        await connection.execute('DELETE FROM jeux_video WHERE id = ?', [id])
        await connection.end()
        
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// ============================================
// GESTION DES RÉFÉRENTIELS (Admin)
// ============================================

// Add plateforme
router.post('/admin/plateformes', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const { nom, fabricant, annee_sortie, generation, type } = req.body
        
        const connection = await getConnection()
        const [result] = await connection.execute(
            'INSERT INTO plateformes (nom, fabricant, annee_sortie, generation, type) VALUES (?, ?, ?, ?, ?)',
            [nom, fabricant || null, annee_sortie || null, generation || null, type]
        )
        await connection. end()
        
        res. json({ success: true, id:  result.insertId })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Add etat
router.post('/admin/etats', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const { nom, description, coefficient_prix } = req.body
        
        const connection = await getConnection()
        const [result] = await connection.execute(
            'INSERT INTO etats (nom, description, coefficient_prix) VALUES (?, ?, ?)',
            [nom, description || null, coefficient_prix || 1.00]
        )
        await connection.end()
        
        res.json({ success: true, id: result.insertId })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Add emplacement
router.post('/admin/emplacements', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const { nom, type, capacite, description } = req.body
        
        const connection = await getConnection()
        const [result] = await connection.execute(
            'INSERT INTO emplacements (nom, type, capacite, description) VALUES (?, ?, ?, ?)',
            [nom, type, capacite || null, description || null]
        )
        await connection.end()
        
        res.json({ success: true, id: result.insertId })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

export default router