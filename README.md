#  PixelTrader - Gestion de Stock Jeux Vidéo Rétro

Système de gestion de stock pour magasin de jeux vidéo rétro avec interface web et API REST.

---

##  Fonctionnalités

###  Frontend
-  Catalogue de jeux avec filtres avancés (plateforme, prix, état, année)
-  Recherche en temps réel
-  Affichage des meilleures ventes
-  Page détails pour chaque jeu
-  Statistiques du stock (valeur totale, investissements, rentabilité)
-  Interface responsive en pixel art
-  Système d'authentification (connexion/inscription)

###  Backend
-  API REST complète avec Express.js
-  Connexion MySQL via mysql2
-  CRUD complet sur les jeux
-  Gestion des référentiels (plateformes, états, emplacements)
-  Vues SQL pour statistiques optimisées
-  Procédures stockées pour calculs complexes
-  Import automatique depuis JSON

###  Base de données
-  4 tables principales : jeux_video, plateformes, etats, emplacements
-  4 vues SQL pour statistiques
-  2 procédures stockées
-  Index optimisés pour performances

---

##  Technologies utilisées

### Frontend
- HTML5
- CSS3 (Design Pixel Art)
- JavaScript (Vanilla)
- Google Fonts (Silkscreen)

### Backend
- Node.js v18+
- Express.js v5. 2. 1
- MySQL2 (Promise)
- CORS

### Base de données
- MySQL 8.0+
- phpMyAdmin (gestion)


