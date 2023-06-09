var currentElement = document.getElementById("current_page");

var name_page = document.getElementById("name_page").textContent;
if(name_page === "Accueil"){
    ajaxRequest(
        'GET',
        '../php/request.php/accueil',
        recent_ecoutes
    );
}


//fonction qui vérifie dans quelle page on se trouve et affiche les informations en conséquences
var name_page ="Accueil";
// Création d'une nouvelle instance de MutationObserver
var observer_current_page = new MutationObserver(function(mutations) {
    // Fonction à exécuter lorsque des mutations sont détectées
    if(name_page != document.getElementById("name_page").textContent){
        if(document.getElementById("name_page").textContent === "Accueil"){
            ajaxRequest(
                'GET',
                '../php/request.php/accueil',
                recent_ecoutes
            );
        }
        if(document.getElementById("name_page").textContent === "Profil"){
            ajaxRequest(
                'GET',
                '../php/request.php/profil',
                info_profil
            );
        }
        if(document.getElementById("name_page").textContent === "Playlist"){
            ajaxRequest(
                'GET',
                '../php/request.php/playlist',
                user_playlist
            );
        }
        name_page = document.getElementById("name_page").textContent;
    }
});

// Configuration de l'observation pour les modifications du contenu de l'élément
var config = { childList: true, subtree: true };

// Démarrage de l'observation sur l'élément cible avec la configuration spécifiée
observer_current_page.observe(currentElement, config);

function seconds2minutes(sec){
    let minutes = Math.floor(sec/60);
    let seconds = sec%60;
    if (minutes<10){
        minutes = '0'+minutes;
    }
    if (seconds<10){
        seconds = '0'+seconds;
    }
    return minutes+':'+seconds;
}

function recent_ecoutes(data)
{
    data =JSON.parse(data);
    let ecoutes = "";
    for(let i = 0; i<data.length;i++){
        if((i+1)%2 != 0){
            ecoutes = ecoutes +
                '<div class="row">'+
                '<div class="new_music_play col-md-5 p-4" style="background-color: #2C2C2C;" value="'+data[i]['id_morceau']+'">';
        }
        else{
            ecoutes = ecoutes +
                '<div class="new_music_play col-md-5 p-4 offset-md-1" style="background-color: #2C2C2C;" value="'+data[i]['id_morceau']+'">';
        }
        ecoutes = ecoutes +
            '<div class="row icon_playlist">'+
            '<img src="..' + data[i]['cover_album'] + '" style="width: 25%; height: 25%;" />' +
            '<div class="col-md-9 p-3">'+
            '<h3 class="text-white" id="titre_music">'+data[i]['nom_morceau']+'</h3>'+
            '<p></p>'+
            '<div class="row">'+
            '<div class="col-md-7">'+
            '<p class="text-white" id="artiste">'+data[i]['nom_artiste']+'</p>'+
            '</div>'+
            '<div class="col-md-2 offset-md-2">'+
            '<p class="text-white" id="durée">'+turnFormatSecondes(data[i]['duree_morceau'])+'</p>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        if((i+1)%2 === 0){
            ecoutes = ecoutes + '</div><br>';
        }
    }
    if(data.length%2 != 0){
        ecoutes = ecoutes + '</div>';
    }
    if(document.getElementById("music_current").src === ""){
      document.getElementById("music_current").src  = '../'+data[0]['lien'];
      document.getElementById("music_current").value = "album";
      document.getElementById("artiste_play").value = data[0]['id_album'];
      document.getElementById("album_play").value = data[0]['id_morceau'];
      document.getElementById("music_play").textContent = data[0]['nom_morceau'].charAt(0).toUpperCase() + data[0]['nom_morceau'].slice(1);
      document.getElementById("artiste_play").textContent = 'Par '+data[0]['nom_artiste'].charAt(0).toUpperCase() + data[0]['nom_artiste'].slice(1);
      document.getElementById("album_play").textContent =" dans l'album : "+data[0]['nom_album'].charAt(0).toUpperCase() + data[0]['nom_album'].slice(1);
      ajaxRequest(
        'GET',
        '../php/request.php/in_fav_playlist',
        in_fav_playlist,
        'id_morceau='+data[0]['id_morceau']
      );
      
    }
    document.getElementById("recemment_ecoutes").innerHTML = ecoutes;



    //ajout musique
}

function info_profil(data)
{
    data =JSON.parse(data);
    document.getElementById("info_perso").innerHTML = ''+
        '<div class="col-md-6">'+
        '<img src="..' + data[5] + '" style="width: 90%; height: 90%;" />' +
        '</div>'+
        '<div class="col-md-6 ">'+
        '<div class="text-white section-info">'+
        '<h3>Informations personnelles :</h3>'+
        'Prénom Nom : <span class="text-white" id="text_nom">'+data[0].charAt(0).toUpperCase() + data[0].slice(1)+' '+data[1].charAt(0).toUpperCase() + data[1].slice(1)+'</span>'+
        '<br>'+
        'email : <span class="text-white" id="text_mail">'+data[2]+'</span>'+
        '<br>'+
        'date de naissance : <span class="text-white" id="text_date">'+data[3]+'</span>'+
        '<br>'+
        'age : <span class="text-white" id="text_age">'+data[4]+'</span>'+
        '<br>'+
        '<br>'+
        '<h3><a href="#" style="color: green;" id="modif_info_users">modifier mes infos persos :</a></h3>'+
        '<br>'+
        '<h3><a href="#" style="color: #00EB0A;" id="modif_abonnement">gérer mon abonnement :</a></h3>'+
        '<br>'+
        '<h3><a href="#" style="color: #00EB0A;">explicit content :</a></h3>'+
        '<br>'+
        '<h3><a href="#" style="color: #00EB0A;">politique de confidentialité :</a></h3>'+
        '<br>'+
        '<h3>Contact :</h3>'+
        '<br>'+
        'Par mail : groupe5@isen-ouest.yncrea.fr'+
        '<br>'+
        'Par téléphone : 06 30 40 75 07'+
        '</div>'+
        '</div>';
}


