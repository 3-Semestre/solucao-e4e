const id = sessionStorage.getItem('id');
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod');
const token = sessionStorage.getItem('token');

let paginaAtual = 0;
let totalPaginas = 0;

function carregarHeadersTabela() {
    const tabela = document.getElementById("tabela_agendamento");
    switch (nivel_acesso_cod) {
        case "3":
            tabela.innerHTML = `  <!-- Limpei o conteúdo da tabela -->
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
            break;
        case "2":
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
            break;
        case "1":
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
            break;
    }
    carregarAgendamentos(paginaAtual);
}

async function carregarAgendamentos(pagina) {
    if (pagina < 0 || (totalPaginas > 0 && pagina >= totalPaginas)) return; // Limita as páginas

    const resposta = await fetch(`http://localhost:8080/agendamento/${nivel_acesso_cod}/${id}?page=${pagina}`, {
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

    console.log(dados);

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
            <td ${nivel_acesso_cod != "3" ? 'style="display: none;"' : ''}>${agendamento.aluno ? agendamento.aluno.nomeCompleto : ''}</td>
            <td>${agendamento.assunto}</td>
            <td>${agendamento.professor ? agendamento.professor.nomeCompleto : ''}</td>
            <td>${formatarData(agendamento.data)}</td>
            <td>${formatarHorario(agendamento.horarioInicio)}</td>
            <td>${formatarHorario(agendamento.horarioFim)}</td>
            <td>${Array.from(agendamento.status)[0] + agendamento.status.slice(1).toLocaleLowerCase()}</td>
            <td>
            <div class="editar-lapis" id="editar_${agendamento.id}" onclick="teste(${agendamento.id})">
                    <img src="../imgs/pen.png" alt="icone_editar">
                </div>
            </td>
        </tr>
    `).join('');

    const tabela = document.getElementById("tabela_agendamento");
    tabela.innerHTML += `<tbody>${resultados}</tbody>`;
}

function teste(id){
    Swal.fire({
        title: 'Detalhes do agendamento',
        html: `<p>${id}This is a custom HTML content with <b>bold</b> text and <a href="#">a link</a>.</p>`,
        // icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
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
