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
    const nivelAcesso = sessionStorage.getItem('nivel_acesso');

    const aluno_navbar = document.getElementById("alunos_navbar");
    const professores_navbar = document.getElementById("professores_navbar");

    const horario_atendimento_form = document.getElementById("horario_atendimento_form");
    const horario_intervalo_form = document.getElementById("horario_intervalo_form");
    const horario_card_titulo = document.getElementById("horario_card_titulo");
    const horario_card = document.getElementById("horario_card");

    const agenda_novo_agendamento_navbar = document.getElementById("agenda_novo_agendamento_navbar");
    
    switch (nivelAcesso) {
        case "REPRESENTANTE_LEGAL":
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case "PROFESSOR_AUXILIAR":
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case "ALUNO":
            aluno_navbar.style.display = "none";
            professores_navbar.style.display = "none";

            horario_atendimento_form.style.display = "none";
            horario_intervalo_form.style.display = "none";
            horario_card_titulo.style.display = "none";
            horario_card.style.display = "none";
            break;
    }
}

carregarNavBar() 
puxarNome()