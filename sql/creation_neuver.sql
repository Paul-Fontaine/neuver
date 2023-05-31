------------------------------------------------------------
--        Script Postgre 
------------------------------------------------------------



------------------------------------------------------------
-- Table: user
------------------------------------------------------------
CREATE TABLE public.user(
	id_user   SERIAL NOT NULL ,
	prenom    VARCHAR (50) NOT NULL ,
	nom       VARCHAR (50) NOT NULL ,
	age       INT  NOT NULL ,
	mail      VARCHAR (50) NOT NULL ,
	mdp       VARCHAR (150) NOT NULL  ,
	CONSTRAINT user_PK PRIMARY KEY (id_user)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: artiste
------------------------------------------------------------
CREATE TABLE public.artiste(
	id_artiste            SERIAL NOT NULL ,
	nom_artiste           VARCHAR (50) NOT NULL ,
	type_artiste          VARCHAR (50) NOT NULL ,
	description_artiste   VARCHAR (50) NOT NULL  ,
	CONSTRAINT artiste_PK PRIMARY KEY (id_artiste)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: album
------------------------------------------------------------
CREATE TABLE public.album(
	id_album              SERIAL NOT NULL ,
	nom_album             VARCHAR (50) NOT NULL ,
	date_parution_album   VARCHAR (50) NOT NULL ,
	style_album           VARCHAR (50) NOT NULL ,
	id_artiste            INT  NOT NULL  ,
	CONSTRAINT album_PK PRIMARY KEY (id_album)

	,CONSTRAINT album_artiste_FK FOREIGN KEY (id_artiste) REFERENCES public.artiste(id_artiste)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: morceau
------------------------------------------------------------
CREATE TABLE public.morceau(
	id_morceau      SERIAL NOT NULL ,
	nom_morceau     VARCHAR (50) NOT NULL ,
	duree_morceau   VARCHAR (50) NOT NULL ,
	nom_artiste     VARCHAR (50) NOT NULL ,
	nom_album       VARCHAR (50) NOT NULL ,
	lien            VARCHAR (150) NOT NULL ,
	id_album        INT  NOT NULL  ,
	CONSTRAINT morceau_PK PRIMARY KEY (id_morceau)

	,CONSTRAINT morceau_album_FK FOREIGN KEY (id_album) REFERENCES public.album(id_album)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: playlist
------------------------------------------------------------
CREATE TABLE public.playlist(
	id_playlist    SERIAL NOT NULL ,
	nom_playlist   VARCHAR (50) NOT NULL  ,
	CONSTRAINT playlist_PK PRIMARY KEY (id_playlist)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: user_playlist
------------------------------------------------------------
CREATE TABLE public.user_playlist(
	id_playlist              INT  NOT NULL ,
	id_user                  INT  NOT NULL ,
	date_creation_playlist   DATE  NOT NULL  ,
	CONSTRAINT user_playlist_PK PRIMARY KEY (id_playlist,id_user)

	,CONSTRAINT user_playlist_playlist_FK FOREIGN KEY (id_playlist) REFERENCES public.playlist(id_playlist)
	,CONSTRAINT user_playlist_user0_FK FOREIGN KEY (id_user) REFERENCES public.user(id_user)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: playlist_morceau
------------------------------------------------------------
CREATE TABLE public.playlist_morceau(
	id_morceau            INT  NOT NULL ,
	id_playlist           INT  NOT NULL ,
	date_ajout_playlist   DATE  NOT NULL  ,
	CONSTRAINT playlist_morceau_PK PRIMARY KEY (id_morceau,id_playlist)

	,CONSTRAINT playlist_morceau_morceau_FK FOREIGN KEY (id_morceau) REFERENCES public.morceau(id_morceau)
	,CONSTRAINT playlist_morceau_playlist0_FK FOREIGN KEY (id_playlist) REFERENCES public.playlist(id_playlist)
)WITHOUT OIDS;


------------------------------------------------------------
-- Table: récemment écoutés
------------------------------------------------------------
CREATE TABLE public.recemment_ecoutes(
	id_morceau   INT  NOT NULL ,
	id_user      INT  NOT NULL  ,
	CONSTRAINT recemment_ecoutes_PK PRIMARY KEY (id_morceau,id_user)

	,CONSTRAINT recemment_ecoutes_morceau_FK FOREIGN KEY (id_morceau) REFERENCES public.morceau(id_morceau)
	,CONSTRAINT recemment_ecoutes_user0_FK FOREIGN KEY (id_user) REFERENCES public.user(id_user)
)WITHOUT OIDS;



