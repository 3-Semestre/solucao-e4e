async function plotarProximosAgendamentos() {

    const resposta = await fetch("http://localhost:7000/dashboard/ultimos-3-agendamentos-professor");

    const listaAgendamentos = await resposta.json();
    console.log(listaAgendamentos)

    const cardsAlunos = document.getElementById("agendamentos");


    cardsAlunos.innerHTML = listaAgendamentos.map((aluno) => {
        // Data de entrada
    let dataString = aluno.data;

    // Converte a string para um objeto Date
    let data = new Date(dataString);

    // Extrai o dia e o mês
    let dia = data.getDate();
    let mes = data.getMonth(); // O mês é baseado em zero (0 = janeiro, 1 = fevereiro, etc.)

    // Array com os nomes dos meses
    let nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    // Formata o dia com dois dígitos
    let diaFormatado = dia.toString().padStart(2, '0');

    // Obtém o nome do mês
    let nomeMes = nomesMeses[mes];

    // Imprime o resultado
    console.log(`Dia ${diaFormatado} e mês ${nomeMes}`);
        return `<div class="box">
        <div class="data">
            <h2 class="dia_proxima_data">${diaFormatado}</h2>
            <p class="mes_proxima_data">${nomeMes}</p>
        </div>
        <div class="content">
            <p class="dia_semana_proxima_data">${aluno.dia_Semana}</p>
            <p class="horario_proxima_data" >${aluno.horario_Inicio}</p>
            <p class="nome_aluno_proxima_data">${aluno.aluno_Nome}</p>
        </div>
    </div>`
    }).join('');
}

async function plotarKPIs() {

    const proximosAgendamentosFetch = await fetch("http://localhost:7000/dashboard/qtd-agendamento-mes-professor");
    const alunosNovosFetch = await fetch("http://localhost:7000/dashboard/qtd-agendamento-mes-professor");
    const confirmacaoAgendamento = await fetch("http://localhost:7000/dashboard/tempo-confirmacao");
    const cancelamento = await fetch("http://localhost:7000/dashboard/qtd-cancelamento-alunos");

    const respostaProximosAgendamentos = await proximosAgendamentosFetch.json();
    const respostaAlunosNovos = await alunosNovosFetch.json();
    const respostaConfirmacaoAgendamento = await confirmacaoAgendamento.json();
    const respostaCancelamento = await cancelamento.json();
    console.log("PLOTANDO KPIS: ")
    console.log(`Novos agendamentos: ${respostaProximosAgendamentos}`)
    console.log(`Alunos Novos: ${respostaAlunosNovos}`)
    console.log(`Confirmacao Agendamento: ${respostaConfirmacaoAgendamento}`)
    console.log(`Resposta Cancelamento : ${respostaCancelamento}`)

    const cardNovoAgendamento = document.getElementById("novos-agendamentos");


    cardNovoAgendamento.innerHTML = `<p>Novos Agendamentos</p>
        <h2>${respostaProximosAgendamentos}</h2>
        <div class="variação">
            <div class="seta-baixo">
            </div>
            <div class="porcentagem">
                <p class="ruim">70,00 %</p>
            </div>
        </div>`;

    const cardConfirmacaoAgendamento = document.getElementById("confirmacao-agendamento");


    cardConfirmacaoAgendamento.innerHTML = `<p>Confirmação de Agendamento</p>
    <h2>${respostaConfirmacaoAgendamento}<span>min</span></h2>
    <div class="variação">
        <div class="seta-cima">
        </div>
        <div class="porcentagem">
            <p class="bom">10,00 %</p>
        </div>
    </div>`;

    
    const cardAlunosNovos = document.getElementById("alunos-novos");
    cardAlunosNovos.innerHTML = `<p>Alunos Novos</p>
    <h2>${respostaAlunosNovos}</h2>
    <div class="variação">
        <div class="seta-cima">
        </div>
        <div class="porcentagem">
            <p class="bom">20,53 %</p>
        </div>
    </div>`;    

    const cardCancelamento = document.getElementById("cancelamento");
    cardCancelamento.innerHTML = `<p>Cancelamento</p>
        <h2>${respostaCancelamento}</h2>
        <div class="variação">
            <div id="seta-baixo">
            </div>
            <div class="porcentagem">
                <p class="bom">70,00 %</p>
            </div>
        </div>`;
}

plotarProximosAgendamentos()
plotarKPIs()