function user_playlist(data)
{
    data =JSON.parse(data);
    let playlist_list = "";
    let iter = 0;
    for(let i = 0; i<data.length-1;i++){
        if(data[i]['id_playlist'] != data[data.length-1]['id_playlist']){
            if(iter === 0){
                let first_playlist = '';
                first_playlist += ''+
                    '<div class="col-md-12 user_playlist" style="background-color: #00EBEB; height: 15vw;" value="'+data[i]['id_playlist']+'">';
                if(data[i]['photo_playlist'] != ''){
                    first_playlist +='<img src="..' + data[i]['photo_playlist'] + '"style="width: 100%; height: 100%;" class="icon_playlist" />';
                }
                first_playlist += ''+
                    '</div>';
                document.getElementById("fisrt_playlist").innerHTML = first_playlist;
                iter++;
            }
            else{
                if(iter === 1){
                    playlist_list = playlist_list +
                        '<br>'+
                        '<br>'+
                        '<div class="row">'+
                        '<div class="col-md-3">';
                }else{
                    playlist_list = playlist_list +
                        '<div class="col-md-3 offset-md-1">';
                }
                playlist_list = playlist_list+
                    '<div class="col-md-12 user_playlist" style="background-color: #00EBEB; height: 15vw;" value="'+data[i]['id_playlist']+'">';
                if(data[i]['photo_playlist'] != ''){
                    playlist_list +='<img src="..' + data[i]['photo_playlist'] + '"style="width: 100%; height: 100%;" class="icon_playlist" />';
                }
                playlist_list += ''+
                    '</div>'+
                    '</div>';
                if(iter === 3){
                    playlist_list = playlist_list +
                        '</div>';
                    iter = 0;
                }
                iter++;
            }
        }
    }
    if(iter-1 != 0 && playlist_list != ""){
        playlist_list = playlist_list +
            '</div>';
    }
    document.getElementById("print_playlists").innerHTML = playlist_list;
}



$('#iconProfil').on("click", () => {
    document.getElementById("bouton_acceuil").removeAttribute('style');
    document.getElementById("bouton_playlist").removeAttribute('style');
    document.getElementById("bouton_rechercher").removeAttribute('style');
    document.getElementById("iconProfil").classList.add("d-none");;
    document.getElementById("name_page").textContent = "Profil";
    currentElement.innerHTML = ''+
        '<div class="row" id="info_perso">'+
        '</div>';
})


$('#bouton_acceuil').on("click", () => {
    if(document.getElementById("name_page").textContent != "Accueil"){
        document.getElementById("bouton_acceuil").setAttribute("style", "color: #FFFFFF;");
        document.getElementById("bouton_playlist").removeAttribute('style');
        document.getElementById("bouton_rechercher").removeAttribute('style');
        document.getElementById("iconProfil").classList.remove("d-none");;
        document.getElementById("name_page").textContent = "Accueil";
        currentElement.innerHTML = ''+
            '<div class="row col-md-5 ">'+
            '<p class="text bg-black text-white">Dernière musique écoutées :</p>'+
            '</div>'+
            '<span id="recemment_ecoutes">'+
            '</span>';
    }
})

$('#bouton_playlist').on("click", () => {
    if(document.getElementById("name_page").textContent != "Playlist"){
        document.getElementById("bouton_playlist").setAttribute("style", "color: #FFFFFF;");
        document.getElementById("bouton_acceuil").removeAttribute('style');
        document.getElementById("bouton_rechercher").removeAttribute('style');
        document.getElementById("iconProfil").classList.remove("d-none");;
        document.getElementById("name_page").textContent = "Playlist";
        currentElement.innerHTML = '' +
            '<div class="row">' +
            '<div class="col-md-3">' +
            '<div class="col-md-12 " style="background-color: #00EBEB; height: 15vw;" id="nouv_playlist">' +
            '<i class="bi bi-plus-lg text-white plus-icon icon_playlist"></i>'+
            '</div>' +
            '</div>' +
            '<div class="col-md-3 offset-md-1">' +
            '<div class="col-md-12 " style="background-color: #f70a0a; height: 15vw;" id="fav_playlist">' +
            '<i class="bi bi-suit-heart-fill text-white plus-icon icon_playlist"> </i>' +
            '</div>' +
            '</div>' +
            '<div class="col-md-3 offset-md-1" id="fisrt_playlist">' +
            '</div>' +
            '</div>' +
            '<span id="print_playlists">' +
            '</span>';
    }
});

$('#bouton_rechercher').on("click", () => {
    if(document.getElementById("name_page").textContent != "Rechercher"){
        document.getElementById("bouton_rechercher").setAttribute("style", "color: #FFFFFF;");
        document.getElementById("bouton_acceuil").removeAttribute('style');
        document.getElementById("bouton_playlist").removeAttribute('style');
        document.getElementById("iconProfil").classList.remove("d-none");;
        document.getElementById("name_page").textContent = "Rechercher";
        currentElement.innerHTML = ''+
            '<div class="row col-md-11 ">'+
            '<input type="text" class="form-control" placeholder="Rechercher" id="text_for_search">'+
            '</div>'+
            '<br>'+
            '<div class="row">'+
            '<div class="col-md-4">'+
            '<h5 class="text-white" >Sélectionnez une option à rechercher : </h5>'+
            '</div>'+
            '<div class="col-md-1 offset-md-3">'+
            '<button class="btn btn-md-1 btn-success" style="background-color: #00EB0A;" id="research_all">Tout</button>'+
            '</div>'+
            '<div class="col-md-1">'+
            '<button class="btn btn-success" style="background-color: #8E8E8E;" id="research_artiste">Artistes</button>'+
            '</div>'+
            '<div class="col-md-1">'+
            '<button class="btn btn-success" style="background-color: #8E8E8E;" id="research_album">Albums</button>'+
            '</div>'+
            '<div class="col-md-1">'+
            '<button class="btn btn-success" style="background-color: #8E8E8E;" id="research_morceau">Morceaux</button>'+
            '</div>'+
            '</div>'+
            '<br>'+
            '<span id="all_place">'+
            '<span id="place_artiste"></span>'+
            '<br>'+
            '<span id="place_album"></span>'+
            '<br>'+
            '<span id="place_morceau"></span>'+
            '<br>';
        '</span>'
    }
})



