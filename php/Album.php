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

}


$rap_isen = new album(1);
var_dump(json_encode($rap_isen));