const API_URL = "http://localhost:3000/api";

async function loadStats() {
  // Stock total
  const resTotal = await fetch(`${API_URL}/stats/stock-total`);
  const total = await resTotal.json();
  
  document.getElementById("stock-total").innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
      <div style="background: #1e2b55; padding: 30px; text-align: center;">
        <h3 style="color: #e94697;">${total.nombre_total_jeux}</h3>
        <p>Jeux au total</p>
      </div>
      <div style="background: #1e2b55; padding: 30px; text-align: center;">
        <h3 style="color: #e94697;">${total.investissement_total}€</h3>
        <p>Investissement total</p>
      </div>
      <div style="background: #1e2b55; padding: 30px; text-align: center;">
        <h3 style="color: #4CAF50;">${total.plus_value_totale}€</h3>
        <p>Plus-value potentielle</p>
      </div>
    </div>
  `;

  // Stats plateformes
  const resPlat = await fetch(`${API_URL}/stats/plateformes`);
  const plateformes = await resPlat.json();
  
  document.getElementById("stats-plateformes").innerHTML = plateformes.map(p => `
    <div style="background:  #1a0c35; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between;">
      <strong>${p.plateforme}</strong>
      <span>${p.nombre_jeux} jeux</span>
      <span>${p.valeur_totale}€</span>
      <span style="color: #4CAF50;">+${p.plus_value_potentielle}€</span>
    </div>
  `).join('');

  // Top investissements
  const resInvest = await fetch(`${API_URL}/stats/investissements`);
  const investissements = await resInvest.json();
  
  document.getElementById("top-investissements").innerHTML = investissements.slice(0, 10).map(inv => `
    <div style="background: #1a0c35; padding: 20px; margin-bottom: 15px;">
      <strong>${inv.titre_jeu}</strong> (${inv.plateforme})
      <br/>
      <span style="color: #4CAF50;">+${inv.taux_rentabilite}%</span> 
      (Achat: ${inv.prix_achat}€ → Valeur: ${inv.valeur_estimee}€)
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", loadStats);