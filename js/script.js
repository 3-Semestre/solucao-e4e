const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar')
const conteudo = document.querySelector('.conteudo'); // Seleciona a div conteudo
// trocar entre "desenvolvimento" e "apresentacao"
const ambiente = "apresentacao"

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.collapse.show'); // Seleciona todos os dropdowns abertos
    dropdowns.forEach(dropdown => {
        const bsCollapse = new bootstrap.Collapse(dropdown, {
            toggle: false // Não abre/fecha ao inicializar, apenas colapsa
        });
        bsCollapse.hide(); // Fecha o dropdown
    });
}

toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar.classList.toggle('open');

    // Fecha todos os dropdowns ao abrir/fechar o sidebar
    closeAllDropdowns();

    // Adiciona ou remove a classe ativa para o botão
    toggleBtn.classList.toggle('active-menu');
    // Alterna a classe open no conteúdo
    conteudo.classList.toggle('open');

    try {
        const calendario = document.querySelector('.calendario');
        calendario.classList.toggle('menu-fechado');
    } catch (error) {
        console.log("Página não utiliza calendário")
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
    const cadastrar_professor_navbar = document.getElementById("cadastro_professor");
    const agenda_novo_agendamento_navbar = document.getElementById("agenda_novo_agendamento_navbar");

    const link_dashboard = document.getElementById("dashboard_href")

    switch (Number(nivelAcesso)) {
        case 3:
            link_dashboard.href = "dashboardAdmin.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            break;
        case 2:
            link_dashboard.href = "dashboardAdmin.html"
            agenda_novo_agendamento_navbar.style.display = "none";
            cadastrar_professor_navbar.style.display = "none";
            break;
        case 1:
            link_dashboard.href = "dashboardAluno.html"
            gerenciar_aluno_navbar.style.display = "none";
            gerenciar_professores_navbar.style.display = "none";
            break;
    }
}

async function desautenticarUsuario() {
    const token = sessionStorage.getItem('token')
    const nivelAcesso = sessionStorage.getItem('nivel_acesso_cod');
    const id = sessionStorage.getItem('id')
    usuario = retornaNivelRequisicao(Number(nivelAcesso))

    const respostaDesautenticar = await fetch(`http://localhost:8080/api/usuarios/${usuario}/desautenticar/${id}`, {
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
    const horaFormatada = horaInt < 10 ? `0${horaInt}` : `${horaInt}`;
    return `${horaFormatada}:${minuto}`;
}

function formatarHorarioPut(horario) {
    if (horario.length === 5) {
        return horario + ':00';
    }
    return horario;
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
        case 5:
            status = "Transferido";
            break;
    }
    return status;
}

function retornaNivelRequisicao(nivel_acesso) {
    if (nivel_acesso == 1) {
        return "representante-legal"
    } else if (nivel_acesso === 2) {
        return "professor"
    } else if (nivel_acesso === 3) {
        return "aluno"
    }
}

carregarNavBar()
puxarNome()