// Attachez un gestionnaire d'événements à l'élément parent
currentElement.addEventListener("click", function(event) {
    // Vérifiez si l'élément cible est celui que vous recherchez
    if (event.target.id === "modif_info_users") {
        // Votre code à exécuter lorsque l'élément est cliqué
        document.getElementById("name_page").textContent = "modification_profil";
        document.getElementById("name_page").classList.add("d-none");
        currentElement.innerHTML = ''+
            '<span class="text-center" id="all2" style="overflow-y: hidden;">'+
            '<div class="container justify-content-center align-items-center offset-md-3">'+
            '<div class="row">'+
            '<div class="col-md-6 bg-light-green">'+
            '<h1 class="text-light">Modification du profil</h1>'+
            '</div>'+
            '</div>'+
            '<div class="row">'+
            '<div class="col-md-6 p-4" style="background-color: #2C2C2C; ">'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white">Nom :</span>'+
            '</div>'+
            '<input type="text" class="form-control bg-black border-green text-white" id="nom_inscr"  name="nom">'+
            '</div>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white">Prénom :</span>'+
            '</div>'+
            '<input type="text" class="form-control bg-black border-green text-white" id="prenom_inscr" name="prenom">'+
            '</div>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white">Date de naissance :</span>'+
            '</div>'+
            '<input type="text" class="form-control bg-black border-green text-white" id="birthdate_inscr" name="birthdate">'+
            '</div>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white"> mail :</span>'+
            '</div>'+
            '<input type="mail" class="form-control bg-black border-green text-white" id="mail_inscr" name="mail">'+
            '</div>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white"> mot de passe :</span>'+
            '</div>'+
            '<input type="password" class="form-control bg-black border-green text-white" id="pwd_inscr" name="password">'+
            '</div>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<div class="input-group mb-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text bg-black border-green text-white"> confirmation de mot de passe :</span>'+
            '</div>'+
            '<input type="password" class="form-control bg-black border-green text-white" id="pwd_inscr_conf" name="password_conf">'+
            '</div>'+
            '</div>'+
            '<div id="alert-erreur-mdp" class="d-none alert alert-danger row col-md-8 offset-md-2" role="alert">'+
            '<strong>Erreur lors de la modification :</strong><p class="text-center">Les mots de passes sont différents.</p>'+
            '</div>'+
            '<div class="row col-md-8 offset-md-2">'+
            '<button class="btn btn-success bg-light-green" id="change_info">Changer mes données</button>'+
            '</div>'+
            '<br>'+
            '</div>'+
            '</div>'+
            '<br>'+
            '</div>'+
            '</span>';
    }

    if (event.target.id === "change_info") {
        let prenom = $('#prenom_inscr').val();
        let nom = $('#nom_inscr').val();
        let date_naissance = $('#birthdate_inscr').val();
        let mail = $('#mail_inscr').val();
        let mdp = $('#pwd_inscr').val();
        let mdp_conf = $('#pwd_inscr_conf').val();

        ajaxRequest(
            'PUT',
            '../php/request.php/modif_profil',
            modif_profil,
            'prenom='+prenom+'&nom='+nom+'&date_naissance='+date_naissance+'&mail='+mail+'&mdp='+mdp+'&mdp_conf='+mdp_conf
        );
    }
    if (event.target.id === "nouv_playlist") {
        document.getElementById("name_page").textContent = "Créer une playlist";
        currentElement.innerHTML = ''+
            '<br>'+
            '<div class="row">'+
            '<div class="col-md-4">'+
            '<a href="#">'+
            '<div class="col-md-12" style="background-color: #00EBEB; height: 21vw;" id="choix_cover">'+
                '<h3>Choisissez une cover</h3>'+
            '</div>'+
            '</a>'+
            '</div>'+
            '<div class="col-md-4 offset-md-2 ">'+
            '<input type="text" class="form-control" placeholder="Nom de la nouvelle playlist" id="name_new_playlist">'+
            '<br>'+
            '<div id="alert-erreur-creation" class="d-none alert alert-danger row col-md-8 offset-md-2" role="alert">'+
            '<strong>Erreur lors de la creation :</strong> Remplissez bien toutes les cases.'+
            '</div>'+
            '<br>'+
            '<button class="btn btn-success bg-light-green" id="create_new_playlist">Créer la playlist</button>'+
            '</div>'+
            '</div>';
    }
    if (event.target.id === "create_new_playlist") {
        let name_new_playlist = $('#name_new_playlist').val();
        ajaxRequest(
            'POST',
            '../php/request.php/create_new_playlist',
            create_new_playlist,
            'nom_playlist='+name_new_playlist
        );
    }

    if (event.target.id === "fav_playlist") {
        ajaxRequest(
          'GET',
          '../php/request.php/infos_playlist_favoris',
          infos_playlist_favoris,
      );
    }
    if (event.target.id === "research_all"){
        document.getElementById("all_place").innerHTML= ''+
            '<span id="place_artiste"></span>'+
            '<br>'+
            '<span id="place_album"></span>'+
            '<br>'+
            '<span id="place_morceau"></span>'+
            '<br>';
    }
    if (event.target.id === "research_artiste" || event.target.id === "research_all") {
        if(event.target.id === "research_artiste"){
            document.getElementById("research_artiste").style.backgroundColor = "#00EB0A";
            document.getElementById("research_all").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_morceau").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_album").style.backgroundColor = "#8E8E8E";
            document.getElementById("all_place").innerHTML= ''+
                '<span id="place_artiste"></span>'+
                '<br>'+
                '<span id="place_album"></span>'+
                '<br>'+
                '<span id="place_morceau"></span>'+
                '<br>';
        }else{
            document.getElementById("research_all").style.backgroundColor = "#00EB0A";
            document.getElementById("research_artiste").style.backgroundColor = "#8E8E8E";
        }
        let textToSearch = $('#text_for_search').val();

        ajaxRequest(
            'GET',
            '../php/request.php/recherche_artistes',
            afficher_artiste,
            'textToSearch='+textToSearch
        );

    }
    if (event.target.id === "research_album" || event.target.id === "research_all") {
        if(event.target.id === "research_album"){
            document.getElementById("research_album").style.backgroundColor = "#00EB0A";
            document.getElementById("research_all").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_artiste").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_morceau").style.backgroundColor = "#8E8E8E";
            document.getElementById("all_place").innerHTML= ''+
                '<span id="place_album"></span>'+
                '<br>'+
                '<span id="place_artiste"></span>'+
                '<br>'+
                '<span id="place_morceau"></span>'+
                '<br>';
        }else{
            document.getElementById("research_all").style.backgroundColor = "#00EB0A";
            document.getElementById("research_album").style.backgroundColor = "#8E8E8E";
        }
        let textToSearch = $('#text_for_search').val();

        ajaxRequest(
            'GET',
            '../php/request.php/recherche_albums',
            afficher_album,
            'textToSearch='+textToSearch
        );
    }
    if (event.target.id === "research_morceau" || event.target.id === "research_all") {
        if(event.target.id === "research_morceau"){
            document.getElementById("research_morceau").style.backgroundColor = "#00EB0A";
            document.getElementById("research_all").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_artiste").style.backgroundColor = "#8E8E8E";
            document.getElementById("research_album").style.backgroundColor = "#8E8E8E";
            document.getElementById("all_place").innerHTML= ''+
                '<span id="place_morceau"></span>'+
                '<br>'+
                '<span id="place_artiste"></span>'+
                '<br>'+
                '<span id="place_album"></span>'+
                '<br>';
        }else{
            document.getElementById("research_all").style.backgroundColor = "#00EB0A";
            document.getElementById("research_morceau").style.backgroundColor = "#8E8E8E";
        }
        let textToSearch = $('#text_for_search').val();

        ajaxRequest(
            'GET',
            '../php/request.php/recherche_morceaux',
            afficher_morceau,
            'textToSearch='+textToSearch
        );
    }
    if (event.target.classList.contains("new_music_play")) {
        let id_morceau = event.target.getAttribute('value');
        ajaxRequest(
            'GET',
            '../php/request.php/play_new_morceau',
            play_new_morceau,
            'id_morceau=' + id_morceau
        );
        ajaxRequest(
            'POST',
            '../php/request.php/add_morceau_recent',
            () => {},
            'id_morceau=' + id_morceau
        );
        ajaxRequest(
          'GET',
          '../php/request.php/accueil',
          add_morceau_recent
        );
    }

    if (event.target.classList.contains("user_playlist")) {
      let id_playlist = event.target.getAttribute('value');
      ajaxRequest(
          'GET',
          '../php/request.php/infos_playlist',
          infos_playlist,
          'id_playlist='+id_playlist
      );
    }
    if(event.target.id === "deleted_playlist"){
      let id_playlist = event.target.getAttribute('value');
      ajaxRequest(
        'DELETE',
        '../php/request.php/delete_playlist',
        delete_playlist,
        'id_playlist='+id_playlist
      );
    }
    if(event.target.id === "delete_one_song"){
      let id_morceau = event.target.getAttribute('value');
      let id_playlist = document.getElementById('delete_playlist').getAttribute('data_id_playlist');
      ajaxRequest(
        'DELETE',
        '../php/request.php/delete_one_song_of_playlist',
        delete_one_song_of_playlist,
        'id_morceau='+id_morceau+'&id_playlist='+id_playlist
      );
    }
});

