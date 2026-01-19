const API_URL = "http://localhost:3000/api";
let allJeux = [];
let activeConsole = null;

async function loadData() {
  // Charger les jeux
  const resJeux = await fetch(`${API_URL}/jeux`);
  allJeux = await resJeux. json();

  renderTopSales(allJeux);
  initConsoleFilters();
  initDropdownFilters();
  applyFilters();
}

function renderTopSales(jeux) {
  const container = document. getElementById("top-sales-container");
  if (!container) return;

  // Trier par valeur estimée décroissante
  const topJeux = [... jeux]
    .filter(j => j.valeur_estimee)
    .sort((a, b) => b.valeur_estimee - a.valeur_estimee)
    .slice(0, 3);

  container.innerHTML = topJeux
    .map(
      (jeu) => `
        <div class="card">
          <div class="fond-pixel">
            <img src="images/placeholder. png" alt="${jeu.titre_jeu}" />
          </div>
          <p class="name-game">${jeu.titre_jeu}</p>
          <p class="price-game">${jeu.plateforme}</p>
          <p class="price-game">${jeu. valeur_estimee}€</p>
          <a href="detail. html? id=${jeu.id}"><button class="primary-button button-shop">Voir Détails</button></a>
        </div>
      `
    )
    .join("");
}

function renderConsoleGames(list) {
  const container = document.getElementById("console-products-container");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML =
      "<p style='color: white; font-family: monospace; padding:20px;'>Aucun jeu ne correspond à vos critères. </p>";
    return;
  }

  container.innerHTML = list
    .map(
      (jeu) => `
    <div class="card-console">
      <div class="fond-pixel-console">
        <img src="images/placeholder.png" alt="${jeu.titre_jeu}" />
      </div>
      <p class="name-game-console">${jeu.titre_jeu}</p>
      <p class="price-game-console">Plateforme :  ${jeu.plateforme}</p>
      <p class="price-game-console">Prix : ${jeu.valeur_estimee || 'N/A'}€</p>
      <a href="detail.html?id=${jeu.id}"><button class="primary-button button-shop">Voir Détails</button></a>
    </div>
  `
    )
    .join("");
}

function initDropdownFilters() {
  const selects = document.querySelectorAll(". select-wrapper select");
  const searchInput = document.querySelector(".input-pixel");

  selects.forEach((select) => {
    select.addEventListener("change", applyFilters);
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
}

function initConsoleFilters() {
  const consoleButtons = document.querySelectorAll(". console");
  consoleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-name").toLowerCase().trim();

      if (activeConsole === target) {
        activeConsole = null;
        btn.classList.remove("active");
      } else {
        activeConsole = target;
        consoleButtons.forEach((b) => b.classList.remove("active"));
        btn.classList. add("active");
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  const priceVal = document.querySelector('select[name="price"]')?.value;
  const etatVal = document.querySelector('select[name="etat"]')?.value;
  const anneeVal = document.querySelector('select[name="annee"]')?.value;
  const searchQuery = document
    .querySelector(". input-pixel")
    ?.value. toLowerCase()
    .trim();

  let filtered = allJeux. filter((jeu) => {
    // Filtre console
    if (
      activeConsole &&
      (! jeu.plateforme || ! jeu.plateforme.toLowerCase().includes(activeConsole))
    ) {
      return false;
    }

    // Filtre recherche
    const nomJeu = (jeu.titre_jeu || "").toLowerCase();
    if (searchQuery && ! nomJeu.includes(searchQuery)) {
      return false;
    }

    // Filtre prix
    const prix = parseFloat(jeu.valeur_estimee || 0);
    if (priceVal === "0-20" && prix > 20) return false;
    if (priceVal === "21-50" && (prix <= 20 || prix > 50)) return false;
    if (priceVal === "51-150" && (prix <= 50 || prix > 150)) return false;
    if (priceVal === "151-500" && (prix <= 150 || prix > 500)) return false;
    if (priceVal === "501+" && prix <= 500) return false;

    // Filtre état
    if (
      etatVal &&
      (! jeu.etat || !jeu.etat.toLowerCase().includes(etatVal. toLowerCase()))
    ) {
      return false;
    }

    // Filtre année
    const annee = parseInt(jeu.annee_sortie);
    if (anneeVal === "retro" && annee >= 1990) return false;
    if (anneeVal === "90s" && (annee < 1990 || annee >= 2000)) return false;
    if (anneeVal === "2000s" && (annee < 2000 || annee >= 2010)) return false;
    if (anneeVal === "recent" && annee < 2010) return false;

    return true;
  });

  renderConsoleGames(filtered);
}

document.addEventListener("DOMContentLoaded", loadData);