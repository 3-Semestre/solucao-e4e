
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
    if(qtdAulasConcluidas == null){
        console.log("A quantidade de aulas concluidas é nula. Convertendo para 1.")
        qtdAulasConcluidas = 1;
    } 
    
    if(qtdAulasNaoConcluidas == null){
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



    const respostaDados = await resposta.json();

    
    let dadosCancelamento = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Taxa de Cancelamento',
            data: [],
            fill: true,
            backgroundColor: 'rgba(7, 43, 89, 0.5)',
            borderColor: 'rgba(7, 43, 89, 1)',
            borderWidth: 1
        }]
    };

    for (var i = 0; i < respostaDados.length; i++) {
        dadosCancelamento.datasets[0].data.push(respostaDados[i].taxa_Cancelamento);
    }

    var chartCancelamentoConfig = {
        type: 'line',
        data: dadosCancelamento,
        options: {}
    };

    var chartCancelamento = new Chart(document.getElementById('chartCancelamento'), chartCancelamentoConfig);

}

async function buscarDadosCancelamentoAluno() {
    const resposta = await fetch(`http://localhost:7000/dashboard/visao-mes-aluno/${sessionStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    const respostaDados = await resposta.json();

    let aulasRealizadas = {
        labels: [],
        datasets: [{
            label: 'Aulas Realizadas',
            data: [],
            fill: true,
            backgroundColor: 'rgba(7, 43, 89, 0.5)',
            borderColor: 'rgba(7, 43, 89, 1)',
            borderWidth: 1
        }]
    };

    for (var i = 0; i < respostaDados.length; i++) {
        aulasRealizadas.datasets[0].data.push(respostaDados[i].quantidade_Aulas_Concluidas);
        aulasRealizadas.labels.push(respostaDados[i].mes)
    }

    var chartAulasRealizadasConfig = {
        type: 'line',
        data: aulasRealizadas,
        options: {}
    };

    var chartAulasRealizadas= new Chart(document.getElementById('chartAulasRealizadas'), chartAulasRealizadasConfig);
    window.chartAulasRealizadas = chartAulasRealizadas;
}

try {
    if(nivelAcesso !== "ALUNO"){
        buscarDadosProfessor()
        buscarDadosCancelamentoProfessor()
    } else {
        buscarDadosCancelamentoAluno()
    }
    //buscarDados()
    //buscarDadosCancelamento()
    console.log(nivelAcesso)
} catch (e) {
    console.log(e)
}