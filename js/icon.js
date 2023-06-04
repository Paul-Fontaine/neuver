var currentElement = document.getElementById("current_page");

if(document.getElementById("name_page").textContent === "Accueil"){
    ajaxRequest(
        'GET',
        '../php/User.php/accueil',
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
            '../php/User.php/accueil',
            recent_ecoutes
        );
    }
    if(document.getElementById("name_page").textContent === "Profil"){
        ajaxRequest(
            'GET',
            '../php/User.php/profil',
            info_profil
        );
    }
    if(document.getElementById("name_page").textContent === "Playlist"){
        ajaxRequest(
            'GET',
            '../php/User.php/playlist',
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
    data =JSON.parse(data)
    let ecoutes = "";
    for(let i = 0; i<data.length;i++){
        if((i+1)%2 != 0){
            ecoutes = ecoutes +
            '<div class="row">'+
            '<div class="col-md-5 p-4" style="background-color: #2C2C2C;">';
        }
        else{
            ecoutes = ecoutes +
            '<div class="col-md-5 p-4 offset-md-1" style="background-color: #2C2C2C;">';
        }
        ecoutes = ecoutes +
            '<div class="row">'+
                '<div class="col-md-3 p-3" style="background-color: #00EB0A;">'+
                '</div>'+
                '<div class="col-md-9 p-3">'+
                    '<h3 class="text-white" id="titre_music">'+data[i]['nom_morceau']+'</h3>'+
                    '<p></p>'+
                    '<div class="row">'+
                        '<div class="col-md-7">'+
                            '<p class="text-white" id="artiste">'+data[i]['nom_artiste']+'</p>'+
                        '</div>'+
                        '<div class="col-md-2 offset-md-2">'+
                            '<p class="text-white" id="durée">'+data[i]['duree_morceau']+'</p>'+
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
}

function info_profil(data)
{
    data =JSON.parse(data)
    document.getElementById("info_perso").innerHTML = '<h3>Informations personnelles :</h3>'+
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
    '<h3><a href="#" style="color: #00EB0A;">gérer mon abonnement :</a></h3>'+
    '<br>'+
    '<h3><a href="#" style="color: #00EB0A;">explicit content :</a></h3>'+
    '<br>'+
    '<h3><a href="#" style="color: #00EB0A;">politique de confidentialité :</a></h3>'+
    '<br>'+
    '<h3>Contact :</h3>'+
    '<br>'+
    'Par mail : groupe5@isen-ouest.yncrea.fr'+
    '<br>'+
    'Par téléphone : 06 30 40 75 07';
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
                    '<div class="col-md-12 " style="background-color: #0af731; height: 15vw;">'+
                    '</div>'+
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
                        '<div class="col-md-12 " style="background-color: #eb00a5; height: 15vw;">'+
                        '</div>'+
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
    '<div class="row">'+
        '<div class="col-md-6">'+
            '<i class="bi bi-person-circle large-icon2 text-white"></i>'+
        '</div>'+
        '<div class="col-md-6 ">'+
            '<div class="text-white section-info" id="info_perso">'+
            '</div>'+
        '</div>'+
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
    currentElement.innerHTML = ''+
    '<div class="row">'+
        '<div class="col-md-3">'+
            '<a href="#">'+
                '<div class="col-md-12 " style="background-color: #00EBEB; height: 15vw;" id="nouv_playlist">'+
                    '<i class="bi bi-plus-lg text-white plus-icon"></i></i>'+
                '</div>'+
            '</a>'+
        '</div>'+
        '<div class="col-md-3 offset-md-1">'+
            '<a href="#">'+
                '<div class="col-md-12 " style="background-color: #f70a0a; height: 15vw;" id="fav_playlist">'+
                    '<i class="bi bi-suit-heart-fill text-white plus-icon"></i></i>'+
                '</div>'+
            '</a>'+
        '</div>'+
        '<div class="col-md-3 offset-md-1" id="fisrt_playlist">' +
        '</div>'+
    '</div>'+
    '<span id="print_playlists">'+
    '</span>';
})

$('#bouton_rechercher').on("click", () => {
    document.getElementById("bouton_rechercher").setAttribute("style", "color: #FFFFFF;");
    document.getElementById("bouton_acceuil").removeAttribute('style');
    document.getElementById("bouton_playlist").removeAttribute('style');
    document.getElementById("iconProfil").classList.remove("d-none");;
    document.getElementById("name_page").textContent = "Accueil";
    currentElement.innerHTML = ''+
    '<div class="row col-md-5 ">'+
          '<p class="text bg-black text-white">Dernière musique écoutées :</p>'+
    '</div>'+
    '<span id="recemment_ecoutes">'+
    '</span>';
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
        '../php/User.php/modif_profil',
        modif_profil,
        'prenom='+prenom+'&nom='+nom+'&date_naissance='+date_naissance+'&mail='+mail+'&mdp='+mdp+'&mdp_conf='+mdp_conf
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
                document.getElementById("iconProfil").classList.add("d-none");;
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


$('#play_music').on("click", () => {
    document.getElementById("icon_play_stop").classList.toggle("bi-play-fill");
    document.getElementById("icon_play_stop").classList.toggle("bi-pause-fill");

})

$('#add_favoris').on("click", () => {
    document.getElementById("icon_favori").classList.toggle("bi-suit-heart-fill");
    document.getElementById("icon_favori").classList.toggle("bi-suit-heart");

})

  