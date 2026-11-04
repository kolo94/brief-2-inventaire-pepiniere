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
  // affichage du menu
  //console.log("À compléter : écrivez le menu dans app.js (fiches/3-ajouter-lister.md).");
  console.log('========================================================')
 console.log (' INVENTAIRE DE LA PEPINIERE');
 console.log('pepiniere pedagogique');
 console.log('========================================================'); 
 // initialisation du tableau vide let plants=[];
 let plants= [];
 try {
  plants= await chargerJson(FICHIEER_DONNES);
  console.log(`${plants.length} espèce(s) chargée(s) depuis ${FICHIER_DONNEES}.`);
 }
 catch(erreur) {
  console.log(`impossible de lire ${FICHIER_DONNEES}, ${erreur.message}, l'inventaire demarre vide.`);
 }
 // CONSTRUCTION DU MENU

 let continuer = true;
 while(continuer) {
  // Afficher le menu
  console.log('\n=== MENU ===');
  console.log('1. Ajouter un plant');
  console.log('2. Lister les plants');
  console.log('3. Rechercher un plant parId)');
  console.log('4. trouver par nom') 
  console.log('5. Filtrer par groupe');
  console.log('6. Trier par nombre de plants');
  console.log('9. Voir le stockes faibles(seuil${SEUIL_STOCK_FAIBLE})');
  console.log('8. synthese par groupe');
  console.log('9. total et plus abondante');
  console.log('0. Quitter');

  const choix = (await demander('Votre choix : ')).trim();
  try{
    if (choix=== '0'||choix.toLowerCase()=== 'q') {
      console.log ("Au revoir ! ");
      break,
    }
    if (choix === '1') {
      const liste = listerPlants(plants);
      if (liste.length ===0) console.log("aucun plant.");
      else liste.forEach(p =>  console.log(formaterPlant(p)));
  }
  if( choix==='2') {
    console.log(`Groupes autorisés : ${GROUPES.join(',')}`);
  const id = await demander("id (ex: N11):");
  const nomCommun = await demander("nom commun :");
  const groupe = await demander(" groupe (angiosperme ou gymnosperme) : ");
  const nombrePlants = await demander("nombre de plants :");
  const dateReleve = await  demander(" date de releve (YYYY-MM-DD): ");
  const nouveau = ajouterPlant(plants,{
    id: id.trim(),
    nomCommun : nomCommun.trim(),
    groupe : groupe.trim(),
    nombrePlants  : Number(nombrePlants.trim()),
    dateReleve : dateReleve.trim(),
  });
  await enregistrerJson(FICHIER_DONNEES, plants);
  console.log(" Ajoute :" + formaterPlant(nouveau));
}
  
  else if (choix === '3') {
        // DIFFERENT : renvoie 1 objet ou null, pas un tableau
        const id = await demander("Id a trouver : ");
        const trouve = trouverParId(plants, id);
        if (trouve) console.log(formaterPlant(trouve));
        else console.log(Id ${id} non trouve.);
  }
  else if (choix ==='4' ) {
  const texte = await  demander(" texte a chercher :");
  const res =  rechercherParNom(plants, texte);
  console.log(`${res.length} resultat(s) `);
  res.forEach( p =>console.log(formanterPlant(p)));
  

}
else if (choix === '5') {
  const g = await demander(`Groupe a filter(${GROUPES.join(',')}) :`);
  const res = filtrerParGroupe(plants,g);
  console.log(`${res.length}  resultat(s)`);
  res.forEach(p=> console.log(formaterPlant(p)));
}
else if (choix ==='6') {
  const tries = trierParNombrePlants(plants);
  tries.forEach(p=> console.log(formaterPlant(p)));
}
else if (choix ==='7') {
  / DIFFERENT : filtre avec <= seuil
        const faibles = stocksFaibles(plants, SEUIL_STOCK_FAIBLE);
        console.log(${faibles.length} en stock faible (<= ${SEUIL_STOCK_FAIBLE}) :);
        faibles.forEach(p => console.log(formaterPlant(p)));
  }

}
else if (choix==='8') {
  const synth = syntheseParGroupe(plants);
  console.log(synth);


  }
else if (choix ==='9') {
    console.log("Total plants :" + totalPlants(plants));
    const top = especeLaPlusAbondante(plants);
    if (top) console.log("La plus abondante :" + formaterPlant(top));
    else console.log("Inventaire vide");

    }
    else {
      console.log(" choix invalide");
    }
  } catch(e) {
    console.log("Erreur:" + e.message);
  }
 }
 fermerSaisie();
}

main();
