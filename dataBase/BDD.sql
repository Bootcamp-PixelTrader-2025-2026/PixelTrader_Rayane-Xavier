-- ============================================
-- Base de données :  Pixel Trader
-- Gestion du stock de jeux vidéo rétro
-- ============================================

-- Suppression de la base si elle existe déjà
DROP DATABASE IF EXISTS pixel_trader;

-- Création de la base de données
CREATE DATABASE pixel_trader CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pixel_trader;

-- ============================================
-- Table : jeux_video
-- ============================================
CREATE TABLE jeux_video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre_jeu VARCHAR(255) NOT NULL,
    plateforme VARCHAR(100) NOT NULL,
    annee_sortie YEAR NULL,
    etat VARCHAR(100) NOT NULL,
    emplacement VARCHAR(100) NOT NULL,
    prix_achat DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Prix en EUR',
    valeur_estimee DECIMAL(10, 2) NULL COMMENT 'Valeur estimée en EUR',
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_plateforme (plateforme),
    INDEX idx_etat (etat),
    INDEX idx_emplacement (emplacement),
    INDEX idx_annee (annee_sortie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table : plateformes (référentiel)
-- ============================================
CREATE TABLE plateformes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    fabricant VARCHAR(100),
    annee_sortie YEAR,
    generation TINYINT COMMENT 'Génération de la console',
    type ENUM('Console de salon', 'Console portable', 'PC', 'Arcade') NOT NULL,
    
    INDEX idx_fabricant (fabricant),
    INDEX idx_generation (generation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table : etats (référentiel)
-- ============================================
CREATE TABLE etats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    coefficient_prix DECIMAL(3, 2) DEFAULT 1.00 COMMENT 'Coefficient multiplicateur du prix'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table : emplacements (référentiel)
-- ============================================
CREATE TABLE emplacements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    capacite INT DEFAULT NULL COMMENT 'Nombre maximum de jeux',
    type ENUM('Etagere', 'Vitrine', 'Stock', 'Caisse', 'Autre') NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insertion des plateformes de référence
-- ============================================
INSERT INTO plateformes (nom, fabricant, annee_sortie, generation, type) VALUES
('Nintendo 64', 'Nintendo', 1996, 5, 'Console de salon'),
('Nintendo Entertainment System', 'Nintendo', 1983, 3, 'Console de salon'),
('PlayStation 1', 'Sony', 1994, 5, 'Console de salon'),
('Super Nintendo', 'Nintendo', 1990, 4, 'Console de salon'),
('Sega Mega Drive', 'Sega', 1988, 4, 'Console de salon'),
('Game Boy', 'Nintendo', 1989, 4, 'Console portable'),
('GameBoy Color', 'Nintendo', 1998, 5, 'Console portable'),
('Game Boy Advance', 'Nintendo', 2001, 6, 'Console portable'),
('Master System', 'Sega', 1985, 3, 'Console de salon'),
('Dreamcast', 'Sega', 1998, 6, 'Console de salon'),
('PlayStation 2', 'Sony', 2000, 6, 'Console de salon'),
('PlayStation 3', 'Sony', 2006, 7, 'Console de salon'),
('GameCube', 'Nintendo', 2001, 6, 'Console de salon'),
('Xbox', 'Microsoft', 2001, 6, 'Console de salon'),
('Saturn', 'Sega', 1994, 5, 'Console de salon'),
('Switch', 'Nintendo', 2017, 8, 'Console portable'),
('Atari 2600', 'Atari', 1977, 2, 'Console de salon'),
('Arcade', 'Divers', NULL, NULL, 'Arcade'),
('PC', 'Divers', NULL, NULL, 'PC');

-- ============================================
-- Insertion des états de référence
-- ============================================
INSERT INTO etats (nom, description, coefficient_prix) VALUES
('Excellent', 'État impeccable, proche du neuf', 1.20),
('Mint', 'État neuf ou comme neuf', 1.30),
('Bon', 'Bon état général avec traces d''usage légères', 1.00),
('Good', 'Bon état', 1.00),
('Comme neuf', 'Quasi neuf', 1.25),
('Neuf', 'Jamais ouvert ou jamais utilisé', 1.40),
('Blister', 'Sous blister d''origine', 1.50),
('Sans boîte', 'Cartouche/disque seul', 0.60),
('Loose', 'Sans boîte ni notice', 0.60),
('Sans notice', 'Boîte présente mais sans notice', 0.80),
('Boite abimée', 'Boîte endommagée', 0.75),
('Boite cassee', 'Boîte très abîmée', 0.70),
('Boite manquante', 'Pas de boîte', 0.55),
('Rayé', 'Disque rayé mais fonctionnel', 0.65),
('Abimé', 'État général moyen', 0.50),
('Moyen', 'État passable', 0.45),
('Use', 'Très utilisé', 0.40),
('Pourri', 'Mauvais état', 0.10),
('Jauni', 'Plastique jauni par le temps', 0.85),
('Import JAP', 'Import japonais', 1.10),
('Jap', 'Version japonaise', 1.10),
('Pile HS', 'Pile de sauvegarde hors service', 0.70),
('Platinum', 'Réédition économique', 0.50),
('Collector', 'Édition collector', 1.60),
('Steelbook', 'Boîtier métal', 1.35),
('Big Box', 'Grande boîte carton PC', 1.40),
('Cabinet', 'Borne d''arcade complète', 2.00);

-- ============================================
-- Insertion des emplacements de référence
-- ============================================
INSERT INTO emplacements (nom, type, description) VALUES
('Etagere A', 'Etagere', 'Étagère principale - Jeux Nintendo'),
('Etagere B', 'Etagere', 'Étagère Sega'),
('Etagere C', 'Etagere', 'Étagère PlayStation'),
('Etagere D', 'Etagere', 'Étagère portables'),
('Etagere F', 'Etagere', 'Étagère Dreamcast'),
('Etagere G', 'Etagere', 'Étagère horreur/action'),
('Etagere H', 'Etagere', 'Étagère GameCube/Xbox'),
('Vitrine 1', 'Vitrine', 'Vitrine principale - Jeux de valeur'),
('Vitrine 2', 'Vitrine', 'Vitrine secondaire'),
('Stock', 'Stock', 'Zone de stockage général'),
('Caisse 2', 'Caisse', 'Caisse de jeux portables'),
('Reserve', 'Stock', 'Réserve PC'),
('Coffre-fort', 'Autre', 'Coffre pour jeux rares et précieux'),
('Comptoir', 'Autre', 'Comptoir de vente'),
('Entrée', 'Autre', 'Entrée du magasin'),
('Poubelle', 'Autre', 'À jeter');

-- ============================================
-- Vue :  Statistiques par plateforme
-- ============================================
CREATE VIEW v_stats_plateforme AS
SELECT 
    plateforme,
    COUNT(*) as nombre_jeux,
    SUM(prix_achat) as investissement_total,
    SUM(valeur_estimee) as valeur_totale,
    SUM(valeur_estimee) - SUM(prix_achat) as plus_value_potentielle,
    ROUND(AVG(valeur_estimee), 2) as valeur_moyenne,
    ROUND(AVG(prix_achat), 2) as prix_achat_moyen
FROM jeux_video
WHERE valeur_estimee IS NOT NULL
GROUP BY plateforme
ORDER BY valeur_totale DESC;

-- ============================================
-- Vue : Jeux les plus rentables
-- ============================================
CREATE VIEW v_meilleurs_investissements AS
SELECT 
    id,
    titre_jeu,
    plateforme,
    annee_sortie,
    prix_achat,
    valeur_estimee,
    (valeur_estimee - prix_achat) as plus_value,
    ROUND(((valeur_estimee - prix_achat) / prix_achat * 100), 2) as taux_rentabilite
FROM jeux_video
WHERE valeur_estimee IS NOT NULL AND prix_achat > 0
ORDER BY taux_rentabilite DESC;

-- ============================================
-- Vue : Inventaire par emplacement
-- ============================================
CREATE VIEW v_inventaire_emplacement AS
SELECT 
    emplacement,
    COUNT(*) as nombre_jeux,
    SUM(valeur_estimee) as valeur_totale,
    ROUND(AVG(valeur_estimee), 2) as valeur_moyenne
FROM jeux_video
WHERE valeur_estimee IS NOT NULL
GROUP BY emplacement
ORDER BY valeur_totale DESC;

-- ============================================
-- Vue : Top 10 jeux les plus chers
-- ============================================
CREATE VIEW v_top_jeux_valeur AS
SELECT 
    titre_jeu,
    plateforme,
    annee_sortie,
    etat,
    emplacement,
    valeur_estimee,
    prix_achat,
    (valeur_estimee - prix_achat) as plus_value
FROM jeux_video
WHERE valeur_estimee IS NOT NULL
ORDER BY valeur_estimee DESC
LIMIT 10;

-- ============================================
-- Procédure : Calculer la valeur totale du stock
-- ============================================
DELIMITER //

CREATE PROCEDURE sp_valeur_totale_stock()
BEGIN
    SELECT 
        COUNT(*) as nombre_total_jeux,
        SUM(prix_achat) as investissement_total,
        SUM(COALESCE(valeur_estimee, 0)) as valeur_estimee_totale,
        SUM(COALESCE(valeur_estimee, 0)) - SUM(prix_achat) as plus_value_totale,
        ROUND(AVG(COALESCE(valeur_estimee, 0)), 2) as valeur_moyenne_par_jeu
    FROM jeux_video;
END //

DELIMITER ;

-- ============================================
-- Procédure : Rechercher des jeux
-- ============================================
DELIMITER //

CREATE PROCEDURE sp_rechercher_jeux(
    IN p_titre VARCHAR(255),
    IN p_plateforme VARCHAR(100),
    IN p_annee_min YEAR,
    IN p_annee_max YEAR
)
BEGIN
    SELECT * FROM jeux_video
    WHERE 
        (p_titre IS NULL OR titre_jeu LIKE CONCAT('%', p_titre, '%'))
        AND (p_plateforme IS NULL OR plateforme = p_plateforme)
        AND (p_annee_min IS NULL OR annee_sortie >= p_annee_min)
        AND (p_annee_max IS NULL OR annee_sortie <= p_annee_max)
    ORDER BY titre_jeu;
END //

DELIMITER ;

-- ============================================
-- Affichage des statistiques
-- ============================================
SELECT '=== STATISTIQUES PAR PLATEFORME ===' as '';
SELECT * FROM v_stats_plateforme;

SELECT '=== TOP 10 MEILLEURS INVESTISSEMENTS ===' as '';
SELECT * FROM v_meilleurs_investissements LIMIT 10;

SELECT '=== INVENTAIRE PAR EMPLACEMENT ===' as '';
SELECT * FROM v_inventaire_emplacement;

SELECT '=== TOP 10 JEUX LES PLUS CHERS ===' as '';
SELECT * FROM v_top_jeux_valeur;