function add_morceau_recent(data){
  data =JSON.parse(data);
  if(data[0]['id_morceau'] === document.getElementById("album_play").value){
    if(document.getElementById("name_page").textContent === "Accueil"){
      ajaxRequest(
          'GET',
          '../php/request.php/accueil',
          recent_ecoutes
      );
    }
  }else{
    ajaxRequest(
      'POST',
      '../php/request.php/add_morceau_recent',
      () => {},
      'id_morceau=' + document.getElementById("album_play").value
    );
    ajaxRequest(
      'GET',
      '../php/request.php/accueil',
      add_morceau_recent
    );
  }
  
    
}

function modif_profil(data)
{
    switch (data){
        case 'inscrit':
            document.getElementById("bouton_acceuil").removeAttribute('style');
            document.getElementById("bouton_playlist").removeAttribute('style');
            document.getElementById("bouton_rechercher").removeAttribute('style');
            document.getElementById("name_page").classList.remove("d-none");
            document.getElementById("name_page").textContent = "Profil";
            currentElement.innerHTML = ''+
                '<div class="row">'+
                '<div class="col-md-6">'+
                '<i class="bi bi-person-circle large-icon2 text-white"></i>'+
                '</div>'+
                '<div class="col-md-6 ">'+
                '<div class="text-white section-info" id="info_perso">'+
                '</div>'+
                '</div>'+
                '</div>';
            break;
        case 'probleme_mdp':
            $('#alert-erreur-mdp').toggleClass('d-none');
            break;
    }
}

function create_new_playlist(data){
    switch (data){
        case 'playlist_not_create':
            $('#alert-erreur-creation').toggleClass('d-none');
            break;
        case 'playlist_create':
            document.getElementById("name_page").textContent = "Playlist";
            currentElement.innerHTML = '' +
                '<div class="row">' +
                '<div class="col-md-3">' +
                '<div class="col-md-12 " style="background-color: #00EBEB; height: 15vw;" id="nouv_playlist">' +
                '<i class="bi bi-plus-lg text-white plus-icon"></i>'+
                '</div>' +
                '</div>' +
                '<div class="col-md-3 offset-md-1">' +
                '<div class="col-md-12 " style="background-color: #f70a0a; height: 15vw;" id="fav_playlist">' +
                '<i class="bi bi-suit-heart-fill text-white plus-icon"> </i>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-3 offset-md-1" id="fisrt_playlist">' +
                '</div>' +
                '</div>' +
                '<span id="print_playlists">' +
                '</span>';
            break;
    }
}

function afficher_artiste(data)
{
    data =JSON.parse(data);
    let artiste = ""+
        '<br>'+
        '<div class="row col-md-5 ">'+
        '<p class="text bg-black text-white">Artistes :</p>'+
        '<hr style="color: #FFFFFF;">'+
        '</div>'+
        '<div class="row">';
    for(let i = 0; i<data.length;i++){
        artiste = artiste+
            '<div class="col-md-2 artistes_recherché" value="'+data[i]['id_artiste']+'">'+
            '<img src="..' + data[i]['photo_artiste'] + '" style="width: 70%; height: 70%;" />' +
            '<p class="text-white">'+data[i]['nom_artiste']+'</p>'+
            '</div>';
    }
    document.getElementById("place_artiste").innerHTML = artiste+'</div>';

    $('.artistes_recherché').on('click', (event) => {
        let id_artiste = $(event.target).closest('.artistes_recherché').attr('value');
        ajaxRequest(
            'GET',
            '../php/request.php/infos_artiste',
            afficher_infos_artiste,
            'id_artiste='+id_artiste
        );
    });
}

