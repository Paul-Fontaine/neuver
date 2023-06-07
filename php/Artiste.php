<?php
session_start();

require_once 'DB.php';

class Artiste
{

    public $id_artiste;

    function __construct($id)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT * FROM artiste
            WHERE id_artiste = :id_artiste
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_artiste', $id, PDO::PARAM_INT);
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
     * return all the infos about the instance of artiste
     * @return array|false
     */
    function infosArtiste()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT id_artiste,
                   nom_artiste,
                   photo_artiste,
                   type_artiste,
                   description_artiste
            FROM artiste
            WHERE id_artiste = :id_artiste
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_artiste', $this->id_artiste, PDO::PARAM_INT);
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

    function albums()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT id_album,
                   nom_album,
                   date_parution_album,
                   style_album,
                   cover_album,
                   nom_artiste
            FROM artiste ar
            JOIN album al on al.id_artiste = ar.id_artiste
            WHERE ar.id_artiste = :id_artiste
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_artiste', $this->id_artiste, PDO::PARAM_INT);
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