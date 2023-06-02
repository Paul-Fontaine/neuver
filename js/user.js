$('#button-se-connecter').on("click", () => {
    let mail = $('#Email').val();
    let mdp = $('#Password').val();

    ajaxRequest(
        'GET',
        '../php/User.php/authentification',
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