function afficher_album(data)
{
    data =JSON.parse(data);
    let album = ""+
        '<br>'+
        '<div class="row col-md-5 ">'+
        '<p class="text bg-black text-white">Albums :</p>'+
        '<hr style="color: #FFFFFF;">'+
        '</div>';
    for(let i = 0; i<data.length;i++){
        album = album+
            '<div class="row">'+
            '<div class="col-md-5 p-4 albums_recherché" style="background-color: #2C2C2C;" value="'+data[i]['id_album']+'">'+
            '<div class="row">'+
            '<img src="..' + data[i]['cover_album'] + '" style="width: 25%; height: 25%;" />' +
            '<div class="col-md-9 p-3 text-white">'+
            '<h3 id="titre_music">'+
            data[i]['nom_album']+
            '</h3>'+
            '<p></p>'+
            '<div class="row">'+
            '<div class="col-md-9">'+
            '<p>'+
            data[i]['nom_artiste']+
            '</p>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<br>';
    }
    document.getElementById("place_album").innerHTML = album;

    $('.albums_recherché').on('click', (event) => {
        let id_album = $(event.target).closest('.albums_recherché').attr('value');
        ajaxRequest(
            'GET',
            '../php/request.php/infos_album',
            afficher_infos_album,
            'id_album='+id_album
        );
    })
}
function afficher_morceau(data)
{
    data =JSON.parse(data);


    let morceau = ""+
        '<br>'+
        '<div class="row col-md-5 ">'+
        '<p class="text bg-black text-white">Morceaux :</p>'+
        '<hr style="color: #FFFFFF;">'+
        '</div>';
    for(let i = 0; i<data.length;i++){
        data[i]['duree_morceau'] = seconds2minutes(data[i]['duree_morceau']);
        morceau = morceau+
            '<div class="row">'+
            '<div class="new_music_play col-md-5 p-4 morceaux_recherché" style="background-color: #2C2C2C;" value="'+data[i]['id_morceau']+'">'+
            '<div class="row icon_playlist">'+
            '<img src="..' + data[i]['cover_album'] + '" style="width: 25%; height: 25%;" />' +
            '<div class="col-md-9 p-3">'+
            '<h3 class="text-white" id="titre_music">'+
            data[i]['nom_morceau']+
            '</h3>'+
            '<p></p>'+
            '<div class="row">'+
            '<div class="col-md-8 text-white">'+
            data[i]['nom_artiste']+
            '</div>'+
            '<div class="col-md-2 offset-md-1">'+
            '<p class="text-white" id="durée">'+
            data[i]['duree_morceau']+
            '</p>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<br>';
    }
    document.getElementById("place_morceau").innerHTML = morceau;
}

function play_new_morceau(data)
{
    data =JSON.parse(data);

  document.getElementById("music_current").src  = '../'+data[0]['lien'];
  if(name_page === 'Accueil' || name_page === 'Rechercher' || name_page === 'Album'){
    document.getElementById("music_current").value = "album";
    document.getElementById("artiste_play").value = data[0]['id_album'];
  }else{
    document.getElementById("music_current").value = "playlist";
    document.getElementById("artiste_play").value = document.getElementById('delete_playlist').getAttribute('data_id_playlist');
  }
  document.getElementById("album_play").value = data[0]['id_morceau'];
  document.getElementById("music_play").textContent = data[0]['nom_morceau'].charAt(0).toUpperCase() + data[0]['nom_morceau'].slice(1);
  document.getElementById("artiste_play").textContent = 'Par '+data[0]['nom_artiste'].charAt(0).toUpperCase() + data[0]['nom_artiste'].slice(1);
  document.getElementById("album_play").textContent =" dans l'album : "+data[0]['nom_album'].charAt(0).toUpperCase() + data[0]['nom_album'].slice(1);
  ajaxRequest(
    'GET',
    '../php/request.php/in_fav_playlist',
    in_fav_playlist,
    'id_morceau='+data[0]['id_morceau']
  );
}


