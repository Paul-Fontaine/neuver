INSERT INTO utilisateur(prenom, nom, date_naissance, mail, mdp, id_playlist_favoris)VALUES
('Paul', 'Fontaine', '2003-06-03', 'paul.fontaine@isen-ouest.yncrea.fr', crypt('paul', gen_salt('md5')), 1),
('Ryan', 'Collobert', '2003-12-28', 'ryan.collobert@isen-ouest.yncrea.fr', crypt('ryan', gen_salt('md5')), 2)
;

INSERT INTO artiste(nom_artiste, type_artiste, description_artiste) VALUES
('Vibe Tracks', 'groupe', 'Vibe Tracks est un artiste gentil qui propose des musiques libres de droits.'),
('Kevin MacLeod', 'compositeur', 'Kevin MacLeod est le musicien le plus écouté de tous les temps. Ces musiques libres de droits sont reprises par plein de films et vidéos sur internet.')
;

INSERT INTO album (nom_album, date_parution_album, style_album, id_artiste) VALUES
('electonik', '2020-09-09', 'electro', 1),
('short cinematic songs', '2012-12-12', 'ambiance',  2),
('fouilli', CURRENT_DATE, 'tout', 1)
;

INSERT INTO morceau (nom_morceau, duree_morceau, lien, id_album) VALUES
('alternate', 114, '/ressources/songs/Alternate - Vibe Tracks.mp3', 1),
('Beat Your Competition', 173, '/ressources/songs/Beat Your Competition - Vibe Tracks.mp3', 1),
('Fun', 162, '/ressources/songs/Fun - Vibe Tracks.mp3', 1),

('Pooka', 111, '/ressources/songs/Pooka - Kevin MacLeod.mp3', 2),
('Achilles Strings', 60, '/ressources/songs/Achilles - Strings - Kevin MacLeod.mp3', 2),

('Dutty', 163, '/ressources/songs/Dutty - Vibe Tracks.mp3', 3),
('About that Oldie', 114, '/ressources/songs/About That Oldie - Vibe Tracks.mp3', 3)
;

INSERT INTO playlist(nom_playlist) VALUES
('favoris'),
('favoris'),
('notre playlist');

INSERT INTO user_playlist(id_playlist, id_utilisateur) VALUES
(1, 1),
(1, 2)
;

INSERT INTO playlist_morceau(id_playlist, id_morceau) VALUES
(1, 1),
(1, 3),                                                             

(2, 2),
(2, 4),

(3, 1),
(3, 2),
(3, 3),
(3, 5)
;

INSERT INTO recemment_ecoutes(id_utilisateur, id_morceau) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 5)
;