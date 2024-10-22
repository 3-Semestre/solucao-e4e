function carregarGrafico() {
    const ctx = document.getElementById('chartAulasRealizadas').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Aulas Realizadas',
                data: [3, 2, 5, 6, 4, 7, 5, 8, 6, 10, 9, 7], // Mock de dados
                backgroundColor: '#072b59c0',
                borderColor: '#072B59',
                borderWidth: 2,
                fill: false, // Preenche a área sob a linha
                tension: 0.4, // Curvatura da linha
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
    window.myChart = myChart;
}

carregarGrafico()
