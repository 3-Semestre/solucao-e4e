var paginaAtual = 0;
var totalPaginas = 0;

const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function buscarProfessor(paginaAtual) {
    if (paginaAtual < 0 || (totalPaginas > 0 && paginaAtual >= totalPaginas)) return; // Limita as páginas

    const cardsProfessor = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/usuarios/professor/paginado?page=${paginaAtual}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        cardsProfessor.innerHTML += "<span>Não há professores cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=professor'>aqui</a>"
        return
    }

    const listaProfessors = await resposta.json();

    cardsProfessor.innerHTML = "";
    cardsProfessor.innerHTML += listaProfessors.content.map((professor) => {
        return `
      <div class="dados-student" id="card_dados">
    <div class="header-student">
        <img src="../imgs/perfil_blue.png" alt="Foto do professor">
        <p>${professor.nome_completo}</p>
    </div>
    <br/>
    <br/>
    <div class="form-student">
        <div class="personal-information">
            <div class="form-group">
                <label for="cpf">CPF:</label>
                <label class="label2" type="text" id="cpf"> ${professor.cpf} </label>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <label class="label2" type="date" id="data-nascimento"> ${formatarData(professor.data_nascimento)} </label>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <label class="label2" type="email" id="email"> ${professor.email} </label>
            </div>
            <div class="form-group">
                <label for="telefone">Telefone:</label>
                <label class="label2" type="text" id="telefone"> ${formatarCelular(professor.telefone)} </label>
            </div>
        </div>

        <div class="course-information">
            <div class="form-group">
                <label for="nivel-ingles">Nível de Inglês:</label>
                <label class="label2" type="text" id="nivel-ingles"> ${professor.niveis_Ingles} </label>
            </div>
            <div class="form-group">
                <label for="nicho">Nicho:</label>
                <label class="label2" type="text" id="nicho"> ${tratarNome(professor.nichos) || ''} </label>
            </div>
            <div class="form-group">
                <label for="nicho">Horário de trabalho:</label>
                <label class="label2" type="text">${formatarHorario(professor.inicio || '')} às ${formatarHorario(professor.fim || '')} </label>
            </div>
            <div class="form-group">
                <label for="nicho">Horário de intervalo:</label>
                <label class="label2" type="text">${formatarHorario(professor.pausa_inicio || '')} às ${formatarHorario(professor.pausa_fim || '')} </label>
            </div>
        </div>
    </div>

    <div class="lixeira" onclick="confirmacaoDeleteProfessor(${professor.id})">
        <img src="../imgs/trash-bin.png" alt="Excluir professor">
    </div>
</div>
<hr class="line">`
    }).join('');

    atualizarBotoesPaginacaoProfessor(listaProfessors.totalPages, listaProfessors.pageable.pageNumber)

    const loadingGif = document.getElementById('loading');
    const tabela = document.getElementById("tabela_agendamento");
    const tempoMinimoCarregamento = 700; // 1 segundo (1000 ms) de tempo mínimo de carregamento

    // Mostrar o GIF de carregamento
    loadingGif.style.display = 'block';

    // Função para simular o tempo de carregamento mínimo
    const esperarMinimoCarregamento = new Promise(resolve => setTimeout(resolve, tempoMinimoCarregamento));

    try {
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
    } catch (error) {
        console.error(error.message);
        tabela.innerHTML = 'Erro ao carregar agendamentos';
    } finally {
        // Garantir que o tempo mínimo de carregamento foi respeitado antes de esconder o GIF
        await Promise.all([esperarMinimoCarregamento]);

        // Esconder o GIF de carregamento
        loadingGif.style.display = 'none';
    }

}



function confirmacaoDeleteProfessor(id) {
    Swal.fire({
        title: "Deseja excluir esse Professor?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sim",
        denyButtonText: `Não`,
        cancelButtonText: "Cancelar",
        confirmButtonColor: 'green',
        denyButtonColor: '#870000',
        cancelButtonColor: '#aaa',
        background: '#f2f2f2',
        color: '#333'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                deletarProfessor(id)
            } catch (e) {
                console.log(e)
            }
        } else if (result.isDenied) {
            Swal.fire({ title: "As alterações não foram salvas", icon: "info", confirmButtonColor: 'green' });
        }
    });
}



async function deletarProfessor(id) {

    const respostaDelete = await fetch(`http://localhost:8080/usuarios/Professor/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaDelete.status == 204) {
        Swal.fire({ title: "Excluído com sucesso!", icon: "success", confirmButtonColor: 'green' });
        setTimeout(() => window.location.reload(), 2500);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 2000
        });
    }
}

function atualizarBotoesPaginacaoProfessor(total, atual) {
    const paginacao = document.getElementById('paginacao_visualizacao');
    paginacao.innerHTML = '';

    const anterior = document.createElement('li');
    anterior.classList.add('page-item');
    anterior.innerHTML = `<a class="page-link" href="#" onclick="buscarProfessor(${atual - 1})">&laquo;</a>`;
    paginacao.appendChild(anterior);

    for (let i = 0; i < total; i++) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (i === atual) {
            item.classList.add('active'); // Marca a página atual
        }
        item.innerHTML = `<a class="page-link" href="#" onclick="buscarProfessor(${i})">${i + 1}</a>`;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    proximo.innerHTML = `<a class="page-link" href="#" onclick="buscarProfessor(${atual + 1})">&raquo;</a>`;
    paginacao.appendChild(proximo);
}