function afficher_infos_artiste(data)
{
    data = JSON.parse(data);
    document.getElementById("name_page").textContent = 'Artiste';
    currentElement.innerHTML = "" +
        "<div class='container'>" +
        "        <div class='row'>" +
        "            <div class='col-md-6'>" +
        "                  <img src='.."+data.photo_artiste+"'>" +
        "            </div>" +
        "            <div class='col-md-6 '>" +
        "                <div class='text-white section-info'>" +
        "                    <h3>Nom :</h3> <p class='text-white' id='info_nom'>"+data.nom_artiste+" </p>" +
        "                    <h3> Type:</h3> <p class='text-white' id='info_type'>"+data.type_artiste+"</p>" +
        "                    <h3> Description:</h3> <p class='text-white' id='info_desc'>"+data.description_artiste+"</p>" +
        "                </div>" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "" +
        "    <div class='row col-md-5 offset-md-1'>" +
        "      <p class='text bg-black text-white'>Discographie :</p>" +
        "    </div>" +
        "    <div class = 'row'>" +
        "    <div class = 'col-md-9 offset-md-1'>" +
        "      <hr style='color: #FFFFFF;'>" +
        "    </div>" +
        "    </div>" +
        "    <div id='albums-artiste'></div>"
    ;
    ajaxRequest(
        'GET',
        '../php/request.php/album_artiste',
        afficher_albums_artiste,
        'id_artiste='+data.id_artiste
    );
}
function afficher_albums_artiste(data)
{
    data = JSON.parse(data);
    $('#albums-artiste').html('');
    for (const album of data){
        $('#albums-artiste').append(
            ""+
            "<div class='row album' value='"+album.id_album+"' style='background-color: #2C2C2C; padding: 3%; margin: 5%;'>" +
            "    <div class='col-md-3'>" +
            "        <img src='.."+album.cover_album+"' class='img-fluid' alt='cover album'>" +
            "    </div>" +
            "    <div class='col-md-6 offset-md-2'>" +
            "        <h3 class='text-white' id='titre_music'>"+album.nom_album+"</h3>" +
            "        <p></p>" +
            "        <div class='row'>" +
            "            <div class='col-md-5'>" +
            "                <p class='text-white'>"+album.nom_artiste+"</p>" +
            "                </a>" +
            "            </div>" +
            "            <div class='col-md-5 offset-md-2'>" +
            "            <p class='text-white' id='date-parution'>"+album.date_parution_album+"</p>" +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>"
        );
    }
    $('.album').on('click', (event) => {
        let id_album = $(event.target).closest('.album').attr('value');
        ajaxRequest(
            'GET',
            '../php/request.php/infos_album',
            afficher_infos_album,
            'id_album='+id_album
        )
    });
}
function afficher_infos_album(data) {
    let album = JSON.parse(data);
    document.getElementById('name_page').textContent = 'Album';
    currentElement.innerHTML = "" +
        "      <div class='row'>" +
        "          <div class='col-md-3 offset-md-2'>" +
        "              <img src='.." + album.cover_album + "' class='img-fluid' alt='cover album'>" +
        "          </div>" +
        "          <div class='col-md-4 offset-md-1 text-white'>" +
        "              <br>" +
        "              Date de parution :<h5 id='date_parution'>" + album.date_parution_album + "</h5>" +
        "              <br>" +
        "              Style musical :<h5 class='text-white' id='style_musical'>" + album.style_album + "</h5>" +
        "              <br>" +
        "              Durée totale : <h5 class='text-white' id='duree_totale'>" + album.duree_totale + "</h5>" +
        "              <br>" +
        "          </div>" +
        "          <div class='new_music_play col-md-2' value='"+album.id_morceau+"'>" +
        "              <br>" +
        "              <div class='icon_playlist'>" +
        "                  <i class='bi bi-play-fill custom-icon' style='color: #09FA4D; font-size: 12vw;'></i>" +
        "              </div>" +
        "          </div>" +
        "      </div>" +
        "      <div class='row'>" +
        "          <div class='col-md-4 offset-md-2'>" +
        "              <h3 class='text bg-black text-white' id='titre_album'>" + album.nom_album + "</h3>" +
        "              <h5 class='text bg-black text-white' id='artiste'>" + album.nom_artiste + "</h5>" +
        "          </div>" +
        "      </div>" +
        "      <br>" +
        "      <br>" +
        "      <div id='album_songs'></div>";
    ajaxRequest(
        'GET',
        '../php/request.php/album_songs',
        afficher_morceaux_album,
        'id_album='+album.id_album
    );
}
function afficher_morceaux_album(data)
{
    let morceaux = JSON.parse(data);
    $('#album_songs').html('');
    for (const morceau of morceaux) {
        morceau.duree_morceau = seconds2minutes(morceau.duree_morceau);
        $('#album_songs').append('' +
            '<div class="new_music_play row" value="'+morceau.id_morceau+'" style="background-color: #2C2C2C; padding: 3%; margin: 5%;">' +
            '    <img src="..'+morceau.cover_album+'" class="col-md-3 p-3 img-fluid icon_playlist" >' +
            '    <div class="col-md-9 icon_playlist">' +
            '        <div class="row">' +
            '            <div class="col-md-9">' +
            '                <h3 class="text-white" id="titre_music">'+morceau.nom_morceau+'</h3>' +
            '            </div>' +
            '        </div>' +
            '        <p></p>' +
            '        <div class="row">' +
            '            <div class="col-md-3">' +
            '                <p class="text-white" id="artiste">'+morceau.nom_artiste+'</p>' +
            '            </div>' +
            '            <div class="col-md-2 offset-md-6">' +
            '                <p class="text-white" id="durée">'+morceau.duree_morceau+'</p>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>' +
            '');
    }
}

$('#add_playlist').on('click', () => {
    // requete ajax pour remplir dropdownContent
    ajaxRequest(
        'GET',
        '../php/request.php/get_playlists',
        pop_up
    )
});

function pop_up(data)
{
    let playlists = JSON.parse(data);

    let modal_pop_up = `
      <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Ajoutez à une playlist</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${dropdownMenu(playlists)}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="validateBtn">Valider</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('body').append(modal_pop_up);

    $('#myModal').modal('show');

    // Gérez l'événement de clic sur les éléments de menu déroulant
    $(document).on('click', '.dropdown-menu .dropdown-item', function() {
        window.id_playlist_selected = $(this).attr('data-value'); // Met à jour la valeur sélectionnée
        $('#dropdownMenuButton').text($(this).html()); // Met à jour le texte du bouton avec l'option sélectionnée
    });

// Gérez l'événement de clic sur le bouton "Valider"
    $('#validateBtn').click(function() {
        // Fermez le pop-up modal
        $('#myModal').modal('hide');

        let id_morceau = $('#album_play').val();

        ajaxRequest(
            'POST',
            '../php/request.php/add_playlist',
            () => {console.log('ajoutée à la playlist')},
            'id_playlist='+window.id_playlist_selected+'&id_morceau='+id_morceau
        );
    });
}

// créer un menu déroulant en fonction des playlist d'un utilisateur
function dropdownMenu(playlists) {
    let dropdownContent = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          Choisissez une playlist
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    `;
    for (const playlist of playlists) {
        dropdownContent += `<li><a class="dropdown-item" href="#" data-value="${playlist.id_playlist}">${playlist.nom_playlist}</a></li>`;
    }
    dropdownContent += `
        </ul>
    </div>
    `;
    return dropdownContent;
}


function turnFormatSecondes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Formater les minutes et les secondes avec deux chiffres
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return formattedMinutes + ":" + formattedSeconds;
}

$('#repeat_music').on("click", () => {
    document.getElementById("repeat_icon").classList.toggle("be_white");
});

$('#random_music').on("click", () => {
    document.getElementById("random_icon").classList.toggle("be_white");
});

$('#music_current').on("ended", () => {
    document.getElementById("music_play").value = 'next';
    if (document.getElementById("repeat_icon").classList.contains("be_white")) {
        document.getElementById("music_current").play();
    } else {
        changeMusic();
    }
});

$('#next_music').on("click", () => {
    document.getElementById("music_play").value = 'next';
    changeMusic();
});

$('#prev_music').on("click", () => {
    document.getElementById("music_play").value = 'previous';
    changeMusic();
});

function changeMusic(){
  let id = document.getElementById("artiste_play").value;
    if(document.getElementById("music_current").value === 'album'){
        ajaxRequest(
            'GET',
            '../php/request.php/change_album_music',
            change_music,
            'id_album='+id
        )
    }
    if(document.getElementById("music_current").value === 'playlist'){
      ajaxRequest(
            'GET',
            '../php/request.php/change_playlist_music',
            change_music,
            'id_playlist='+id
        )
    }
}


