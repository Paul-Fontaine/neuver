//=========================Paul===================================

$('#button-se-connecter').on("click", () => {
    let mail = $('#Email').val();
    let mdp = $('#Password').val();
  
    ajaxRequest(
        'GET',
        '../php/request.php/authentification',
        authentification,
        'mail='+mail+'&mdp='+mdp
    );
  })
  
  function authentification(data)
  {
    switch (data){
        case 'connected':
            window.location.href = "accueil.html";
            break;
        case 'incorrect':
            $('#alert-erreur-connexion').toggleClass('d-none');
            break;
    }
  }
  
  
  //=========================RYAN===================================
  
  $('#button_page_inscription').on("click", () => {
    window.location.href = 'inscription.html';
  })
  
  $('#button-s-inscire').on("click", () => {
    let prenom = $('#prenom_inscr').val();
    let nom = $('#nom_inscr').val();
    let date_naissance = $('#birthdate_inscr').val();
    let mail = $('#mail_inscr').val();
    let mdp = $('#pwd_inscr').val();
    let mdp_conf = $('#pwd_inscr_conf').val();
  
    ajaxRequest(
        'POST',
        '../php/request.php/inscription',
        inscription,
        'prenom='+prenom+'&nom='+nom+'&date_naissance='+date_naissance+'&mail='+mail+'&mdp='+mdp+'&mdp_conf='+mdp_conf
    );
  })
  
  function inscription(data)
  {
    switch (data){
        case 'inscrit':
            window.location.href = "authentification.html";
            break;
        case 'non_inscrit':
            $('#alert-erreur-inscription').toggleClass('d-none');
            break;
        case 'probleme_mdp':
            $('#alert-erreur-mdp').toggleClass('d-none');
            break;
    }
  }
  
  
  
  
  
  
  
  
  //========================Gauthier===================================
  
  
  
  