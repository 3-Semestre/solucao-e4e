function plotarGrafios() {
    const ctxBar = document.getElementById('myChartMeta').getContext('2d');
    const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], // Meses
            datasets: [
                {
                    label: 'Meta', // Dados da Meta
                    data: [50, 60, 70, 80, 75, 90, 95, 85, 80, 75, 65, 60], // Mock dos valores de Meta
                    backgroundColor: 'rgba(128, 128, 128, 0.466)', // Cor das barras da Meta
                    borderColor: 'rgba(128, 128, 128, 0.466)',
                    borderWidth: 1
                },
                {
                    label: 'Cumprido', // Dados de Cumprido
                    data: [45, 55, 65, 75, 70, 85, 90, 80, 70, 65, 60, 50], // Mock dos valores Cumpridos
                    backgroundColor: '#072B59', // Cor das barras de Cumprido
                    borderColor: '#072B59',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Desativa a grade no eixo Y
                    } // Inicia o eixo Y no zero
                },
                x: {
                    grid: {
                        display: false // Desativa a grade no eixo X
                    }
                }   
            },
            plugins: {
                legend: {
                    display: true, // Exibe a legenda
                    position: 'top' // Posiciona a legenda no topo
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
                label: 'Taxa de Cancelamento',
                data: [2, 3, 4, 1, 5, 2, 4, 3, 5, 7, 6, 4], // Mock de dados
                backgroundColor: '#072b59c0',
                borderColor: '#072B59',
                borderWidth: 2,
                fill: false,
                tension: 0.3,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Adiciona o símbolo de porcentagem
                        }
                    }
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
