$('#button-se-connecter').on("click", () => {
    console.log('connecter clicked')
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
    console.log(data)
}