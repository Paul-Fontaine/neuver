<?php

require_once "DB.php";

class Playlist
{
    public $id_playlist;
    public $nom_playlist;
    public $photo_playlist;

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


    /**
     * tested, it works
     * @return array|false all songs of the playlist with various infos for each song (cf SELECT)
     */
    function getSongs()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT m.id_morceau,
                   m.nom_morceau,
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
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }


    /**
     * delete a song from the playlist instance
     * tested, it works
     * @param $id_morceau
     * @return array|false the updated list of songs of the playlist
     */
    function deleteSong($id_morceau)
    {
        try {
            $db = DB::connexion();
            $request = "
            DELETE FROM playlist_morceau
            WHERE id_morceau = :id_morceau AND id_playlist = :id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id_morceau, PDO::PARAM_INT);
            $statement->bindParam(':id_playlist', $this->id_playlist, PDO::PARAM_INT);
            $statement->execute();

            return $this->getSongs();
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }


    /**
     * add a song to the current instance of playlist
     * tested, it works
     * @param $id_morceau
     * @return array|false
     */
    function addSong($id_morceau)
    {
        try {
            $db = DB::connexion();
            $request = "
                INSERT INTO playlist_morceau (
                    id_morceau,
                    id_playlist
                )
                VALUES (
                    :id_morceau,
                    :id_playlist
                )
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id_morceau);
            $statement->bindParam(':id_playlist', $this->id_playlist);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);
            
            return $this->getSongs();

        }
        catch (PDOException $exception)
        {
            if ($exception->getCode() == 23505){
                error_log('song was already in playlist. ');
                return true;
            }
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }
}