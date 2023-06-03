if(document.getElementById("name_page").textContent === "Accueil"){
  ajaxRequest(
      'GET',
      '../php/User.php/accueil',
      recent_ecoutes
  );
}





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
                          '<p class="text-white" id="artiste">'+data[i]['nom_morceau']+'</p>'+
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


var currentElement = document.getElementById("current_page");

// Création d'une nouvelle instance de MutationObserver
var observer_current_page = new MutationObserver(function(mutations) {
// Fonction à exécuter lorsque des mutations sont détectées
  if(document.getElementById("name_page").textContent === "Accueil"){
  console.log('je suis une patate');
  }
  if(document.getElementById("name_page").textContent === "Profil"){
  console.log('je suis une patate2');
  }
});

// Configuration de l'observation pour les modifications du contenu de l'élément
var config = { childList: true, subtree: true };

// Démarrage de l'observation sur l'élément cible avec la configuration spécifiée
observer_current_page.observe(currentElement, config);




$('#iconProfil').on("click", () => {
  var selectedElement = document.getElementById("current_page");
  document.getElementById("bouton_acceuil").removeAttribute('style')
  selectedElement.innerHTML = ''+
  '<header>'+
  '<div class="row">'+
      '<div class="col-md-1">'+
          '<div class="input-group mb-1">'+
              '<h3 class="text-white" id="name_page" >Profil</h3>'+
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
  '</div>';
})
