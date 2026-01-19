const API_URL = "http://localhost:3000/api";

async function loadJeuDetail() {
  const params = new URLSearchParams(window. location.search);
  const jeuId = parseInt(params.get("id"));

  if (!jeuId) {
    document.getElementById("detail-container").innerHTML = 
      "<p>Jeu introuvable</p>";
    return;
  }

  const response = await fetch(`${API_URL}/jeux/${jeuId}`);
  const jeu = await response.json();

  const container = document.getElementById("detail-container");
  
  container.innerHTML = `
    <div style="display: flex; gap: 50px; align-items: flex-start;">
      <div class="fond-pixel-kpi">
        <img src="images/placeholder.png" alt="${jeu.titre_jeu}" style="width: 300px;" />
      </div>
      
      <div style="flex: 1;">
        <h2 style="color: #e94697; font-size: 3rem; margin-bottom: 20px;">
          ${jeu.titre_jeu}
        </h2>
        
        <div style="font-size: 1.3rem; line-height: 2;">
          <p><strong>Plateforme : </strong> ${jeu.plateforme}</p>
          <p><strong>Année de sortie :</strong> ${jeu.annee_sortie || 'N/A'}</p>
          <p><strong>État :</strong> ${jeu. etat}</p>
          <p><strong>Emplacement :</strong> ${jeu. emplacement}</p>
          <p><strong>Prix d'achat :</strong> ${jeu.prix_achat}€</p>
          <p><strong>Valeur estimée :</strong> ${jeu.valeur_estimee || 'N/A'}€</p>
          
          ${jeu.valeur_estimee ? `
            <p><strong>Plus-value :</strong> 
              <span style="color:  ${jeu.valeur_estimee > jeu.prix_achat ? '#4CAF50' : '#f44336'};">
                ${(jeu.valeur_estimee - jeu.prix_achat).toFixed(2)}€
              </span>
            </p>
          ` : ''}
          
          <p style="font-size: 0.9rem; color: #aaa; margin-top: 20px;">
            Ajouté le :  ${new Date(jeu.date_ajout).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", loadJeuDetail);