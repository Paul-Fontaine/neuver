$('#bouton-recherche-morceaux').on('click', () => {
    let textToSearch = $('#input-research').val();
    ajaxRequest(
        'GET',
        '../php/request.php/recherche_morceaux',
        loadSearchedSongs,
        'textToSearch='+textToSearch
    );
});

$('#bouton-recherche-albums').on('click', () => {
    let textToSearch = $('#input-research').val();
    ajaxRequest(
        'GET',
        '../php/request.php/recherche_albums',
        loadSearchedAlbums,
        'textToSearch='+textToSearch
    );
});

$('#bouton-recherche-artistes').on('click', () => {
    let textToSearch = $('#input-research').val();
    ajaxRequest(
        'GET',
        '../php/request.php/recherche_artistes',
        loadSearchedArtists,
        'textToSearch='+textToSearch
    );
});


function loadSearchedSongs(data){
    console.log(JSON.parse(data))
}

function loadSearchedAlbums(data){
    console.log(JSON.parse(data))
}

function loadSearchedArtists(data){
    console.log(JSON.parse(data))
}