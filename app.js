// Inventaire de la pépinière — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { GROUPES, ajouterPlant, formaterPlant, listerPlants, trouverParId } from './src/registre.js';
import { filtrerParGroupe, rechercherParNom, trierParNombrePlants } from './src/recherche.js';
import { SEUIL_STOCK_FAIBLE, especeLaPlusAbondante, stocksFaibles, syntheseParGroupe, totalPlants } from './src/synthese.js';

const FICHIER_DONNEES = 'donnees/plants.json';

async function main() {
  ouvrirSaisie();

  console.log('========================================================');
  console.log('       INVENTAIRE DE LA PEPINIERE');
  console.log('             Pepiniere pedagogique');
  console.log('========================================================');

  // Initialisation et chargement des données
  let plants = [];

  try {
    plants = await chargerJson(FICHIER_DONNEES);

    console.log(`${plants.length} espèce(s) chargée(s) depuis ${FICHIER_DONNEES}.`
    );
  } catch (erreur) {
    console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}`
    );
    console.log("L'inventaire démarre vide.");
  }

  // Construction du menu
  let continuer = true;

  while (continuer) {
    console.log('\n========== MENU ==========');
    console.log('1. Ajouter un plant');
    console.log('2. Lister un plant');
    console.log('3. Rechercher un plant (ID, nom, groupe)');
    console.log('4. Trier par nombre de plants');
    console.log('5. Synthèse de l’inventaire');
    console.log('0. Quitter');

    const saisieChoix = await demander('Votre choix : ');

    if (saisieChoix === null) {
      continue;
    }

    const choix = saisieChoix.trim();

    try {

      // CHOIX 0 : QUITTER
      if (choix === '0' || choix.toLowerCase() === 'q') {
        console.log('Au revoir !');
        continuer = false;
      }

      // CHOIX 1 : AJOUTER UN PLANT
      else if (choix === '1') {
        console.log(`Groupes autorisés : ${GROUPES.join(', ')}`);

        const id = await demander('ID (ex : N11) : ');
        if (id === null) continue;

        const nomCommun = await demander('Nom commun : ');
        if (nomCommun === null) continue;

        const groupe = await demander('Groupe botanique : ');
        if (groupe === null) continue;

        const nombrePlants = await demander('Nombre de plants : ');
        if (nombrePlants === null) continue;

        const dateReleve = await demander('Date de relevé (YYYY-MM-DD) : ');
        if (dateReleve === null) continue;

        const erreurs = ajouterPlant(plants, {
          id: id.trim(),
          nomCommun: nomCommun.trim(),
          groupe: groupe.trim(),
          nombrePlants: nombrePlants.trim(),
          dateReleve: dateReleve.trim()
        });

        if (erreurs.length > 0) {
          erreurs.forEach(erreur => console.log(erreur));
        } else {
          await enregistrerJson(FICHIER_DONNEES, plants);

          console.log(
            'Ajouté : ' + formaterPlant(plants[plants.length - 1])
          );
        }
      }
      // CHOIX 2: LISTER LES PLANTS
      else if (choix === '2') {
        console.log('\n--- Liste des plants ---');
        console.log(listerPlants(plants));
      }

      // CHOIX 3 : RECHERCHER UN PLANT
      else if (choix === '3') {
        console.log('\n--- RECHERCHE ---');
        console.log('1. Rechercher par code');
        console.log('2. Rechercher par nom');
        console.log('3. Filtrer par groupe');

        const sousChoix = await demander('Votre choix : ');

        if (sousChoix === null) continue;

        // Recherche par code
        if (sousChoix.trim() === '1') {
          const id = await demander('Code : ');

          if (id === null) continue;

          const code = id.trim().toUpperCase();
          const trouve = trouverParId(plants, code);

          if (trouve) {
            console.log(formaterPlant(trouve));
          } else {
            console.log(`Plant ${code} introuvable.`);
          }
        }

        // Recherche par nom
        else if (sousChoix.trim() === '2') {
          const texte = await demander('Nom ou partie du nom : ');

          if (texte === null) continue;

          const nom = texte.trim().toLowerCase();
          const res = rechercherParNom(plants, nom);

          console.log(`${res.length} résultat(s) trouvé(s) :`);
          console.log(listerPlants(res));
        }

        // Filtrage par groupe
        else if (sousChoix.trim() === '3') {
          const g = await demander(
            `Groupe (${GROUPES.join(' ou ')}) : `
          );

          if (g === null) continue;

          const groupe = g.trim().toLowerCase();
          const res = filtrerParGroupe(plants, groupe);

          console.log(`${res.length} résultat(s) trouvé(s) :`);
          console.log(listerPlants(res));
        }

        else {
          console.log('Choix inconnu : retour au menu.');
        }
      }

      // CHOIX 4 : TRIER LES PLANTS
      else if (choix === '4') {
        console.log('\n--- TRI DES PLANTS ---');
        console.log('1. Par nombre de plants croissant');

        const sousChoix = await demander('Votre choix : ');

        if (sousChoix === null) continue;

        if (sousChoix.trim() === '1') {
          const tries = trierParNombrePlants(plants);
          console.log(listerPlants(tries));
        } else {
          console.log('Choix inconnu.');
        }
      }

      // CHOIX 5 : SYNTHESE DE L'INVENTAIRE
      else if (choix === '5') {
        console.log('\n--- Synthèse de l’inventaire ---');

        // Nombre d'espèces
        console.log(`Nombre d'espèces : ${plants.length}`);

        // Stock total
        console.log(`Stock total : ${totalPlants(plants)} plants`);

        // Synthèse par groupe
        console.log('Par groupe botanique :');

        const synth = syntheseParGroupe(plants);

        for (const [groupe, donnees] of Object.entries(synth)) {
          console.log(
            `  ${groupe} : ${donnees.especes} espèce(s), ${donnees.plants} plants`
          );
        }

        // Espèce la plus abondante
        const top = especeLaPlusAbondante(plants);

        if (top) {
          console.log(
            `Espèce la plus abondante : ${formaterPlant(top)}`
          );
        } else {
          console.log('Espèce la plus abondante : aucune donnée');
        }

        // Stocks faibles
        const faibles = stocksFaibles(
          plants,
          SEUIL_STOCK_FAIBLE
        );

        console.log(
          `Stocks faibles (≤ ${SEUIL_STOCK_FAIBLE} plants) : ${faibles.length}`
        );

        faibles.forEach(p => console.log(formaterPlant(p)));

        // Rappel pédagogique
        console.log(
          `Rappel : le seuil de ${SEUIL_STOCK_FAIBLE} plants est un repère pédagogique de suivi.`
        );
      }

      // CHOIX INVALIDE
      else {
        console.log('Choix invalide. Veuillez réessayer.');
      }

    } catch (erreur) {
      console.log('Erreur : ' + erreur.message);
    }
  }
}

main().finally(() => {
  fermerSaisie();
});

