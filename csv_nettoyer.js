const fs = require('fs');
const path = require('path');

// Configuration des chemins
const PATHS = {
    input: path.join(__dirname, 'ressources', 'stock_legacy_full.csv'),
    output: path.join(__dirname, 'ressources', 'stock_clean.csv')
};

// Configuration des taux de conversion vers EUR
const CURRENCY_RATES = {
    '$': 0.92,
    'USD': 0.92,
    '¥': 0.0063, 
    'JPY': 0.0063,
    '£': 1.17,
    'GBP': 1.17,
    '€':  1,
    'EUR':  1
};

// Normalisation des noms de plateformes
const PLATFORM_NORMALIZATION = {
    'N64': 'Nintendo 64',
    'NES': 'Nintendo Entertainment System',
    'Ps1': 'PlayStation 1',
    'PS1': 'PlayStation 1',
    'PSX': 'PlayStation 1',
    'SNES': 'Super Nintendo',
    'Megadrive': 'Sega Mega Drive',
    'Super Famicom': 'Super Nintendo'
};

// Normalisation des états
const STATE_NORMALIZATION = {
    'Mint': 'Excellent',
    'Good': 'Bon',
    'Jap': 'Import JAP',
    'Loose': 'Sans boîte'
};

// Index des colonnes
const COLUMNS = {
    PURCHASE_PRICE: 6,
    SALE_PRICE: 7,
    PLATFORM: 2,
    STATE: 4
};

/**
 * Convertit un prix dans différentes devises vers EUR
 * @param {string} priceString - Prix avec symbole de devise
 * @returns {string} Prix en EUR formaté avec 2 décimales
 */
function convertToEUR(priceString) {
    if (!priceString || priceString === 'NULL' || priceString === '') {
        return '0.00';
    }

    // Détection de la devise et récupération du taux de conversion
    const conversionRate = Object.entries(CURRENCY_RATES).find(([symbol]) => 
        priceString. includes(symbol)
    )?.[1] || 1;

    // Extraction de la valeur numérique
    const numericValue = priceString
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.');
    
    const price = parseFloat(numericValue) || 0;

    return (price * conversionRate).toFixed(2);
}

/**
 * Normalise une valeur de champ selon son index
 * @param {string} value - Valeur à normaliser
 * @param {number} columnIndex - Index de la colonne
 * @returns {string} Valeur normalisée
 */
function normalizeField(value, columnIndex) {
    const trimmedValue = value.trim();

    // Conversion des prix
    if (columnIndex === COLUMNS.PURCHASE_PRICE || columnIndex === COLUMNS.SALE_PRICE) {
        return convertToEUR(trimmedValue);
    }

    // Normalisation des plateformes
    if (columnIndex === COLUMNS. PLATFORM) {
        return PLATFORM_NORMALIZATION[trimmedValue] || trimmedValue;
    }

    // Normalisation des états
    if (columnIndex === COLUMNS.STATE) {
        return STATE_NORMALIZATION[trimmedValue] || trimmedValue;
    }

    // Remplacement des valeurs NULL
    return trimmedValue === 'NULL' ? '' : trimmedValue;
}

/**
 * Traite une ligne CSV et retourne la version nettoyée
 * @param {string} line - Ligne CSV à traiter
 * @returns {string} Ligne CSV nettoyée
 */
function processLine(line) {
    const fields = line.split(';');
    const cleanedFields = fields.map((field, index) => normalizeField(field, index));
    return cleanedFields.join(';');
}

/**
 * Nettoie le fichier CSV :  normalise les devises, plateformes et états
 */
function cleanCSVFile() {
    // Vérification de l'existence du fichier
    if (!fs.existsSync(PATHS.input)) {
        throw new Error(`Le fichier source est introuvable :  ${PATHS.input}`);
    }

    // Lecture du fichier
    const fileContent = fs.readFileSync(PATHS.input, 'utf-8');
    const lines = fileContent.split(/\r?\n/);

    if (lines.length === 0) {
        throw new Error('Le fichier CSV est vide');
    }

    // Traitement des lignes
    const cleanedLines = [
        lines[0], // En-tête (première ligne)
        ...lines.slice(1)
            .filter(line => line.trim()) // Suppression des lignes vides
            .map(processLine) // Nettoyage de chaque ligne
    ];

    // Écriture du fichier avec BOM UTF-8
    fs.writeFileSync(PATHS.output, '\uFEFF' + cleanedLines.join('\n'), 'utf-8');
    
    console.log(` Nettoyage terminé avec succès ! `);
    console.log(` ${cleanedLines.length - 1} lignes traitées`);
    console.log(` Fichier de sortie : ${PATHS.output}`);
}

// Exécution du script
try {
    cleanCSVFile();
} catch (error) {
    console.error(` Erreur : ${error.message}`);
    process.exit(1);
}