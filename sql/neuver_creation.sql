------------------------------------------------------------
--        Script Postgre 
------------------------------------------------------------


------------------------------------------------------------
-- Table: playlist
------------------------------------------------------------
drop table if exists public.playlist CASCADE ;
CREATE TABLE public.playlist(
    id_playlist      SERIAL NOT NULL ,
    nom_playlist     VARCHAR (50) NOT NULL ,
    photo_playlist   VARCHAR (150)  DEFAULT '/ressources/images/playlists_photo/default_playlist_photo.png',
    CONSTRAINT playlist_PK PRIMARY KEY (id_playlist)
)WITHOUT OIDS;



------------------------------------------------------------
-- Table: utilisateur
------------------------------------------------------------
drop table if exists public.utilisateur CASCADE ;
CREATE TABLE public.utilisateur(
	id_utilisateur        SERIAL NOT NULL ,
	prenom         VARCHAR (50) NOT NULL ,
	nom            VARCHAR (50) NOT NULL ,
	date_naissance DATE NOT NULL ,
	mail           VARCHAR (50) NOT NULL UNIQUE ,
	mdp            VARCHAR (150) NOT NULL ,
	photo_profil   VARCHAR (150) NOT NULL DEFAULT '/ressources/images/users_pp/default_user_pp.png',
	id_playlist_favoris INT NOT NULL,
	CONSTRAINT utilisateur_PK PRIMARY KEY (id_utilisateur),
    CONSTRAINT favoris_FK FOREIGN KEY (id_playlist_favoris) REFERENCES public.playlist(id_playlist)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: artiste
------------------------------------------------------------
drop table if exists public.artiste CASCADE ;
CREATE TABLE public.artiste(
	id_artiste            SERIAL NOT NULL ,
	nom_artiste           VARCHAR (50) NOT NULL UNIQUE ,
	type_artiste          VARCHAR (50) NOT NULL ,
	description_artiste   TEXT NOT NULL ,
	photo_artiste         VARCHAR (150)  DEFAULT '/ressources/images/artistes_pp/default_artiste_pp.png',
	CONSTRAINT artiste_PK PRIMARY KEY (id_artiste)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: album
------------------------------------------------------------
drop table if exists public.album CASCADE ;
CREATE TABLE public.album(
	id_album              SERIAL NOT NULL ,
	nom_album             VARCHAR (50) NOT NULL ,
	date_parution_album   DATE NOT NULL ,
	style_album           VARCHAR (50) NOT NULL ,
	cover_album           VARCHAR (150) DEFAULT '/ressources/images/albums_cover/default_album_cover.png',
	id_artiste            INT  NOT NULL  ,
	CONSTRAINT album_PK PRIMARY KEY (id_album)

	,CONSTRAINT album_artiste_FK FOREIGN KEY (id_artiste) REFERENCES public.artiste(id_artiste)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: morceau
------------------------------------------------------------
drop table if exists public.morceau CASCADE ;
CREATE TABLE public.morceau(
	id_morceau      SERIAL NOT NULL ,
	nom_morceau     VARCHAR (50) NOT NULL ,
	duree_morceau   INT NOT NULL ,
	lien            VARCHAR (150) NOT NULL ,
	explicit        BOOL  NOT NULL DEFAULT FALSE,
	id_album        INT  NOT NULL  ,
	CONSTRAINT morceau_PK PRIMARY KEY (id_morceau)

	,CONSTRAINT morceau_album_FK FOREIGN KEY (id_album) REFERENCES public.album(id_album)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: user_playlist
------------------------------------------------------------
drop table if exists public.user_playlist CASCADE ;
CREATE TABLE public.user_playlist(
	id_playlist              INT  NOT NULL ,
	id_utilisateur                 INT  NOT NULL ,
	date_creation_playlist   DATE  NOT NULL DEFAULT current_timestamp,
	CONSTRAINT user_playlist_PK PRIMARY KEY (id_playlist,id_utilisateur)

	,CONSTRAINT user_playlist_playlist_FK FOREIGN KEY (id_playlist) REFERENCES public.playlist(id_playlist)
	,CONSTRAINT user_playlist_user0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur (id_utilisateur)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: playlist_morceau
------------------------------------------------------------
drop table if exists public.playlist_morceau CASCADE ;
CREATE TABLE public.playlist_morceau(
	id_morceau            INT  NOT NULL ,
	id_playlist           INT  NOT NULL ,
	date_ajout_playlist   DATE  NOT NULL DEFAULT current_timestamp ,
	CONSTRAINT playlist_morceau_PK PRIMARY KEY (id_morceau,id_playlist)

	,CONSTRAINT playlist_morceau_morceau_FK FOREIGN KEY (id_morceau) REFERENCES public.morceau(id_morceau)
	,CONSTRAINT playlist_morceau_playlist0_FK FOREIGN KEY (id_playlist) REFERENCES public.playlist(id_playlist)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: récemment écoutés
------------------------------------------------------------
drop table if exists public.recemment_ecoutes CASCADE ;
CREATE TABLE public.recemment_ecoutes(
	id_morceau   INT  NOT NULL ,
	id_utilisateur      INT  NOT NULL  ,
	CONSTRAINT recemment_ecoutes_PK PRIMARY KEY (id_morceau,id_utilisateur)

	,CONSTRAINT recemment_ecoutes_morceau_FK FOREIGN KEY (id_morceau) REFERENCES public.morceau(id_morceau)
	,CONSTRAINT recemment_ecoutes_user0_FK FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur (id_utilisateur)
)WITHOUT OIDS;