function change_music(data){
  data =JSON.parse(data);
  let found;
  for(let i = 0; i<data.length;i++){
    if(data[i]['id_morceau']===document.getElementById("album_play").value){
      found = i;
    }
  }
  if(document.getElementById("random_icon").classList.contains("be_white")){
    var randomNumber = Math.floor(Math.random() * data.length);
  // Vérifier si le nombre généré est égal à 2
  while (randomNumber === found) {
    // Si c'est le cas, générer un nouveau nombre
    randomNumber = Math.floor(Math.random() * data.length);
  }
    found = randomNumber;
  }else{
    if(document.getElementById("music_play").value === 'previous'){
      if(found === 0){
        found = data.length-1;
      }
      else{
        found--;
      }
    }else{
      if(found === data.length-1){
        found = 0;
      }
      else{
        found++;
      }
    }
  }
  document.getElementById("music_current").src  = '../'+data[found]['lien'];
  document.getElementById("album_play").value = data[found]['id_morceau'];
  document.getElementById("music_play").textContent = data[found]['nom_morceau'].charAt(0).toUpperCase() + data[found]['nom_morceau'].slice(1);
  document.getElementById("artiste_play").textContent = 'Par '+data[found]['nom_artiste'].charAt(0).toUpperCase() + data[found]['nom_artiste'].slice(1);
  document.getElementById("album_play").textContent =" dans l'album : "+data[found]['nom_album'].charAt(0).toUpperCase() + data[found]['nom_album'].slice(1);
  ajaxRequest(
    'POST',
    '../php/request.php/add_morceau_recent',
    () => {},
    'id_morceau=' + data[found]['id_morceau']
  );
  ajaxRequest(
  'GET',
  '../php/request.php/accueil',
  add_morceau_recent
  );

  ajaxRequest(
    'GET',
    '../php/request.php/in_fav_playlist',
    in_fav_playlist,
    'id_morceau='+data[found]['id_morceau']
  );
}

function in_fav_playlist(data){
  switch (data){
    case 'dedans':
      document.getElementById("icon_favori").classList.add("be_white");
      document.getElementById("icon_favori").classList.add("bi-suit-heart-fill");
      document.getElementById("icon_favori").classList.remove("bi-suit-heart");
        break;
    case 'dehors':
        document.getElementById("icon_favori").classList.remove("be_white");
        document.getElementById("icon_favori").classList.remove("bi-suit-heart-fill");
        document.getElementById("icon_favori").classList.add("bi-suit-heart");
        break;
}
}


$('#add_favoris').on("click", () => {
  let id_morceau = document.getElementById("album_play").value;
  if (document.getElementById("icon_favori").classList.contains("be_white")) {
    ajaxRequest(
      'DELETE',
      '../php/request.php/delete_song_playlist',
      delete_song_playlist,
      'id_morceau='+id_morceau
    );
  }else {
    ajaxRequest(
      'POST',
      '../php/request.php/add_song_playlist',
      add_song_playlist,
      'id_morceau='+id_morceau
    );
  }
})

function add_song_playlist(data){
  switch (data){
    case 'morceau_ajouté':
      document.getElementById("icon_favori").classList.toggle("be_white");
      document.getElementById("icon_favori").classList.toggle("bi-suit-heart-fill");
      document.getElementById("icon_favori").classList.toggle("bi-suit-heart");
      if(document.getElementById("name_page").textContent === 'Favoris'){
        ajaxRequest(
          'GET',
          '../php/request.php/infos_playlist_favoris',
          infos_playlist_favoris,
        );
      }
      break;
    case 'morceau_non_ajouté':
        //$('#alert-erreur-inscription').toggleClass('d-none');
        break;
  }
}

function delete_song_playlist(data){
  switch (data){
    case 'morceau_enlevé':
      document.getElementById("icon_favori").classList.toggle("be_white");
      document.getElementById("icon_favori").classList.toggle("bi-suit-heart-fill");
      document.getElementById("icon_favori").classList.toggle("bi-suit-heart");
      if(document.getElementById("name_page").textContent === 'Favoris'){
        ajaxRequest(
          'GET',
          '../php/request.php/infos_playlist_favoris',
          infos_playlist_favoris,
        );
      }
      break;
    case 'morceau_non_enlevé':
        //$('#alert-erreur-inscription').toggleClass('d-none');
        break;
  }
}

function infos_playlist_favoris(data){
  data = JSON.parse(data);
  let tempo = '';
  document.getElementById("name_page").textContent = "Favoris";
  tempo += '' +
  '<div class="container">'+
    '<div class="row">'+
      '<div class="col-md-3 offset-md-1" style="background-color: #f70a0a; height: 18vw;" id="fav_playlist">'+
        '<i class="bi bi-suit-heart-fill text-white plus-icon"></i>'+
      '</div>'+
      '<div class="col-md-3 offset-md-1 text-white">'+
          '<br>'+
          'Durée totale : <h5 class="text-white" id="duree_totale">'+data['duree_totale']+'</h5>'+
          '<br>'+
      '</div>'+
      '<div class="new_music_play col-md-2 " value="';
      if(data['id_morceau'] != null){
        tempo += data['id_morceau'];
      }
      tempo += ''+
      '">'+
        '<br>'+
        '<br>'+
        '<div class="icon_playlist" >'+
          '<i class="bi bi-play-fill custom-icon" style="color: #09FA4D; font-size: 12vw;" id="delete_playlist" data_id_playlist="'+data['id_playlist']+'"></i>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="row">'+
      '<div class="col-md-3 offset-md-1">'+
        '<h3 class="text bg-black text-white" id="titre_playlist">'+data['nom_playlist'].charAt(0).toUpperCase() + data['nom_playlist'].slice(1)+'</h3>'+
      '</div>'+
    '</div>'+
    '<br>'+
    '<br>'+
    '<div class="text-white" id="morceau_of_playlist">'+
      "<h4>Aucun titre n'a été ajouté pour le moment</h4>"+
    '</div>'+
  '</div>';
  
  currentElement.innerHTML = tempo;
  ajaxRequest(
    'GET',
    '../php/request.php/morceaux_playlist',
    morceaux_playlist,
    'id_playlist='+data['id_playlist']
  );
}


