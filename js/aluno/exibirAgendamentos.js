const id = sessionStorage.getItem('id');
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod');
const nivel_acesso = sessionStorage.getItem('nivel_acesso');
const token = sessionStorage.getItem('token');


let paginaAtual = 0;
let totalPaginas = 0;
const urlParams = new URLSearchParams(window.location.search);
const tempo = urlParams.get('tipo');

function carregarHeadersTabela() {
    const tabela = document.getElementById("tabela_agendamento");
    if (Number(nivel_acesso_cod) == 3 || Number(nivel_acesso_cod) == 2) {
        if (tempo == "passado") {
            tabela.innerHTML = `
                <thead>
                        <tr>
                            <th>Nome do Aluno</th>
                            <th>Assunto</th>
                            <th>Professor</th>
                            <th>Data</th>
                            <th>Horário de Início</th>
                            <th>Horário de Fim</th>
                            <th>Status</th>
                            <th>Visualizar Detalhes</th>
                        </tr>
                </thead>
                `;
        } else if (tempo == "futuro") {
            tabela.innerHTML = `
            <thead>
                    <tr>
                        <th>Nome do Aluno</th>
                        <th>Assunto</th>
                        <th>Professor</th>
                        <th>Data</th>
                        <th>Horário de Início</th>
                        <th>Horário de Fim</th>
                        <th>Status</th>
                        <th>Mudar Status</th>
                    </tr>
            </thead>
            `;
        }
    } else {
        if (tempo == "passado") {
            tabela.innerHTML = `
                <thead>
                        <tr>
                            <th>Assunto</th>
                            <th>Professor</th>
                            <th>Data</th>
                            <th>Horário de Início</th>
                            <th>Horário de Fim</th>
                            <th>Status</th>
                            <th>Visualizar Detalhes</th>
                        </tr>
                </thead>
                `;
        } else if (tempo == "futuro") {
            tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Assunto</th>
                    <th>Professor</th>
                    <th>Data</th>
                    <th>Horário de Início</th>
                    <th>Horário de Fim</th>
                    <th>Status</th>
                    <th>Cancelar</th>
                </tr>
            </thead>
            `;
        }
    }
    carregarAgendamentos(paginaAtual);
}


async function carregarAgendamentos(pagina) {
    if (pagina < 0 || (totalPaginas > 0 && pagina >= totalPaginas)) return; // Limita as páginas

    const resposta = await fetch(`http://localhost:8080/agendamento/historico/${id}?page=${pagina}&tempo=${tempo}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    } else if (resposta.status == 204) {
        const tabela = document.getElementById("tabela_agendamento");
        tabela.innerHTML = 'Não há agendamentos registrados';
        return;
    }

    const dados = await resposta.json();

    if (!dados || dados.content.length === 0) {
        throw new Error('Dados não encontrados');
    }

    totalPaginas = dados.totalPages;

    limparTabela();
    preencherTabela(dados.content);
    atualizarBotoesPaginacao(dados.totalPages, dados.pageable.pageNumber);
}

function limparTabela() {
    const tabela = document.getElementById("tabela_agendamento");
    const tbody = tabela.getElementsByTagName('tbody')[0];

    if (tbody) {
        tabela.removeChild(tbody);
    }
}

function preencherTabela(dados) {
    const resultados = dados.map((agendamento) => `
        <tr>
            <td ${nivel_acesso_cod == "1" ? 'style="display: none;"' : ''}>${agendamento.nome_Aluno}</td>
            <td>${agendamento.assunto}</td>
            <td>${agendamento.nome_Professor}</td>
            <td>${formatarData(agendamento.data)}</td>
            <td>${formatarHorario(agendamento.horario_Inicio)}</td>
            <td>${formatarHorario(agendamento.horario_Fim)}</td>
            <td>${buscaUltimoStatus(buscaUltimoStatus(agendamento.status_List))}</td>
            <td>
            ${tempo === "passado"
            ? `<span onclick="buscarDetalhes(${agendamento.id})" style="background-color: #072B59; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; display: block; width: fit-content; margin: 0 auto;">Detalhes</span>`
            : `
                <div class="editar-lapis" id="editar_${agendamento.id}" onclick="buscarDetalhes(${agendamento.id})">
                    <img src="../imgs/pen.png" alt="icone_editar">
                </div>
                `}
            </td>
        </tr>
    `).join('');

    const tabela = document.getElementById("tabela_agendamento");
    tabela.innerHTML += `<tbody>${resultados}</tbody>`;
}

function preencherTabelaHistorico(dados) {
    const resultados = dados.map((agendamento) => `
        <tr>
            <td ${nivel_acesso_cod == "1" ? 'style="display: none;"' : ''}>${agendamento.aluno.nomeCompleto}</td>
            <td>${agendamento.assunto}</td>
            <td>${agendamento.professor.nomeCompleto}</td>
            <td>${formatarData(agendamento.data)}</td>
            <td>${formatarHorario(agendamento.horarioInicio)}</td>
            <td>${formatarHorario(agendamento.horarioFim)}</td>
            <td>${agendamento.status}</td>
            <td>
            ${tempo === "passado"
            ? `<span onclick="buscarDetalhes(${agendamento.id})" style="background-color: #072B59; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; display: block; width: fit-content; margin: 0 auto;">Detalhes</span>`
            : `
                <div class="editar-lapis" id="editar_${agendamento.id}" onclick="buscarDetalhes(${agendamento.id})">
                    <img src="../imgs/pen.png" alt="icone_editar">
                </div>
                `}
            </td>
        </tr>
    `).join('');

    const tabela = document.getElementById("tabela_agendamento");
    tabela.innerHTML += `<tbody>${resultados}</tbody>`;
}


async function buscarDetalhes(id) {
    const respostaAgendamento = await fetch(`http://localhost:8080/agendamento/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!respostaAgendamento.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dadosAgendamentos = await respostaAgendamento.json();

    const respostaHistorico = await fetch(`http://localhost:8080/historico-agendamento/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!respostaHistorico.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dadosHistorico = await respostaHistorico.json();

    Swal.fire({
        title: '<h2 style="color: #072B59; font-weight: bolder;">Detalhes do agendamento</h2>',
        html: `
      <div style="text-align: left; color: #072B59;">
        <p><strong>Nome do aluno:</strong> ${dadosAgendamentos.aluno.nomeCompleto} <br />
        <p><strong>Professor:</strong> ${dadosAgendamentos.professor.nomeCompleto} <br />
        <p><strong>Assunto:</strong> ${dadosAgendamentos.assunto} <br />
        <p><strong>Data:</strong> ${formatarData(dadosAgendamentos.data)} <br />
        <p><strong>Horário de Início:</strong> ${formatarHorario(dadosAgendamentos.horarioInicio)} <br />
        <p><strong>Horário de fim:</strong> ${formatarHorario(dadosAgendamentos.horarioFim)} <br />
        
        <div style="margin: 20px 0;">
      <div style="display: flex; align-items: center;">
        
        <!-- Bolinha que muda de cor conforme o status -->
        <div style="height: 15px; width: 15px; border-radius: 50%; background-color: ${dadosAgendamentos.status === 'CONFIRMADO' ? 'green' :
                dadosAgendamentos.status === 'PENDENTE' ? 'yellow' :
                    dadosAgendamentos.status === 'CONCLUIDO' ? 'green' :
                        'red'
            };"></div>

        <!-- Barra de progresso que muda cor e largura conforme o status -->
        <div style="flex: 1; height: 4px; background-color: lightgray; margin: 0 10px;">
          <div style="width: ${dadosAgendamentos.status === 'CONFIRMADO' ? '70%' :
                dadosAgendamentos.status === 'PENDENTE' ? '50%' :
                    '100%'
            }; height: 100%; background-color: ${dadosAgendamentos.status === 'CONFIRMADO' ? 'green' :
                dadosAgendamentos.status === 'PENDENTE' ? 'yellow' :
                    dadosAgendamentos.status === 'CONCLUIDO' ? 'green' :
                        'red'
            };"></div>
        </div>
        
        <!-- Exibição do nome do status -->
        <span>${tratarNome(dadosAgendamentos.status)}</span>

      </div>
    </div>
    `,
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#072B59',
        showCancelButton: tempo !== 'passado' && nivel_acesso_cod !== 1, // Mostra o botão "Editar Status" apenas se o nivel_acesso_cod for diferente de 1
        cancelButtonText: 'Editar Status',
        cancelButtonColor: '#830f0f',
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel && tempo !== 'passado') {
            Swal.fire({
                title: '<h2 style="color: #072B59; font-weight: bolder;">Editar Status</h2>',
                html: `
              <label for="novoStatus" style="color: #072B59; position: relative; top: 0.1vh;">Selecione o novo status:</label>
              <select id="novoStatus" class="swal2-input" style="width: 10vw;height: 4vh;color: #072B59;border-radius: 5px;border: 1px solid #072B5">
              <option value="#">Selecione</option>
                <option value="1" ${nivel_acesso_cod == "1" ? 'style="display: none;"' : ''}>Pendente</option>
                <option value="2" ${nivel_acesso_cod == "1" ? 'style="display: none;"' : ''}>Confirmar</option>
                <option value="3" ${nivel_acesso_cod == "1" ? 'style="display: none;"' : ''}>Concluir</option>
                <option value="4">Cancelar</option>
              </select>
            `,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Salvar',
                confirmButtonColor: '#072B59',
                cancelButtonColor: '#830f0f',
                preConfirm: () => {
                    const novoStatus = document.getElementById('novoStatus').value;
                    return novoStatus;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        novoStatus(id, result.value);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        } else {
            return
        }
    });
}

async function filtraAgendamentos() {

    const data_inicio = document.getElementById("data_inicio").value;
    const data_fim = document.getElementById("data_fim").value;
    const horario_inicio = document.getElementById("horario_inicio").value;
    const horario_fim = document.getElementById("horario_fim").value;
    const assunto = document.getElementById("assunto").value;

    const data = {};
    if (data_inicio) data.data_inicio = data_inicio;
    if (data_fim && data_fim !== "") data.data_fim = data_fim;
    if (horario_inicio && horario_inicio !== "") data.horario_inicio = horario_inicio
    if (horario_fim && horario_fim !== "") data.horario_fim = horario_fim
    if (assunto && assunto !== "") data.assunto = assunto;

    
    console.log("Filtro a ser buscado")
    console.log(data)

    var tipoNome = ""

    if (nivel_acesso != "aluno") {
        tipoNome = "professor"    
    } else {
        tipoNome = "aluno"
    }

    const resposta = await fetch(`http://localhost:8080/agendamento/filtro/${tempo}/${tipoNome}/${sessionStorage.getItem('id')}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });


    if (resposta.status == 204) {
        return
    }

    const listaAgendamentos = await resposta.json();
    
    console.log("Resposta do filtro: ")
    console.log(listaAgendamentos)
    preencherTabelaHistorico(listaAgendamentos)
    limparTabela();
}


function atualizarBotoesPaginacao(total, atual) {
    const paginacao = document.getElementById('paginacao_tabela');
    paginacao.innerHTML = '';

    const anterior = document.createElement('li');
    anterior.classList.add('page-item');
    anterior.innerHTML = `<a class="page-link" href="#" onclick="carregarAgendamentos(${atual - 1})">&laquo;</a>`;
    paginacao.appendChild(anterior);

    for (let i = 0; i < total; i++) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (i === atual) {
            item.classList.add('active'); // Marca a página atual
        }
        item.innerHTML = `<a class="page-link" href="#" onclick="carregarAgendamentos(${i})">${i + 1}</a>`;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    proximo.innerHTML = `<a class="page-link" href="#" onclick="carregarAgendamentos(${atual + 1})">&raquo;</a>`;
    paginacao.appendChild(proximo);
}

async function novoStatus(id, statusId) {
    try {
        const respostaAgendamento = await fetch(`http://localhost:8080/agendamento/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        agendamento = await respostaAgendamento.json()

        const respostaStatus = await fetch(`http://localhost:8080/status/${statusId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        statusObj = await respostaStatus.json()

        const dadosAlteracao = {
            "novoAgendamento": agendamento,
            "status": statusObj
        }

        const novoStatus = await fetch("http://localhost:8080/historico-agendamento", {
            method: "POST",
            body: JSON.stringify(dadosAlteracao),
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        console.log(novoStatus.status)
    } catch (error) {
        console.log(error)
    }
}

window.onload = function () {
    carregarHeadersTabela();
};

const style = document.createElement('style');
style.innerHTML = `
  .custom-confirm-button {
    background-color: #072B59;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
  }

  .custom-cancel-button {
    background-color: #072B59;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
  }
`;
