
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