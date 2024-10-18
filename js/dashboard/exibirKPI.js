async function plotarProximosAgendamentos(nivelAcesso) {

    if (nivelAcesso == "ALUNO") {
        var resposta = await fetch(`http://localhost:7000/dashboard/ultimos-3-agendamentos-aluno/${sessionStorage.getItem('id')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    } else {
        var resposta = await fetch(`http://localhost:7000/dashboard/ultimos-3-agendamentos-professor/${sessionStorage.getItem('id')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    }

    const cardsAlunos = document.getElementById("agendamentos");
    if (resposta.status == 204) {
        cardsAlunos.innerHTML = "Não há agendamentos a serem realizados."
        return
    }

    const listaAgendamentos = await resposta.json();

    const diasSemana = {
        "Sunday": "Domingo",
        "Monday": "Segunda-feira",
        "Tuesday": "Terça-feira",
        "Wednesday": "Quarta-feira",
        "Thursday": "Quinta-feira",
        "Friday": "Sexta-feira",
        "Saturday": "Sábado"
    };

    cardsAlunos.innerHTML = listaAgendamentos.map((aluno) => {
        let dataString = aluno.data;
        let data = new Date(dataString);

        let dia = data.getUTCDate();
        let mes = data.getMonth();

        let nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        let diaFormatado = dia.toString().padStart(2, '0');
        let nomeMes = nomesMeses[mes];

        // Formatar o horário
        let horario = new Date(`1970-01-01T${aluno.horario_Inicio}Z`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Traduzir o dia da semana
        let diaSemanaPortugues = diasSemana[aluno.dia_Semana];

        return `
        <div class="box">
            <div class="data">
                <h2 class="dia_proxima_data">${diaFormatado}</h2>
                <p class="mes_proxima_data">${nomeMes}</p>
            </div>
            <div class="content">
                <p class="dia_semana_proxima_data">${diaSemanaPortugues}</p>
                <p class="horario_proxima_data">${horario}</p>
                <p class="nome_aluno_proxima_data">${aluno.aluno_Nome}</p>
            </div>
        </div>`;
    }).join('');
}

async function plotarKPIsProfessor() {
    try {
        const proximosAgendamentosFetch = await fetch("http://localhost:7000/dashboard/qtd-agendamento-mes-professor", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaProximosAgendamentos = await proximosAgendamentosFetch.json();


        const cardNovoAgendamento = document.getElementById("novos-agendamentos");

        console.log("PLOTANDO KPIS: ")
        console.log(`Novos agendamentos: ${respostaProximosAgendamentos}`)

        cardNovoAgendamento.innerHTML = `<p>Novos Agendamentos</p>
            <h2>${respostaProximosAgendamentos}</h2>
            <div class="variação">
                <div class="seta-baixo">
                </div>
                <div class="porcentagem">
                    <p class="ruim">70,00 %</p>
                </div>
            </div>`;

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const alunosNovosFetch = await fetch("http://localhost:8080/dashboard/qtd-novos-alunos-mes", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaAlunosNovos = await alunosNovosFetch.json();

        console.log(`Alunos Novos: ${respostaAlunosNovos}`)

        const cardAlunosNovos = document.getElementById("alunos-novos");

        cardAlunosNovos.innerHTML = `<p>Alunos Novos</p>
    <h2>${respostaAlunosNovos}</h2>
    <div class="variação">
        <div class="seta-cima">
        </div>
        <div class="porcentagem">
            <p class="bom">20,53 %</p>
        </div>
    </div>`;

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const confirmacaoAgendamento = await fetch("http://localhost:8080/dashboard/tempo-confirmacao", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaConfirmacaoAgendamento = await confirmacaoAgendamento.json();

        console.log(`Confirmacao Agendamento: ${respostaConfirmacaoAgendamento}`)


        const cardConfirmacaoAgendamento = document.getElementById("confirmacao-agendamento");


        cardConfirmacaoAgendamento.innerHTML = `<p>Confirmação de Agendamento</p>
<h2>${respostaConfirmacaoAgendamento}<span>min</span></h2>
<div class="variação">
    <div class="seta-cima">
    </div>
    <div class="porcentagem">
        <p class="bom">10,00 %</p>
    </div>
</div>`;

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

    try {
        const cancelamento = await fetch("http://localhost:8080/dashboard/qtd-cancelamento-alunos", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const respostaCancelamento = await cancelamento.json();

        console.log(`Resposta Cancelamento : ${respostaCancelamento}`)
    
    
    
        const cardCancelamento = document.getElementById("cancelamento");
        cardCancelamento.innerHTML = `<p>Cancelamento</p>
            <h2>${respostaCancelamento}</h2>
            <div class="variação">
                <div id="seta-baixo">
                </div>
                <div class="porcentagem">
                    <p class="bom">70,00 %</p>
                </div>
            </div>`;

    } catch {
        console.log("Erro ao buscar próximos agendamentos")
    }

}


var nivelAcesso = sessionStorage.getItem('nivel_acesso')
plotarProximosAgendamentos(nivelAcesso)
if (nivelAcesso !== "ALUNO") {
    plotarKPIsProfessor()
} else {
    plotarKPIsAluno()
}
