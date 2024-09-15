//side bar
document.getElementById('toggle-btn').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.conteudo').classList.toggle('active');
});

//drop-down menu
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
    try {
        nomeTitulo.innerHTML = nomeCompleto;
    } catch (error) {
        console.log("Página não utiliza nome utilitário")
    }
}

function carregarNavBar() {
    const nivelAcesso = sessionStorage.getItem('nivel_acesso_cod');

    const aluno_navbar = document.getElementById("alunos_navbar");
    const professores_navbar = document.getElementById("professores_navbar");
    const agenda_novo_agendamento_navbar = document.getElementById("agenda_novo_agendamento_navbar");

    const link_dashboard = document.getElementById("dashboard_href")

    switch (nivelAcesso) {
        case "3":
            link_dashboard.href = "dashboardProfessor.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case "2":
            link_dashboard.href = "dashboardProfessor.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case "1":
            link_dashboard.href = "dashboardAluno.html"
            aluno_navbar.style.display = "none";
            professores_navbar.style.display = "none";
            break;
    }
}

async function desautenticarUsuario(){
    const token = sessionStorage.getItem('token')
    const nivelAcesso = sessionStorage.getItem('nivel_acesso_cod');
    const id = sessionStorage.getItem('id')
    usuario = "";
    switch (nivelAcesso) {
        case "1":
            usuario ="aluno"; 
            break;
        case "2":
            usuario = "professor";
            break;
        case "3":
            usuario = "representante-legal";
            break;
    }

    const respostaDesautenticar = await fetch(`http://localhost:8080/usuarios/${usuario}/desautenticar/${id}}`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if(respostaDesautenticar.ok){
        sessionStorage.clear()
        console.log("ok")
        window.location.href="login2.html"
    }
}

carregarNavBar()
puxarNome()