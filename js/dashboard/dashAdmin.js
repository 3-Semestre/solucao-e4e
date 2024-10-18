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

professorSelect.addEventListener('change', async (event) => {
    console.log("Professor selecionado: " + professorSelect.value);
    professor = professorSelect.value
    buscarQuantidadeAgendamentosCancelado(professor)
    buscarQuantidadeAgendamentosTransferidos(professor)
    buscarComprimentoMeta(professor)
});

buscarProfessores()