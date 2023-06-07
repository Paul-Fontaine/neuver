<?php
session_start();

require_once 'DB.php';

class Album
{

    public $id_album;

    function __construct($id)
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT * FROM album
            WHERE id_album = :id_album
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $id, PDO::PARAM_INT);
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

    function infosAlbum(){
        try {
            $db = DB::connexion();
            $request = "
            SELECT id_album,
                   nom_album,
                   date_parution_album,
                   style_album,
                   cover_album,
                   nom_artiste
            FROM album a  
            JOIN artiste a2 on a2.id_artiste = a.id_artiste
            WHERE a.id_album = :id_album
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $this->id_album, PDO::PARAM_INT);
            $statement->execute();
            $result = $statement->fetch(PDO::FETCH_ASSOC);

            $request = "
            SELECT SUM(morceau.duree_morceau)
            FROM morceau
            WHERE id_album = :id_album
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $this->id_album, PDO::PARAM_INT);
            $statement->execute();
            $duree_totale = $statement->fetch(PDO::FETCH_NUM)[0];

            $result['duree_totale'] = seconds2minutes($duree_totale);
            
            $request = "
            SELECT id_morceau
            FROM morceau
            WHERE id_album = :id_album
            ORDER BY id_morceau
            LIMIT 1
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $this->id_album, PDO::PARAM_INT);
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

    function songs()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT nom_morceau,
                   lien,
                   id_morceau,
                   duree_morceau,
                   cover_album,
                   nom_artiste
            FROM album a  
            JOIN morceau m on a.id_album = m.id_album
            JOIN artiste a2 on a2.id_artiste = a.id_artiste
            WHERE a.id_album = :id_album
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_album', $this->id_album, PDO::PARAM_INT);
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

function seconds2minutes(int $seconds): string
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