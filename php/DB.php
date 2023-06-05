<?php

require 'constants.php';

class DB {
    static $db=null;
    static function connexion()
    {
        if (self::$db != null) {
            return self::$db;
        }

        try {
            $db = new PDO(
                "pgsql:dbname=".DB_NAME.";host=".DB_SERVER.";port=".DB_PORT,
                DB_USER,
                DB_PASSWORD
            );
        }
        catch (PDOException $e) {
            echo 'Connexion échouée : ' . $e->getMessage() . "<br>code d'erreur : " . (int)$e->getCode();
            return false;
        }

        self::$db = $db;
        return $db;
    }
}