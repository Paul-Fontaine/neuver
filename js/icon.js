
function changePage(page) {
    // Cacher toutes les pages
    var pages = document.querySelectorAll('body');
    for (var i = 0; i < pages.length; i++) {
      pages[i].style.display = 'none';
    }
  
    // Afficher la page sélectionnée
    var selectedPage = document.getElementById(page);
    if (selectedPage) {
      selectedPage.style.display = 'block';
    } else {
      console.log(selectedPage);
    }
  }


  
$('#iconProfil').on("click", () => {
  var selectedElement = document.getElementById("accueil");
  selectedElement.innerHTML = '<header>'+
  '<div class="row">'+
      '<div class="col-md-1">'+
          '<div class="input-group mb-1">'+
              '<h3 class="text-white">Profil</h3>'+
          '</div>'+
      '</div>'+
'</header>'+
'<div class="container">'+
  '<div class="row">'+
      '<div class="col-md-6">'+
            '<i class="bi bi-person-circle large-icon2 text-white"></i>'+
      '</div>'+
      '<div class="col-md-6 ">'+
          '<div class="text-white section-info">'+
              '<h3>Informations personnelles :</h3>'+
              'Prénom Nom :<span class="text-white" id="text_nom">Ryan collobert </span>'+
              '<br>'+
              'email :<span class="text-white" id="text_mail">ryan@mail.com</span>'+
              '<br>'+
              'date de naissance : <span class="text-white" id="text_date">12/08/2009</span>'+
              '<br>'+
              'age : <span class="text-white" id="text_age">12</span>'+
              '<br>'+
              '<br>'+
              '<h3><a href="#" style="color: green;">modifier mes infos persos :</a></h3>'+
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
              'Par téléphone : 06 30 40 75 07'+
          '</div>'+
      '</div>'+
  '</div>'+
'</div>'+
'<footer class="footer">'+
  '<div class="fixed-bottom">'+
    '<div class="container py-3" id="foot">'+
      '<div id="foot">'+
        '<div class="row" style="background-color: #3B3B3B;">'+
          '<div class="col-md-1">'+
            '<a href="#" >'+
              '<i class="bi bi-play-fill custom-icon "></i>'+
            '</a>'+
          '</div>'+
          '<div class="col-md-4">'+
            '<p></p>'+
            '<h3 class="text-white" id="titre_music_play">Titre musique</h3>'+
            '<p class="text-white" id="artiste_play">Artiste</p>'+
          '</div>'+
          '<div class="col-md-1 offset-md-5">'+
            '<a href="#">'+
              '<i class="bi bi-suit-heart-fill" style="font-size: 60px;"></i>'+
            '</a>'+
          '</div>'+
          '<div class="col-md-1">'+
            '<a href="#">'+
              '<i class="bi bi-skip-end-fill custom-icon"></i>'+
            '</a>'+
          '</div>'+
        '</div>'+
        '<div class="row" style="background-color: #2C2C2C;">'+
          '<div class="col">'+
            '<a href="#" >'+
              '<i class="bi bi-house-door-fill custom-icon "></i>'+
              'Accueil'+
            '</a>'+
          '</div>'+
          '<div class="col">'+
            '<a href="#">'+
              '<i class="bi bi-stack custom-icon" ></i>'
              'Playlist'+
            '</a>'+
          '</div>'+
          '<div class="col">'+
            '<a href="#">'+
              '<i class="bi bi-zoom-out custom-icon"></i>'+
              'Rechercher'+
            '</a>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</footer>';
})