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
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    };

    var pizzaChartAgendamento = new Chart(document.getElementById('pizzaChartAgendamento'), configuracao);
}
try {
    buscarDados()
} catch (e) {
    console.log(e)
}

async function buscarDadosCancelamento() {
    const resposta = await fetch("http://localhost:7000/dashboard/");

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
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    };

    var pizzaChartAgendamento = new Chart(document.getElementById('pizzaChartAgendamento'), configuracao);
}