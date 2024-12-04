// top3-meses
async function plotarKpi() {

    const top3MesesAula = await fetch(`http://localhost:7000/dashboard/top-3-meses-aluno/${sessionStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    console.log("resposta kpi " + top3MesesAula.status)

    const cardNovoAgendamento = document.getElementById("top3-meses");

    if (top3MesesAula.status == 204) {
        cardNovoAgendamento.innerHTML = "Não há top 3 meses realizados."
        return
    }

    const respostaTop3MesesAula = await top3MesesAula.json();


    cardNovoAgendamento.innerHTML = respostaTop3MesesAula.map((top, index) => {
        return `
                <div class="box-kpis">
                <div class="line-box">
                </div>
                <div class="content-kpis" id="alunos-novos">
                    <p>${top.mes}</p>
                    <h2>${top.quantidade_Aulas_Concluidas}</h2>
                </div>
            </div>`;
    }).join('');
}

async function plotarProximosAgendamentos() {
    var resposta = await fetch(`http://localhost:7000/dashboard/ultimos-3-agendamentos-aluno/${sessionStorage.getItem('id')}`, {
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
                <p class="horario_proxima_data">${formatarHorario(aluno.horario_Inicio)}</p>
                <p class="nome_aluno_proxima_data">${aluno.aluno_Nome}</p>
            </div>
        </div>`;
    }).join('');
}

async function plotarAulasRealizadas() {
    const resposta = await fetch(`http://localhost:7000/dashboard/visao-mes-aluno/${sessionStorage.getItem('id')} `, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    console.log("resposta gráfico " + resposta.status)

    if (resposta.status == 204) {
        document.getElementById("chartAulasRealizadas").style.display = "none";
        document.getElementById("div_chart").innerHTML = "Não há histórico de registros para exibir.";
        return
    }

    const dados = await resposta.json();

    let aulasRealizadas = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [{
            label: 'Aulas Realizadas',
            data: Array(12).fill(0),
            fill: false,
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

    for (var i = 0; i < dados.length; i++) {
        const mesIndex = mesMap[dados[i].mes];
        aulasRealizadas.datasets[0].data[mesIndex] = dados[i].quantidade_Aulas_Concluidas;
    }

    if (window.chartAulasRealizadas instanceof Chart) {
        window.chartAulasRealizadas.destroy();
    }

    var chartAulasRealizadasConfig = {
        type: 'line',
        data: aulasRealizadas,
        options: {}
    };

    var chartAulasRealizadas = new Chart(document.getElementById('chartAulasRealizadas'), chartAulasRealizadasConfig);
    window.chartAulasRealizadas = chartAulasRealizadas;
}

plotarKpi();
plotarProximosAgendamentos();
plotarAulasRealizadas();
