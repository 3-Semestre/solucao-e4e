document.getElementById('toggle-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.conteudo').classList.toggle('active');
});


function exibirDadosPerfil() {
    var nomeCompleto = sessionStorage.getItem('nomeCompleto');

    var nomeTitulo = document.getElementById("nome_titulo");
    nomeTitulo.innerHTML = nomeCompleto;
}

exibirDadosPerfil()