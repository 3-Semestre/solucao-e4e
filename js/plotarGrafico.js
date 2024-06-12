async function buscarDados() {
    const resposta = await fetch("http://localhost:7000/dashboard/qtd-conclusao");

    const respostaDados = await resposta.json();

    console.log(respostaDados);

    const dados = {
        labels: [
            'Não Concluídos',
            'Concluídos'
        ],
        datasets: [{
            label: 'Agendamentos Concluídos',
            data: [respostaDados[0].qtd_Aulas_Concluidas, respostaDados[0].qtd_Aulas_Nao_concluidas],
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

async function buscarDadosCancelamento() {
    const resposta = await fetch("http://localhost:7000/dashboard/taxa-cancelamento-mes");

    const respostaDados = await resposta.json();

    console.log(respostaDados);

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

    for (var i = 0; i < respostaDados.length - 1; i++) {
        dadosCancelamento.datasets[0].data.push(respostaDados[i].taxa_Cancelamento);
    }

    var chartCancelamentoConfig = {
        type: 'line',
        data: dadosCancelamento,
        options: {}
    };

    var chartCancelamento = new Chart(document.getElementById('chartCancelamento'), chartCancelamentoConfig);

}
try {
    buscarDados()
    buscarDadosCancelamento()
} catch (e) {
    console.log(e)
}