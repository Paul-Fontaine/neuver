<?php
session_start();

require_once 'DB.php';

function auth_state(string $mail, string $mdp){
    $db = DB::connexion();
    if (empty($_SESSION['id_user'])){

        if (!empty($mail) and !empty($mdp)){

            $request = '
            SELECT id_user FROM user
            WHERE mail =:mail AND mdp=crypt(:mdp,mdp)
            ';
            $statement = $db->prepare($request);
            $statement->bindParam(':username', $mail);
            $statement->bindParam(':mdp', $mdp);
            $statement->execute();

            $result = $statement->fetch();

            if (!empty($result['id_user'])){
                $_SESSION['id_user'] = $result['id_user'];
                return 'connected';
            }
            return "incorrect";
        }
        return "not connected";
    }
    return "connected";
}

/**
 * create a new user in the db
 * @param string $mail
 * @param string $prenom
 * @param string $nom
 * @param string $date_naissance
 * @param        $mdp
 * @return bool true on success | false on failure
 */
function addUser(string $mail, string $prenom, string $nom, string $date_naissance, string $mdp): bool
{
    try {
        $db = DB::connexion();

        $request = '
        INSERT INTO "user"(prenom, nom, date_naissance, mail, mdp) VALUES 
        (:prenom, :nom, :date_naissance, :mail, :mdp);
        ';
        $statement = $db->prepare($request);
        $statement->bindParam(':prenom', $prenom);
        $statement->bindParam(':nom', $nom);
        $statement->bindParam('$:date_naissance', $date_naissance);
        $statement->bindParam(':mail', $mail);
        $statement->bindParam(':mdp', $mdp);
        $statement->execute();

        return true;
    }
    catch (PDOException $exception)
    {
        error_log('Request error: '.$exception->getMessage());
        return false;
    }

}