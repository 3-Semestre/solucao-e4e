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
            label: 'My First Dataset',
            data: [300, 170],
            backgroundColor: [
                'rgba(7, 43, 89, 1)',
                'rgba(52, 209, 191, 1)'
            ],
            hoverOffset: 4
        }]
    };

    // Configurações do primeiro gráfico de rosca
    var configuracao = {
        type: 'doughnut',
        data: dados,
        options: {}
    };

    // Renderiza o primeiro gráfico de rosca
    var meuGrafico = new Chart(document.getElementById('meuGrafico'), configuracao);
}
try {
    buscarDados()
} catch (e) {
    console.log(e)
}