function infos_playlist(data){
  data = JSON.parse(data);
  let tempo = '';
  document.getElementById("name_page").textContent = "Description Playlist";
  tempo += '' +
  '<div class="container">'+
    '<div class="row">'+
      '<div class="col-md-3 offset-md-1" style="background-color: #00EBEB; height: 18vw;">';
  if(data['photo_playlist'] != ''){
    tempo += '<img src="..' + data['photo_playlist'] + '"style="width: 110%; height: 100%; margin-left: -1vw;" />';
  }
  tempo += ''+ 
      '</div>'+
      '<div class="col-md-3 offset-md-1 text-white">'+
          '<br>'+
          'Date de parution :<h5 id="date_parution">'+data['date_creation_playlist']+'</h5>'+
          '<br>'+
          'Durée totale : <h5 class="text-white" id="duree_totale">'+data['duree_totale']+'</h5>'+
          '<br>'+
      '</div>'+
      '<div class="col-md-2 " id="deleted_playlist" value="'+data['id_playlist']+'">'+
        '<br>'+
        '<br>'+
        '<br>'+
        '<div class="icon_playlist" >'+
          '<i class="bi bi-trash3" style="color: #fa0909; font-size: 8vw;" ></i>'+
        '</div>'+
      '</div>'+
      '<div class="new_music_play col-md-2 " value="';
      if(data['id_morceau'] != null){
        tempo += data['id_morceau'];
      }
      tempo += ''+
      '">'+
        '<br>'+
        '<br>'+
        '<div class="icon_playlist" >'+
          '<i class="bi bi-play-fill custom-icon" style="color: #09FA4D; font-size: 12vw;" id="delete_playlist" data_id_playlist="'+data['id_playlist']+'"></i>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="row">'+
      '<div class="col-md-3 offset-md-1">'+
        '<h3 class="text bg-black text-white" id="titre_playlist">'+data['nom_playlist'].charAt(0).toUpperCase() + data['nom_playlist'].slice(1)+'</h3>'+
      '</div>'+
    '</div>'+
    '<br>'+
    '<br>'+
    '<div class="text-white" id="morceau_of_playlist">'+
      "<h4>Aucun titre n'a été ajouté pour le moment</h4>"+
    '</div>'+
  '</div>';
  
  currentElement.innerHTML = tempo;
  ajaxRequest(
    'GET',
    '../php/request.php/morceaux_playlist',
    morceaux_playlist,
    'id_playlist='+data['id_playlist']
  );
}


function morceaux_playlist(data)
{
  let morceaux = JSON.parse(data);
  if(morceaux.length !=0){
    $('#morceau_of_playlist').html('');
    for (const morceau of morceaux) {
      morceau.duree_morceau = seconds2minutes(morceau.duree_morceau);
      $('#morceau_of_playlist').append('' +
          '<div class="new_music_play row" value="'+morceau.id_morceau+'" style="background-color: #2C2C2C; padding: 3%; margin: 5%;">' +
          '    <img src="..'+morceau.cover_album+'" class="col-md-3 p-3 img-fluid icon_playlist" >' +
          '    <div class="col-md-8 icon_playlist">' +
          '        <div class="row">' +
          '            <div class="col-md-9">' +
          '            <br>'+
          '                <h3 class="text-white" id="titre_music">'+morceau.nom_morceau+'</h3>' +
          '            </div>' +
          '        </div>' +
          '        <p></p>' +
          '        <div class="row">' +
          '            <div class="col-md-3">' +
          '                <p class="text-white" id="artiste">'+morceau.nom_artiste+'</p>' +
          '            </div>' +
          '            <div class="col-md-2 offset-md-6">' +
          '                <p class="text-white" id="durée">'+morceau.duree_morceau+'</p>' +
          '            </div>' +
          '        </div>' +
          '    </div>' +
          '   <div class="col-md-1" id="delete_one_song" value="'+morceau.id_morceau+'">'+
          '     <i class="icon_playlist bi bi-trash3" style="color: #fa0909; font-size: 3vw;" ></i>'+
          '   </div>'+
          '</div>' +
          '');
    }
  }

}

function delete_playlist(data){
  console.log(data);
  switch (data){
    case 'playlist_delete':
        if(document.getElementById("name_page").textContent != "Playlist"){
          document.getElementById("bouton_playlist").setAttribute("style", "color: #FFFFFF;");
          document.getElementById("bouton_acceuil").removeAttribute('style');
          document.getElementById("bouton_rechercher").removeAttribute('style');
          document.getElementById("iconProfil").classList.remove("d-none");;
          document.getElementById("name_page").textContent = "Playlist";
          currentElement.innerHTML = '' +
              '<div class="row">' +
              '<div class="col-md-3">' +
              '<div class="col-md-12 " style="background-color: #00EBEB; height: 15vw;" id="nouv_playlist">' +
              '<i class="bi bi-plus-lg text-white plus-icon icon_playlist"></i>'+
              '</div>' +
              '</div>' +
              '<div class="col-md-3 offset-md-1">' +
              '<div class="col-md-12 " style="background-color: #f70a0a; height: 15vw;" id="fav_playlist">' +
              '<i class="bi bi-suit-heart-fill text-white plus-icon icon_playlist"> </i>' +
              '</div>' +
              '</div>' +
              '<div class="col-md-3 offset-md-1" id="fisrt_playlist">' +
              '</div>' +
              '</div>' +
              '<span id="print_playlists">' +
              '</span>';
      }
      break;
    case 'playlist_not_delete':
        //$('#alert-erreur-inscription').toggleClass('d-none');
        break;
  }
}

function delete_one_song_of_playlist(data){
  data = JSON.parse(data);
  switch (data[0]){
      case 'morceau_enlevé':
        if(document.getElementById('name_page').textContent === 'Favoris'){
          if(parseInt(data[1]) === parseInt(document.getElementById("album_play").value)){
            document.getElementById("icon_favori").classList.toggle("be_white");
            document.getElementById("icon_favori").classList.toggle("bi-suit-heart-fill");
            document.getElementById("icon_favori").classList.toggle("bi-suit-heart");
          }
          ajaxRequest(
            'GET',
            '../php/request.php/infos_playlist_favoris',
            infos_playlist_favoris,
          );
        }else{
          let id_playlist = document.getElementById('delete_playlist').getAttribute('data_id_playlist');
          ajaxRequest(
            'GET',
            '../php/request.php/infos_playlist',
            infos_playlist,
            'id_playlist='+id_playlist
          );
        }
        break;
      case 'morceau_non_enlevé':
        //$('#alert-erreur-inscription').toggleClass('d-none');
        break;


  }
}


