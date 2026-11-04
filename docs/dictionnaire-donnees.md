# Dictionnaire des données

> Un champ par ligne, d'après `SUJET.md` et le fichier de `donnees/`. La première ligne sert de modèle.



+------------+----------------------+---------------+------------------------------+--------+------------+
| Champ      | Signification        | Type          | Règle de validation          | Unité  | Exemple    |
+------------+----------------------+---------------+------------------------------+--------+------------+
| id         | Identifiant unique   | Texte         | Non vide et unique           | —      | N01        |
+------------+----------------------+---------------+------------------------------+--------+------------+
| nomCommun  | Nom de l'espèce      | Texte         | Non vide et unique           | —      | cacao      |
+------------+----------------------+---------------+------------------------------+--------+------------+
| groupe     | Groupe botanique     | Texte         | Angiosperme ou gymnosperme   | —      | angiosperme|
+------------+----------------------+---------------+------------------------------+--------+------------+
| nombrePlants| Quantité de plants  | Entier        | Supérieur ou égal à 0        | plants | 30         |
+------------+----------------------+---------------+------------------------------+--------+------------+
| dateReleve | Date du relevé       | Date          | Format AAAA-MM-JJ            | —      | 2026-10-24 |
+------------+----------------------+---------------+------------------------------+--------+------------+

*Listes de valeurs autorisées* : Groupe botanique : angiosperme ou gymnosperme.
                                   Nombre de plants : un nombre entier supérieur ou égal à zéro.
                                   Date : une date réelle au format AAAA-MM-JJ.



**Listes de valeurs autorisées** : groupe : angiosperme, gymnosperme.



nomCommun : cacao, maïs, riz, tomate, goyavier, manguier, palmier à huile, citronnier, pin, cycas.

**Sources** : Fichier de données fourni (donnees/).

Fichier SUJET.md : à consulter pour confirmer les exigences complémentaires.
