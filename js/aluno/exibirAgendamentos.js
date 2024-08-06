const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')

async function buscarTodosAgendamentos() {
    const resposta = await fetch(`http://localhost:8080/agendamento/${id}`);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dados = await resposta.json();

    if (!dados || dados.length === 0) {
        throw new Error('Dados não encontrados');
    }
    preencherTabela(dados)
}

function preencherTabela(dados) {
    const tabela = document.getElementById("tabela_agendamento")
    const agendamentosTabela = dados.map((agendamento) => `
    <tbody>
        <tr>
            <td>${agendamento.aluno.nomeCompleto}</td>
            <td>${agendamento.assunto}</td>
            <td>${agendamento.professor.nomeCompleto}</td>
            <td>${formatarData(agendamento.data)}</td>
            <td>${formatarHorario(agendamento.horarioInicio)}</td>
            <td>${formatarHorario(agendamento.horarioFim)}</td>
            <td>${Array.from(agendamento.status)[0] + agendamento.status.toLocaleLowerCase()}</td>
            <td>AQUI VAI CRIAR UM CARD PRA PODER EDITAR ENTENDERAM?</td>
        </tr>
    </tbody>
    `).join('');

    tabela.innerHTML += agendamentosTabela;
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
    const [hora, minuto] = horario.split(':');
    const horaInt = parseInt(hora, 10);
    const periodo = horaInt >= 12 ? 'PM' : 'AM';
    const horaFormatada = horaInt % 12 || 12; // Converte 0 para 12
    return `${horaFormatada}:${minuto} ${periodo}`;
}

window.onload = function () {
    buscarTodosAgendamentos();
};