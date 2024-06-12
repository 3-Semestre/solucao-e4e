document.getElementById('toggle-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.conteudo').classList.toggle('active');
});

//aquele de cima eh o side bar

document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    for (var i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function (e) {
            e.preventDefault();
            var dropdownContent = this.parentElement.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }
});

function puxarNome() {
    var nomeCompleto = sessionStorage.getItem('nomeCompleto');

    var nomeTitulo = document.getElementById("nome_titulo");
    nomeTitulo.innerHTML = nomeCompleto;
}

puxarNome()