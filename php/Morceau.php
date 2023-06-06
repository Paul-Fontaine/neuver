<?php
session_start();

require_once 'DB.php';

class Morceau
{

    public $id_morceau;

    function __construct($id)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT * FROM morceau
            WHERE id_morceau = :id_morceau
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id, PDO::PARAM_INT);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            foreach (array_keys($result) as $attribut){
                $this->$attribut = $result[$attribut];
            }
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
        }
    }
    
    /**
     * return all the infos about the instance of morceau
     * @return array|false
     */
    static function infosMorceau($id_morceau)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT m.id_morceau,
                   m.nom_morceau,
                   m.duree_morceau,
                   m.lien,
                   m.explicit,
                   m.id_album,
                   al.nom_album,
                   al.cover_album,
                   ar.nom_artiste,
                   ar.id_artiste
            FROM morceau m
            JOIN album al on al.id_album = m.id_album
            JOIN artiste ar on ar.id_artiste = al.id_artiste
            WHERE m.id_morceau = :id_morceau
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_morceau', $id_morceau);
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
     * return all the songs in an album
     * @return array|false
     */

    function morceauInAlbum($id_album)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT m.nom_morceau,
                   m.lien,
                   m.id_morceau,
                   m.explicit,
                   al.nom_album,
                   ar.nom_artiste
            FROM morceau m
            JOIN album al on al.id_album = m.id_album
            JOIN artiste ar on ar.id_artiste = al.id_artiste
            WHERE m.id_album = :id_album ORDER BY m.id_morceau
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $id_album);
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
     * return all the songs in a playlist
     * @return array|false
     */

     function morceauInPlaylist($id_playlist)
     {
         try {
             $db = DB::connexion();
             $request = "
             SELECT m.nom_morceau,
                    m.lien,
                    m.explicit,
                    m.id_morceau,
                    al.nom_album,
                    ar.nom_artiste
             FROM playlist_morceau pm
             JOIN morceau m on m.id_morceau = pm.id_morceau
             JOIN album al on al.id_album = m.id_album
             JOIN artiste ar on ar.id_artiste = al.id_artiste
             WHERE pm.id_playlist = :id_playlist ORDER BY m.id_morceau
             ;";
             $statement = $db->prepare($request);
             $statement->bindParam(':id_playlist', $id_playlist);
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

}