<?php
session_start();


require_once 'DB.php';

class User
{

    public $id_utilisateur;
    public $prenom;
    public $nom;
    public $date_naissance;
    public $age;
    public $mail;
    public $photo_profil;
    public $id_playlist_favoris;
    public $mdp;


    function __construct($id)
    {
        try {
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
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
        }
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
        if (!empty($mail) and !empty($mdp)){

            $request = '
            SELECT id_utilisateur FROM utilisateur
            WHERE mail =:mail AND mdp=crypt(:mdp,mdp)
            ';
            $statement = $db->prepare($request);
            $statement->bindParam(':mail', $mail);
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


    /**
     * create a new user in the db. It will also create a new playlist favoris and link it with the new user<br>
     * tested, it works
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

            // create a new playlist named 'favoris' and get its id_playlist
            $request = "
            INSERT INTO playlist(nom_playlist, photo_playlist) VALUES 
            ('favoris', '/ressources/images/playlists_photo/favoris.png')
            RETURNING id_playlist;
            ";
            $statement = $db->prepare($request);
            $statement->execute();

            $id_favoris_new_user = $statement->fetch(PDO::FETCH_NUM)[0];

            // create the new user and link the playlist favoris
            $request = "
            INSERT INTO utilisateur(prenom, nom, date_naissance, mail, mdp, id_playlist_favoris) VALUES 
            (:prenom, :nom, :date_naissance, :mail, crypt('$mdp', gen_salt('md5')), :favoris)
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':prenom', $prenom);
            $statement->bindParam(':nom', $nom);
            $statement->bindParam(':date_naissance', $date_naissance);
            $statement->bindParam(':mail', $mail);
            $statement->bindParam(':favoris', $id_favoris_new_user);
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
     * tested, it works
     * @param string $nom
     * @param string $prenom
     * @param string $date_naissance
     * @param string $mail
     * @param string $mdp
     * @return bool
     */
    function modifyInfoUser(string $nom, string $prenom, string $date_naissance, string $mail, string $mdp)
    {
        try {
            $db = DB::connexion();
            $request = "
            UPDATE utilisateur
            SET prenom = :prenom,
                nom = :nom,
                date_naissance = :date_naissance,
                mail = :mail";
            if (!empty($mdp)) {
                $request .= ", mdp = crypt('$mdp', gen_salt('md5'))";
            }
            $request .= " WHERE id_utilisateur = :id";
            $stmt=$db->prepare($request);
            $stmt->bindParam(':prenom', $prenom);
            $stmt->bindParam(':nom', $nom);
            $stmt->bindParam(':date_naissance', $date_naissance);
            $stmt->bindParam(':mail', $mail);
            $stmt->bindParam(':id', $this->id_utilisateur);
            $stmt->execute();
            return true;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }


    /**
     * We'll probably won't use the m.id_morceau and should consider remove it later
     * tested, it works
     * @return array|false the ten last songs listenned
     */
    function recemment_ecoutes()
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
                   ar.nom_artiste
            FROM recemment_ecoutes re
            JOIN morceau m on m.id_morceau = re.id_morceau
            JOIN album al on al.id_album = m.id_album
            JOIN artiste ar on ar.id_artiste = al.id_artiste
            WHERE re.id_utilisateur = :id_utilisateur
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_utilisateur', $this->id_utilisateur);
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
     * @return array|false the list of the user's playlist
     */
    function getPlaylists()
    {
        try {
            $db = DB::connexion();
            $request = "
            SELECT p.* FROM user_playlist u_p
            JOIN playlist p on p.id_playlist = u_p.id_playlist
            WHERE u_p.id_utilisateur = :id_utilisateur
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_utilisateur', $this->id_utilisateur);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);

            $request = "
            SELECT p.* FROM utilisateur u
            JOIN playlist p on p.id_playlist = u.id_playlist_favoris
            WHERE u.id_utilisateur = :id_utilisateur
            ";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_utilisateur', $this->id_utilisateur);
            $statement->execute();
            $playlist_favoris = $statement->fetch(PDO::FETCH_ASSOC);
            array_push($result, $playlist_favoris);

            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }


    static function addPlaylist(string $nom_playlist, string $photo_playlist = ""): bool
    {
        try {
            $db = DB::connexion();

            // create a new playlist named 'nom_playlist' and get its id_playlist
            $request = "
            INSERT INTO playlist(nom_playlist, photo_playlist) VALUES 
            (:nom_playlist, '/ressources/images/playlists_photo/favoris.png')
            RETURNING id_playlist;
            ";
            $statement = $db->prepare($request);
            $statement->bindParam(':nom_playlist', $nom_playlist);
            $statement->execute();

            $id_new_playlist = $statement->fetch(PDO::FETCH_NUM)[0];
            

            // Link the new playlist and user

            $request = "
            INSERT INTO user_playlist(id_playlist, id_utilisateur) VALUES 
            (:id_playlist, :id_utilisateur)
            ;";
            $statement = $db->prepare($request);
            $statement->bindParam(':id_playlist', $id_new_playlist);
            $statement->bindParam(':id_utilisateur', $this->id_utilisateur);
            $statement->execute();

            return true;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }

    
}

