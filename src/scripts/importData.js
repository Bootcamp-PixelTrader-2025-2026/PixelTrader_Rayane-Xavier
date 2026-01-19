import mysql from "mysql2/promise";
import fs from "fs";

// Import data from JSON to database
export default async function importData() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pixel_trader"
  });

  const data = JSON.parse(
    fs.readFileSync("./Data.json", "utf-8")
  );

  console.log(`📦 Import de ${data.length} jeux...`);

  let imported = 0;
  let errors = 0;

  // Insert jeux vidéo
  for (const item of data) {
    try {
      await connection.execute(
        `INSERT INTO jeux_video
          (titre_jeu, plateforme, annee_sortie, etat, emplacement, prix_achat, valeur_estimee)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.titre_jeu || "Titre inconnu",
          item.plateforme || "Inconnue",
          item.annee_sortie && item.annee_sortie !== "" ? item.annee_sortie : null,
          item.etat || "Non spécifié",
          item.emplacement || "Non spécifié",
          item.prix_achat
            ? parseFloat(item.prix_achat.replace("€", "").replace(",", "."))
            : 0.00,
          item.valeur_estimee && item.valeur_estimee !== ""
            ? parseFloat(item.valeur_estimee.replace("€", "").replace(",", "."))
            : null
        ]
      );
      imported++;
    } catch (error) {
      console.error(`❌ Erreur pour "${item.titre_jeu}":`, error.message);
      errors++;
    }
  }

  await connection.end();

  console.log(`✅ Import terminé : ${imported} jeux importés, ${errors} erreurs`);
}

// Exécuter l'import si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  importData().catch(console.error);
}
