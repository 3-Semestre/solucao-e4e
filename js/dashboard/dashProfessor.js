async function plotarKPIsProfessor() {
    try {
        const proximosAgendamentosFetch = await fetch("http://localhost:7000/dashboard/qtd-agendamento-mes-professor", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaProximosAgendamentos = await proximosAgendamentosFetch.json();


        const cardNovoAgendamento = document.getElementById("novos-agendamentos");

        console.log("PLOTANDO KPIS: ")
        console.log(`Novos agendamentos: ${respostaProximosAgendamentos}`)

        cardNovoAgendamento.innerHTML = `<p>Novos Agendamentos</p>
            <h2>${respostaProximosAgendamentos}</h2>
            <div class="variação">
                <div class="seta-baixo">
                </div>
                <div class="porcentagem">
                    <p class="ruim">70,00 %</p>
                </div>
            </div>`;

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const alunosNovosFetch = await fetch("http://localhost:8080/dashboard/qtd-novos-alunos-mes", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaAlunosNovos = await alunosNovosFetch.json();

        console.log(`Alunos Novos: ${respostaAlunosNovos}`)

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

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const confirmacaoAgendamento = await fetch("http://localhost:8080/dashboard/tempo-confirmacao", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaConfirmacaoAgendamento = await confirmacaoAgendamento.json();

        console.log(`Confirmacao Agendamento: ${respostaConfirmacaoAgendamento}`)


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

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const cancelamento = await fetch("http://localhost:8080/dashboard/qtd-cancelamento-alunos", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaCancelamento = await cancelamento.json();

        console.log(`Resposta Cancelamento : ${respostaCancelamento}`)



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

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

}

async function plotarProximosAgendamentos() {

    var resposta = await fetch(`http://localhost:7000/dashboard/ultimos-3-agendamentos-professor/${sessionStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });


    const cardsAlunos = document.getElementById("agendamentos");
    if (resposta.status == 204) {
        cardsAlunos.innerHTML = "Não há agendamentos a serem realizados."
        return
    }

    const listaAgendamentos = await resposta.json();

    const diasSemana = {
        "Sunday": "Domingo",
        "Monday": "Segunda-feira",
        "Tuesday": "Terça-feira",
        "Wednesday": "Quarta-feira",
        "Thursday": "Quinta-feira",
        "Friday": "Sexta-feira",
        "Saturday": "Sábado"
    };

    cardsAlunos.innerHTML = listaAgendamentos.map((aluno) => {
        let dataString = aluno.data;
        let data = new Date(dataString);

        let dia = data.getUTCDate();
        let mes = data.getMonth();

        let nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        let diaFormatado = dia.toString().padStart(2, '0');
        let nomeMes = nomesMeses[mes];

        // Formatar o horário
        let horario = new Date(`1970-01-01T${aluno.horario_Inicio}Z`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Traduzir o dia da semana
        let diaSemanaPortugues = diasSemana[aluno.dia_Semana];

        return `
        <div class="box">
            <div class="data">
                <h2 class="dia_proxima_data">${diaFormatado}</h2>
                <p class="mes_proxima_data">${nomeMes}</p>
            </div>
            <div class="content">
                <p class="dia_semana_proxima_data">${diaSemanaPortugues}</p>
                <p class="horario_proxima_data">${horario}</p>
                <p class="nome_aluno_proxima_data">${aluno.aluno_Nome}</p>
            </div>
        </div>`;
    }).join('');
}

async function buscarDadosProfessor() {
    const resposta = await fetch("http://localhost:7000/dashboard/qtd-conclusao", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    const respostaDados = await resposta.json();
    var qtdAulasConcluidas = respostaDados[0].qtd_Aulas_Concluidas
    var qtdAulasNaoConcluidas = respostaDados[0].qtd_Aulas_Nao_concluidas

    console.log("Pegando quantidade de aulas concluidas e não concluidas:")
    console.log(respostaDados)
    if (qtdAulasConcluidas == null) {
        console.log("A quantidade de aulas concluidas é nula. Convertendo para 1.")
        qtdAulasConcluidas = 1;
    }

    if (qtdAulasNaoConcluidas == null) {
        console.log("A quantidade de aulas não concluidas é nula. Convertendo para 1.")
        qtdAulasNaoConcluidas = 1
    }

    const dados = {
        labels: [
            'Não Concluídos',
            'Concluídos'
        ],
        datasets: [{
            label: 'Agendamentos Concluídos',
            data: [qtdAulasConcluidas, qtdAulasNaoConcluidas],
            backgroundColor: [
                'rgba(7, 43, 89, 1)',
                'rgba(52, 209, 191, 1)'
            ],
            hoverOffset: 4
        }]
    };

    var configuracao = {
        type: 'doughnut',
        data: dados,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    var pizzaChartAgendamento = new Chart(document.getElementById('pizzaChartAgendamento'), configuracao);
}

async function buscarDadosCancelamentoProfessor() {
    const resposta = await fetch("http://localhost:7000/dashboard/taxa-cancelamento-mes", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status !== 200) {
        cardsAlunos.innerHTML = "Erro para plotar o gráfico vindo da API."
        return
    }

    const respostaDados = await resposta.json();

    console.log(respostaDados)
    
    let dadosCancelamento = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Taxa de Cancelamento',
            data: [],
            fill: true,
            backgroundColor: '#072b59c0',
            borderColor: '#072B59',
            borderWidth: 1
        }]
    };

    const mesMap = {
        'Janeiro': 0,
        'Fevereiro': 1,
        'Março': 2,
        'Abril': 3,
        'Maio': 4,
        'Junho': 5,
        'Julho': 6,
        'Agosto': 7,
        'Setembro': 8,
        'Outubro': 9,
        'Novembro': 10,
        'Dezembro': 11
    };

    for (var i = 0; i < respostaDados.length; i++) {
        console.log(respostaDados[i])
        dadosCancelamento.datasets[0].data.push(respostaDados[i].taxa_Cancelamento);
    }

    var chartCancelamentoConfig = {
        type: 'line',
        data: dadosCancelamento,
        options: {}
    };

    var chartCancelamento = new Chart(document.getElementById('chartCancelamento'), chartCancelamentoConfig);

}

buscarDadosProfessor()
buscarDadosCancelamentoProfessor()
plotarProximosAgendamentos()
plotarKPIsProfessor() 