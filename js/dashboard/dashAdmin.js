const professorSelect = document.getElementById("professores");

async function buscarProfessores() {
    try {
        const response = await fetch('http://localhost:8080/usuarios/professor', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const professores = await response.json();
            professores.forEach(professor => {
                const option = document.createElement('option');
                option.value = professor.id;
                option.innerText = professor.nomeCompleto;
                professorSelect.appendChild(option);
            });
        } else if (response.status == 204) {
            Swal.fire({
                title: 'Erro',
                text: 'Não há professores cadastrados.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'red',
                background: '#f2f2f2',
                color: '#333'
            });
        } else {
            Swal.fire({
                title: 'Erro',
                text: 'Erro inesperado.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'red',
                background: '#f2f2f2',
                color: '#333'
            });
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

async function buscarQuantidadeAgendamentosCancelado(id) {
    try {
        const response = await fetch(`http://localhost:7000/dashboard/qtd-agendamentos-cancelados/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
        if(response.ok){
            dados = await response.json();
            document.getElementById("qtd-agendamentos-cancelados").innerHTML = dados;
        }
    } catch (error) {
        console.log(error)
        document.getElementById("qtd-agendamentos-cancelados").innerHTML = 0;
    }
}

async function buscarQuantidadeAgendamentosTransferidos(id) {
    try {
        const response = await fetch(`http://localhost:7000/dashboard/aulas-tranferidas-professor/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
        if(response.ok){
            dados = await response.json();
            document.getElementById("aulas-tranferidas-professor").innerHTML = dados;
        }
    } catch (error) {
        console.log(error)
        document.getElementById("aulas-tranferidas-professor").innerHTML = 0;
    }
}

async function buscarComprimentoMeta(id) {
    try {
        const response = await fetch(`http://localhost:7000/dashboard/taxa-cumprimento-metas/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
        if(response.ok){
            dados = await response.json();
           console.log(dados)
        }
    } catch (error) {
        console.log(error)
    }
}

function plotarGrafios() {
    const ctxDonut = document.getElementById('pizzaChartAgendamento').getContext('2d');
    const donutChart = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Agendamentos Não Concluídos', 'Agendamentos Concluídos'],
            datasets: [{
                data: [],
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
                data: [],
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1,
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

professorSelect.addEventListener('change', async (event) => {
    console.log("Professor selecionado: " + professorSelect.value);
    professor = professorSelect.value
    buscarQuantidadeAgendamentosCancelado(professor)
    buscarQuantidadeAgendamentosTransferidos(professor)
    buscarComprimentoMeta(professor)
});

plotarGrafios()
buscarProfessores()