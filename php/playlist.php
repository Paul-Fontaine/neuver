<?php

require_once "DB.php";

class playlist
{
    function __construct($id)
    {
        try {
            $db = DB::connexion();
            $request = "
        SELECT * FROM playlist
        WHERE id_playlist = :id_playlist
        ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $id, PDO::PARAM_INT);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            foreach (array_keys($result) as $attribut) {
                $this->$attribut = $result[$attribut];
            }
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
        }
    }

    function getSongs()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT m.nom_morceau,
                   m.duree_morceau,
                   m.lien,
                   m.explicit,
                   a.nom_album,
                   a.cover_album,
                   a2.nom_artiste
            FROM playlist pl
            JOIN playlist_morceau pl_m on pl.id_playlist = pl_m.id_playlist
            JOIN morceau m on pl_m.id_morceau = m.id_morceau
            JOIN album a on m.id_album = a.id_album
            JOIN artiste a2 on a.id_artiste = a2.id_artiste
            WHERE pl.id_playlist = :id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $this->id_playlist, PDO::PARAM_INT);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            foreach (array_keys($result) as $attribut) {
                $this->$attribut = $result[$attribut];
            }
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
        }
    }
}