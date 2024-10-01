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

    const gerenciar_aluno_navbar = document.getElementById("alunos_navbar");
    const gerenciar_professores_navbar = document.getElementById("professores_navbar");
    const agenda_novo_agendamento_navbar = document.getElementById("agenda_novo_agendamento_navbar");
    const dashboard_representante_legal = document.getElementById("dashboard_rep_legal");

    const link_dashboard = document.getElementById("dashboard_href")

    switch (nivelAcesso) {
        case "3":
            link_dashboard.href = "dashboardProfessor.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case "2":
            link_dashboard.href = "dashboardProfessor.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            dashboard_representante_legal.style.display = "none";
            break;
        case "1":
            link_dashboard.href = "dashboardAluno.html"
            gerenciar_aluno_navbar.style.display = "none";
            gerenciar_professores_navbar.style.display = "none";
            dashboard_representante_legal.style.display = "none";
            break;
    }
}

async function desautenticarUsuario() {
    const token = sessionStorage.getItem('token')
    const nivelAcesso = sessionStorage.getItem('nivel_acesso_cod');
    const id = sessionStorage.getItem('id')
    usuario = "";
    switch (nivelAcesso) {
        case "1":
            usuario = "aluno";
            break;
        case "2":
            usuario = "professor";
            break;
        case "3":
            usuario = "representante-legal";
            break;
    }

    const respostaDesautenticar = await fetch(`http://localhost:8080/usuarios/${usuario}/desautenticar/${id}`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaDesautenticar.ok) {
        sessionStorage.clear()
        window.location.href = "login2.html"
    }
}

// Funções auxiliares
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
    const [hora, minuto] = horario.split(':');
    const horaInt = parseInt(hora, 10);
    const periodo = horaInt >= 12 ? 'PM' : 'AM';
    const horaFormatada = horaInt % 12 || 12;
    return `${horaFormatada}:${minuto} ${periodo}`;
}

function tratarNome(nome) {
    let nomeTratado = nome.replace(/_/g, ' ');

    let palavras = nomeTratado.split(' ');

    palavras = palavras.map(palavra => {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    });

    nomeTratado = palavras.join(' ');

    return nomeTratado;
}

function formatarCelular(telefone) {
    let value = telefone;
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '+$1 $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value.substring(0, 15);
}

function buscaUltimoStatus(status) {
    const statusArray = status.split(',');

    const ultimoStatus = statusArray[statusArray.length - 1];

    var status;

    switch (Number(ultimoStatus)) {
        case 1:
            status = "Pendente";
            break;
        case 2:
            status = "Confirmado";
            break;
        case 3:
            status = "Concluído";
            break;
        case 4:
            status = "Cancelado";
            break;
    }
    return status;
}

carregarNavBar()
puxarNome()