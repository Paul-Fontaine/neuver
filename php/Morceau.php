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

}

$Rap_v2 = new morceau(1);
var_dump(json_encode($Rap_v2));