// Gráfico de Donut
function plotarGrafios() {
    const ctxDonut = document.getElementById('pizzaChartAgendamento').getContext('2d');
    const donutChart = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Não Cumpridas', 'Cumpridas'],
            datasets: [{
                data: [30, 70], // Proporção de dados
                backgroundColor: ['#2C3E50', '#00D2A0'],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            let dataset = tooltipItem.dataset.data;
                            let currentValue = dataset[tooltipItem.dataIndex];
                            let total = dataset.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
                            let percentage = Math.floor(((currentValue / total) * 100) + 0.5); // Calcula porcentagem
                            return tooltipItem.label + ': ' + percentage + '%';
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Linha
    const ctxLine = document.getElementById('chartCancelamento').getContext('2d');
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Quantidade de Alunos',
                data: [2, 3, 4, 1, 5, 2, 4, 3, 5, 7, 6, 4], // Mock de dados
                backgroundColor: '#072b59c0',
                borderColor: '#072B59',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta a legenda
                }
            }
        }
    });
}

plotarGrafios();
