const id = sessionStorage.getItem('id');
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod');
const token = sessionStorage.getItem('token');

let paginaAtual = 0;
let totalPaginas = 0;
const urlParams = new URLSearchParams(window.location.search);
const tempo = urlParams.get('tipo');

function carregarHeadersTabela() {
    const tabela = document.getElementById("tabela_agendamento");
    if (Number(nivel_acesso_cod) != 1) {
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
            } else {
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
            <td ${nivel_acesso_cod != "3" ? 'style="display: none;"' : ''}>${agendamento.nome_Aluno}</td>
            <td>${agendamento.assunto}</td>
            <td>${agendamento.nome_Professor}</td>
            <td>${formatarData(agendamento.data)}</td>
            <td>${formatarHorario(agendamento.horario_Inicio)}</td>
            <td>${formatarHorario(agendamento.horario_Fim)}</td>
            <td>${buscaUltimoStatus(buscaUltimoStatus(agendamento.status_List))}</td>
            <td>
            ${tempo === "passado"
            ? `<span onclick="buscarDetalhes(${agendamento.id})">Visualizar Detalhes</span>`
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
        title: 'Detalhes do agendamento',
        html: `
          <div style="text-align: left;">
            <p><strong>Nome do aluno:</strong> ${dadosAgendamentos.aluno.nomeCompleto} <br />
            <p><strong>Professor:</strong> ${dadosAgendamentos.professor.nomeCompleto} <br />
            <p><strong>Assunto:</strong> ${dadosAgendamentos.assunto} <br />
            <p><strong>Data:</strong> ${formatarData(dadosAgendamentos.data)} <br />
            <p><strong>Horário de Início:</strong> ${formatarHorario(dadosAgendamentos.horarioInicio)} <br />
            <p><strong>Horário de fim:</strong> ${formatarHorario(dadosAgendamentos.horarioFim)} <br />
        
            <div style="margin: 20px 0;">
              <div style="display: flex; align-items: center;">
                <div style="height: 15px; width: 15px; background-color: green; border-radius: 50%;"></div>
                <div style="flex: 1; height: 4px; background-color: lightgray; margin: 0 10px;">
                  <div style="width: 50%; height: 100%; background-color: green;"></div>
                </div>
                <span>${dadosHistorico[0].status.descricao}</span>
              </div>
            </div>
        `,
        confirmButtonText: 'Fechar',
        showCancelButton: tempo !== 'passado',
        cancelButtonText: 'Editar Status',
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel && tempo !== 'passado') {
            Swal.fire({
                title: 'Editar Status',
                html: `
              <label for="novoStatus" style="color: black">Selecione o novo status:</label>
              <select id="novoStatus" class="swal2-input">
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            `,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Salvar',
                preConfirm: () => {
                    const novoStatus = document.getElementById('novoStatus').value;
                    return novoStatus;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const statusSelecionado = result.value;
                    console.log(`Novo status selecionado: ${statusSelecionado}`);
                }
            });
        }
    });
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

window.onload = function () {
    carregarHeadersTabela();
};

