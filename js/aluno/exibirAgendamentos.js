const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')
let paginaAtual = 1;
const resultadosPorPagina = 7;

resultados = [];

function carregarHeadersTabela() {
    const tabela = document.getElementById("tabela_agendamento")
    switch (nivel_acesso_cod) {
        case "1":
            tabela.innerHTML += `
            <thead>
                    <tr>
                        <th>Nome do Aluno</th>
                        <th>Assunto</th>
                        <th>Professor</th>
                        <th>Data</th>
                        <th>Horário de Início</th>
                        <th>Horário de Fim</th>
                        <th>Status</th>
                        <th>Mudar Status</th>
                        </tr>
                        </thead>
            `
            break;
        case "2":
            tabela.innerHTML += `
            <thead>
            <tr>
                <th>Nome do Aluno</th>
                    <th>Assunto</th>
                    <th>Professor</th>
                    <th>Data</th>
                    <th>Horário de Início</th>
                    <th>Horário de Fim</th>
                    <th>Status</th>
                    <th>Mudar Status</th>
            </tr>
            </thead>
            `
            break;
        case "3":
            tabela.innerHTML += `
            <thead>
                    <tr>
                        <th>Assunto</th>
                        <th>Professor</th>
                        <th>Data</th>
                        <th>Horário de Início</th>
                        <th>Horário de Fim</th>
                        <th>Status</th>
                        <th>Cancelar</th>
                    </tr>
            </thead>
            `
            break;
    }
}

async function buscarTodosAgendamentos() {
    const resposta = await fetch(`http://localhost:8080/agendamento/${nivel_acesso_cod}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dados = await resposta.json();

    if (!dados || dados.length === 0) {
        throw new Error('Dados não encontrados');
    }
    preencherTabela(dados)
}

function mudarPagina(pagina) {
    if (pagina < 1 || pagina > Math.ceil(totalDados / resultadosPorPagina)) return;
    
    paginaAtual = pagina;

    const tabela = document.getElementById("tabela_agendamento");
    tabela.innerHTML = ''; // Limpa a tabela para exibir a nova página
    carregarHeadersTabela();

    const inicio = (pagina - 1) * resultadosPorPagina;
    const fim = Math.min(inicio + resultadosPorPagina, totalDados);
    
    for (let i = inicio; i < fim; i++) {
        tabela.innerHTML += resultados[i];
    }

    atualizarPaginacao();
}

function atualizarPaginacao() {
    const paginacao = document.getElementById("paginacao_tabela");
    paginacao.innerHTML = `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Anterior" onclick="mudarPagina(paginaAtual - 1)">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Anterior</span>
            </a>
        </li>
    `;
    
    const totalPaginas = Math.ceil(totalDados / resultadosPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
        paginacao.innerHTML += `
            <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="mudarPagina(${i})">${i}</a>
            </li>
        `;
    }

    paginacao.innerHTML += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Próximo" onclick="mudarPagina(paginaAtual + 1)">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Próximo</span>
            </a>
        </li>
    `;
}

function preencherTabela(dados) {
    totalDados = dados.length;
    resultados.length = 0;

    dados.map((agendamento) => resultados.push(`
        <tbody>
            <tr>
                <td ${nivel_acesso_cod === "3" ? 'style="display: none;"' : ''}>${agendamento.aluno.nomeCompleto}</td>
                <td>${agendamento.assunto}</td>
                <td>${agendamento.professor.nomeCompleto}</td>
                <td>${formatarData(agendamento.data)}</td>
                <td>${formatarHorario(agendamento.horarioInicio)}</td>
                <td>${formatarHorario(agendamento.horarioFim)}</td>
                <td>${Array.from(agendamento.status)[0] + agendamento.status.slice(1).toLocaleLowerCase()}</td>
                <td>lixin</td>
            </tr>
        </tbody>
    `));

    mudarPagina(1);
}

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

window.onload = function () {
    carregarHeadersTabela();
    buscarTodosAgendamentos();
};