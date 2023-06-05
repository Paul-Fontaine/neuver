<?php
require_once 'Research.php';
require_once 'User.php';
require_once 'Artiste.php';
require_once 'Album.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);

try {
    DB::connexion();
}
catch (PDOException $exception){
    header('HTTP/1.1 503 Service Unavailable');
    echo $exception->getMessage();
    exit();
}

switch ($requestRessource)
{
    case 'authentification':
        authentification();
    case 'favoris':
    case 'inscription':
        inscription();
    case 'accueil':
        accueil();
    case 'profil':
        profil();
    case 'playlist':
        playlist();
    case 'modif_profil':
        modif_profil();
    case 'recherche_morceaux':
        recherche_morceaux($requestMethod);
    case 'recherche_albums':
        recherche_albums($requestMethod);
    case 'recherche_artistes':
        recherche_artistes($requestMethod);
    case 'infos_artiste':
        infos_artiste($requestMethod);
    case 'album_artiste':
        album_artiste($requestMethod);
    case 'infos_album':
        infos_album($requestMethod);
}

function authentification()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'GET':
            if (isset($_GET['mail']) and isset($_GET['mdp'])){
                header('Content-Type: text/json; charset=utf-8');
                header('Cache-control: no-store, no-cache, must-revalidate');
                header('Pragma: no-cache');
                header('HTTP/1.1 200 OK');
                echo User::auth_state($_GET['mail'], $_GET['mdp']);
            }
            else {
                header('HTTP/1.1 400 Bad Request');
            }
            exit();
    }
}

function inscription()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'POST':
            if (!empty($_POST['prenom']) && !empty($_POST['nom']) && !empty($_POST['date_naissance']) && !empty($_POST['mail']) && !empty($_POST['mdp'])){
                if($_POST['mdp'] == $_POST['mdp_conf']){
                    header('Content-Type: text/plain; charset=utf-8');
                    header('Cache-control: no-store, no-cache, must-revalidate');
                    header('Pragma: no-cache');
                    header('HTTP/1.1 200 OK');
                    User::addUser($_POST['mail'], $_POST['prenom'], $_POST['nom'], $_POST['date_naissance'], $_POST['mdp']);
                    echo 'inscrit';

                }
                else{
                    //header('HTTP/1.1 400 Bad Request');
                    echo 'probleme_mdp';
                }

            }else {
                //header('HTTP/1.1 400 Bad Request');
                echo 'non_inscrit';
            }

            exit();
    }
}

function accueil()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'GET':
            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            $current_user = new User($_SESSION['id_utilisateur']);
            echo json_encode($current_user->recemment_ecoutes());
            unset($current_user);
            exit();
    }
}

function profil()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'GET':
            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            $current_user= new User($_SESSION['id_utilisateur']);
            echo json_encode([$current_user->prenom, $current_user->nom, $current_user->mail, $current_user->date_naissance, $current_user->age,$current_user->photo_profil]);
            unset($current_user);

            exit();
    }
}

function playlist()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'GET':
            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            $current_user= new User($_SESSION['id_utilisateur']);
            echo json_encode($current_user->getPlaylists());
            unset($current_user);
            
            exit();
    }
}

function modif_profil()
{
    global $requestMethod;
    switch ($requestMethod)
    {
        case 'PUT':
            parse_str(file_get_contents('php://input'), $_PUT);
            if($_PUT['mdp'] == $_PUT['mdp_conf']){
                header('Content-Type: text/json; charset=utf-8');
                header('Cache-control: no-store, no-cache, must-revalidate');
                header('Pragma: no-cache');
                header('HTTP/1.1 200 OK');
                $current_user= new User($_SESSION['id_utilisateur']);
                if(empty($_PUT['nom'])){
                    $nom = $current_user->nom;
                }else{
                    $nom = $_PUT['nom'];
                }
                if(empty($_PUT['prenom'])){
                    $prenom = $current_user->prenom;
                }else{
                    $prenom = $_PUT['prenom'];
                }
                if(empty($_PUT['date_naissance'])){
                    $date_naissance = $current_user->date_naissance;
                }else{
                    $date_naissance = $_PUT['date_naissance'];
                }
                if(empty($_PUT['mail'])){
                    $mail = $current_user->mail;
                }else{
                    $mail = $_PUT['mail'];
                }
                $current_user->modifyInfoUser($nom, $prenom, $date_naissance, $mail, $_PUT['mdp']);
                unset($current_user);
                echo'inscrit';
            }
            else{
                echo 'probleme_mdp';
            }

            exit();
    }
}


/**
 * renvoie au JS les morceaux qui correspondent à la recherche au format JSON
 * @param string $requestMethod must be GET
 * @return void
 */
function recherche_morceaux(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['textToSearch'])){
            $data = Research::searchSongs($_GET['textToSearch']);

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}

/**
 * renvoie au JS les albums qui correspondent à la recherche au format JSON
 * @param string $requestMethod must be GET
 * @return void
 */
function recherche_albums(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['textToSearch'])){
            $data = Research::searchAlbums($_GET['textToSearch']);

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}

/**
 * renvoie au JS les artistes qui correspondent à la recherche au format JSON
 * @param string $requestMethod must be GET
 * @return void
 */
function recherche_artistes(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['textToSearch'])){
            $data = Research::searchArtists($_GET['textToSearch']);

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}


function infos_artiste(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['id_artiste'])){
            $artiste = new Artiste($_GET['id_artiste']);
            $data = $artiste->infosArtiste();

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}

function album_artiste(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['id_artiste'])){
            $artiste = new Artiste($_GET['id_artiste']);
            $data = $artiste->albums();

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}

function infos_album(string $requestMethod)
{
    if ($requestMethod === 'GET'){
        if (isset($_GET['id_album'])){
            $album = new Album($_GET['id_album']);
            $data = $album->infosAlbum();

            header('Content-Type: text/json; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('HTTP/1.1 200 OK');
            echo json_encode($data);
            exit();
        }
        header('HTTP/1.1 400 Bad Request');
        exit();
    }
}
