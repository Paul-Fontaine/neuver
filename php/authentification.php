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

// coucou ryan