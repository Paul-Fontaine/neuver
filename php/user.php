<?php
session_start();

require_once 'DB.php';

class User
{

    public $id_utilisateur;
    public $age;

    function __construct($id)
    {
        $db = DB::connexion();
        $request = "
        SELECT * FROM utilisateur
        WHERE id_utilisateur = :id_utilisateur
        ;";
        $statement = $db->prepare($request);
        $statement->bindParam(':id_utilisateur', $id, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        foreach (array_keys($result) as $attribut){
            $this->$attribut = $result[$attribut];
        }
        $this->age = $this->calcAge();
    }

    function calcAge(){
        $now = new DateTime();
        $birthday = DateTime::createFromFormat('Y-m-d', $this->date_naissance);
        return $now->diff($birthday)->y;
    }

    /**
     * tell if a user is connected or if its pwd is correct
     * @param string $mail
     * @param string $mdp
     * @return string
     */
    static function auth_state(string $mail, string $mdp){
        $db = DB::connexion();
        if (empty($_SESSION['id_utilisateur'])){

            if (!empty($mail) and !empty($mdp)){

                $request = '
            SELECT id_utilisateur FROM utilisateur
            WHERE mail =:mail AND mdp=crypt(:mdp,mdp)
            ';
                $statement = $db->prepare($request);
                $statement->bindParam(':username', $mail);
                $statement->bindParam(':mdp', $mdp);
                $statement->execute();

                $result = $statement->fetch();

                if (!empty($result['id_utilisateur'])){
                    $_SESSION['id_utilisateur'] = $result['id_utilisateur'];
                    return 'connected';
                }
                return "incorrect";
            }
            return "not connected";
        }
        return "connected";
    }

    /**
     * create a new user in the db. It will also create a new playlist favoris and link it with the new user
     * @param string $mail
     * @param string $prenom
     * @param string $nom
     * @param string $date_naissance
     * @param string $mdp
     * @return bool true on success | false on failure
     */
    static function addUser(string $mail, string $prenom, string $nom, string $date_naissance, string $mdp): bool
    {
        try {
            $db = DB::connexion();

            // create the new user and get its id_utilisateur
            $request = "
        INSERT INTO utilisateur(prenom, nom, date_naissance, mail, mdp) VALUES 
        (:prenom, :nom, :date_naissance, :mail, crypt('$mdp', gen_salt('md5')) )
        RETURNING id_utilisateur;
        ";
            $statement = $db->prepare($request);
            $statement->bindParam(':prenom', $prenom);
            $statement->bindParam(':nom', $nom);
            $statement->bindParam(':date_naissance', $date_naissance);
            $statement->bindParam(':mail', $mail);
            $statement->execute();

            $id_new_user = $statement->fetch(PDO::FETCH_NUM)[0];

            // create a new playlist named 'favoris' and get its id_playlist
            $request = "
        INSERT INTO playlist(nom_playlist, photo_playlist) VALUES 
        ('favoris', '/ressources/images/playlists_photo/favoris.png')
        RETURNING id_playlist;
        ";
            $statement = $db->prepare($request);
            $statement->execute();

            $id_favoris_new_user = $statement->fetch(PDO::FETCH_NUM)[0];

            // link the new user and its favoris playlist
            $request = "
        INSERT INTO user_playlist(id_playlist, id_utilisateur) VALUES 
        ($id_favoris_new_user, $id_new_user)
        ";
            $statement = $db->prepare($request);
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
     * @return array the ten last songs listenned (their id)
     */
    function recemment_ecoutes()
    {
        $db = DB::connexion();
        $request = "
        SELECT id_morceau FROM recemment_ecoutes
        WHERE id_utilisateur = :id_utilisateur
        ;";
        $statement = $db->prepare($request);
        $statement->bindParam(':id_utilisateur', $this->id_utilisateur);
        $statement->execute();
        $result =  $statement->fetchAll(PDO::FETCH_NUM);
        $songs = array();
        foreach ($result as $id_song){
            array_push($songs, $id_song[0]);
        }
        return $songs;
    }
}

$paul = new User(1);
