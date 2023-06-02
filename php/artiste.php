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

}

$gauthier = new artiste(1);
var_dump(json_encode($gauthier));


