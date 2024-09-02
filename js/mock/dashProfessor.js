// Gráfico de Donut
function plotarGrafios(){
const ctxDonut = document.getElementById('pizzaChartAgendamento').getContext('2d');
const donutChart = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
        labels: ['Não Concluídos', 'Concluídos'],
        datasets: [{
            data: [30, 70], // Mock de dados para proporção
            backgroundColor: ['#2C3E50', '#00D2A0'],
            hoverOffset: 4
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
                position: 'right'
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
            backgroundColor: 'rgba(173, 216, 230, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
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
window.onload = function(){
    plotarGrafios()
}