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
    document.getElementById("recemment_ecoutes").innerHTML = ecoutes;
    document.getElementById("music_current").src  = '../'+data[0]['lien'];
    document.getElementById("music_play").innerHTML = '<h3>'+data[0]['nom_morceau'].charAt(0).toUpperCase() + data[0]['nom_morceau'].slice(1)+'</h3>'+'Par '+data[0]['nom_artiste'].charAt(0).toUpperCase() + data[0]['nom_artiste'].slice(1)+" dans l'album : "+data[0]['nom_album'].charAt(0).toUpperCase() + data[0]['nom_album'].slice(1);
    


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
    data =JSON.parse(data)
    let playlist_list = "";
    let iter = 0;
    for(let i = 0; i<data.length-1;i++){
        if(data[i]['id_playlist'] != data[data.length-1]['id_playlist']){
            if(iter === 0){
                document.getElementById("fisrt_playlist").innerHTML = ""+
                '<a href="#">'+
                  '<img src="..' + data[i]['photo_playlist'] + '" style="width: 86.5%; height: 86.5%;" />' +
                '</a>';
                iter++;
            }
            else{
                if(iter === 1){
                    playlist_list = playlist_list +
                    '<br>'+
                    '<br>'+
                    '<div class="row">';
                }
                playlist_list = playlist_list+
                '<div class="col-md-3">'+
                    '<a href="#">'+
                      '<img src="..' + data[i]['photo_playlist'] + '" style="width: 86.5%; height: 86.5%;" />' +
                    '</a>'+
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
})

$('#bouton_playlist').on("click", () => {
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

  // Attachez un gestionnaire d'événements à l'élément nouvellement créé
  
});

$('#bouton_rechercher').on("click", () => {
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
          '<input type="text" class="form-control" placeholder="Nom de la cover">'+
          '<br>'+
          '<button class="btn btn-success bg-light-green">Créer la playlist</button>'+
        '</div>'+
    '</div>';
  }
  if (event.target.id === "fav_playlist") {
    document.getElementById("name_page").textContent = "Favoris";
    currentElement.innerHTML = ''+
    '<div class="row">' +
      '<div class="col-md-3 offset-md-1">'+
                  '<a href="#">'+
                      '<div class="col-md-12 " style="background-color: #f70a0a; height: 15vw;" id="fav_playlist">'+
                          '<i class="bi bi-suit-heart-fill text-white plus-icon"></i></i>'+
                      '</div>'+
                  '</a>'+
              '</div>'+
      '<div class="col-md-3 offset-md-1 text-white">' +
          '<br>' +
          'Date de parution :<h5 id="date_parution">'+
          '</h5>' +
          '<br>' +
          'Durée totale : <h5 class="text-white" id="duree_totale">'+
          '</h5>' +
          '<br>' +
      '</div>' +
      '<div class="col-md-2 ">' +
          '<a href="#">' +
              '<i class="bi bi-play-fill custom-icon" style="color: #09FA4D; font-size: 12vw;"></i>' +
          '</a>' +
      '</div>' +
    '</div>' +
    '<div class="row">' +
        '<div class="col-md-3 offset-md-1">' +
            '<h3 class="text bg-black text-white" id="titre_album">Playlist Favoris</h3>' +
        '</div>' +
    '</div>';
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
  if(event.target.classList[0] === "new_music_play"){
    let id_morceau = event.target.getAttribute("value");
    console.log(id_morceau);
    ajaxRequest(
      'GET',
      '../php/request.php/play_new_morceau',
      play_new_morceau,
      'id_morceau='+id_morceau
    );
  }
});


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
  document.getElementById("place_album").innerHTML = artiste+'</div>';

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
    morceau = morceau+
    '<div class="row">'+
      '<div class="col-md-5 p-4 morceaux_recherché" style="background-color: #2C2C2C;" value="'+data[i]['id_morceau']+'">'+
          '<div class="row">'+
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
  console.log(data);

  document.getElementById("music_current").src  = '../'+data[0]['lien'];
  document.getElementById("music_play").innerHTML = '<h3>'+data[0]['nom_morceau'].charAt(0).toUpperCase()+
    data[0]['nom_morceau'].slice(1)+'</h3>'+'Par '+data[0]['nom_artiste'].charAt(0).toUpperCase()+
    data[0]['nom_artiste'].slice(1)+" dans l'album : "+data[0]['nom_album'].charAt(0).toUpperCase() + data[0]['nom_album'].slice(1);
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
    console.log(data)
    $('#albums-artiste').html(
        ""+
        "<div class='row album' value='"+data.id_album+"' style='background-color: #2C2C2C; padding: 3%;'>" +
        "    <div class='col-md-3'>" +
        "        <img src='.."+data.cover_album+"' class='img-fluid' alt='cover album'>" +
        "    </div>" +
        "    <div class='col-md-6 offset-md-2'>" +
        "        <h3 class='text-white' id='titre_music'>"+data.nom_album+"</h3>" +
        "        <p></p>" +
        "        <div class='row'>" +
        "            <div class='col-md-5'>" +
        "                <p class='text-white'>"+data.nom_artiste+"</p>" +
        "                </a>" +
        "            </div>" +
        "            <div class='col-md-5 offset-md-2'>" +
        "            <p class='text-white' id='date-parution'>"+data.date_parution_album+"</p>" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "</div>"
    );
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

function afficher_infos_album(data)
{
    data = JSON.parse(data);
    console.log(data);

    currentElement.innerHTML = '';
    document.getElementById("name_page").textContent = 'Album';
}

$('#add_favoris').on("click", () => {
    document.getElementById("icon_favori").classList.toggle("bi-suit-heart-fill");
    document.getElementById("icon_favori").classList.toggle("bi-suit-heart");

})

$(document).ready(function() {
  $('#add_playlist').click(function() {
    // Créez le contenu du menu déroulant
    var dropdownContent = `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          Menu déroulant
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#">Option 1</a></li>
          <li><a class="dropdown-item" href="#">Option 2</a></li>
          <li><a class="dropdown-item" href="#">Option 3</a></li>
        </ul>
      </div>
    `;

    // Créez le pop-up modal
    var modal = `
      <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Titre du pop-up modal</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${dropdownContent}
            </div>
          </div>
        </div>
      </div>
    `;

    // Ajoutez le pop-up modal à la page
    $('body').append(modal);

    // Affichez le pop-up modal
    $('#myModal').modal('show');
  });

});

function turnFormatSecondes(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  // Formater les minutes et les secondes avec deux chiffres
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return formattedMinutes + ":" + formattedSeconds;
}
