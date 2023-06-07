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
    function getSongs($id_playlist)
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
            $statement->bindParam(':id_playlist', $id_playlist, PDO::PARAM_INT);
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
    function deleteSong($id_morceau, $id_playlist)
    {
        try {
            $db = DB::connexion();
            $request = "
            DELETE FROM playlist_morceau
            WHERE id_morceau = :id_morceau AND id_playlist = :id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id_morceau, PDO::PARAM_INT);
            $statement->bindParam(':id_playlist', $id_playlist, PDO::PARAM_INT);
            $statement->execute();

            return true;
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
            
            return true;

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


    static function in_favoris($id_morceau, $id_playlist)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT id_morceau
            FROM playlist_morceau
            WHERE id_morceau=:id_morceau AND id_playlist=:id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id_morceau);
            $statement->bindParam(':id_playlist', $id_playlist);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);
            
            return $result;

        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }

    function infosPlaylist(){
        try {
            $db = DB::connexion();
            $request = "
            SELECT p.id_playlist,
                   p.nom_playlist,
                   p.photo_playlist,
                   up.date_creation_playlist
            FROM playlist p
            JOIN user_playlist up on up.id_playlist = p.id_playlist
            WHERE p.id_playlist = :id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $this->id_playlist, PDO::PARAM_INT);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            $request = "
            SELECT SUM(m.duree_morceau)
            FROM morceau m
            JOIN playlist_morceau pm on pm.id_morceau = m.id_morceau
            WHERE id_playlist = :id_playlist
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $this->id_playlist, PDO::PARAM_INT);
            $statement->execute();
            $duree_totale = $statement->fetch(PDO::FETCH_NUM)[0];
            if($duree_totale === null){
                $duree_totale = 0;
            }

            $result['duree_totale'] = seconds2minute($duree_totale);

            $request = "
            SELECT id_morceau
            FROM playlist_morceau
            WHERE id_playlist = :id_playlist
            ORDER BY id_morceau
            LIMIT 1
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $this->id_playlist, PDO::PARAM_INT);
            $statement->execute();
            $first_id = $statement->fetch(PDO::FETCH_NUM)[0];

            $result['id_morceau'] = $first_id;
            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }

}

function seconds2minute(int $seconds): string
{
    $minutes = floor($seconds / 60);
    $seconds %= 60;
    if ($minutes<10){
        $minutes = '0'.$minutes;
    }
    if ($seconds<10){
        $seconds = '0'.$seconds;
    }
    return $minutes.":".$seconds;
}