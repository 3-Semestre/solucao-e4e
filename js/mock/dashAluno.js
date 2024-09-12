function carregarGrafico(){
const ctx = document.getElementById('chartCancelamento').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Aulas Realizadas',
                data: [3, 2, 5, 6, 4, 7, 5, 8, 6, 10, 9, 7], // Mock de dados
                backgroundColor: 'rgba(173, 216, 230, 0.5)', // Azul claro com opacidade
                borderColor: 'rgba(0, 123, 255, 1)', // Azul
                borderWidth: 2,
                fill: true, // Preenche a área sob a linha
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
    });}

    window.onload = function (){
        carregarGrafico()
    }