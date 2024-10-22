var paginaAtual = 0;
var totalPaginas = 0;
const nivelAcesso = Number(sessionStorage.getItem('nivel_acesso_cod'));

async function buscarAlunos(paginaAtual) {
    if (paginaAtual < 0 || (totalPaginas > 0 && paginaAtual >= totalPaginas)) return; // Limita as páginas

    const cardsAlunos = document.getElementById("listagem_usuarios");

    const resposta = await fetch(`http://localhost:8080/usuarios/aluno/paginado?page=${paginaAtual}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        cardsAlunos.innerHTML += "<span>Não há alunos cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=aluno'>aqui</a>";
        return;
    }

    const listaAlunos = await resposta.json();

    cardsAlunos.innerHTML = "";
    cardsAlunos.innerHTML += listaAlunos.content.map((aluno) => {
        const alunoId = aluno.id; // ID do aluno para garantir unicidade

        return `
        <div class="dados-student" id="card_dados_${alunoId}">
            <div class="header-student">
                <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
                <p>${aluno.nome_completo}</p>
            </div>
            <br/><br/>
            <div class="form-student">
                <div class="personal-information">
                    <div class="form-group">
                        <label for="cpf_${alunoId}">CPF:</label>
                        <label class="label2" type="text" id="cpf_${alunoId}">${aluno.cpf}</label>
                    </div>
                    <div class="form-group">
                        <label for="data-nascimento_${alunoId}">Data de Nascimento:</label>
                        <label class="label2" type="date" id="data-nascimento_${alunoId}">${formatarData(aluno.data_nascimento)}</label>
                    </div>
                    <div class="form-group">
                        <label for="email_${alunoId}">E-mail:</label>
                        <label class="label2" type="email" id="email_${alunoId}">${aluno.email}</label>
                    </div>
                    <div class="form-group">
                        <label for="telefone_${alunoId}">Telefone:</label>
                        <label class="label2" type="text" id="telefone_${alunoId}">${formatarCelular(aluno.telefone)}</label>
                    </div>
                    <div class="form-group">
                        <label for="nivel-ingles_${alunoId}">Nível de Inglês:</label>
                        <label class="label2" type="text" id="nivel-ingles_${alunoId}">${aluno.niveis_Ingles}</label>
                    </div>
                    <div class="form-group">
                        <label for="nicho_${alunoId}">Nicho:</label>
                        <label class="label2" type="text" id="nicho_${alunoId}">${aluno.nichos}</label>
                    </div>
                </div>
            </div>
            
            <div class="lapis">
                <img src="../imgs/pen.png" alt="Editar aluno" style="width: 3vw; height: 6vh" onclick="editarAluno(${alunoId})">
            </div>
            ${nivelAcesso === 3 ? `
                <div class="lixeira">
                    <img src="../imgs/trash-bin.png" alt="Excluir aluno" style="width: 3vw; height: 6vh" onclick="confirmacaoDeleteAluno(${alunoId})">
                </div>
            ` : ''}
        </div>
        <hr class="line">
        `;
    }).join('');

    atualizarBotoesPaginacaoAluno(listaAlunos.totalPages, listaAlunos.pageable.pageNumber);

    // Esconde o GIF de carregamento
    const loadingGif = document.getElementById('loading');
    loadingGif.style.display = 'none';
}

async function filtraUsuarios() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const tipoNome = (tipo !== "aluno") ? "professor" : "aluno";

    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const nicho = document.getElementById("nicho").value;
    const nivel = document.getElementById("nivel").value;

    const data = {};
    if (nome) data.nome = nome;
    if (cpf) data.cpf = cpf;
    if (nicho && nicho !== "") data.nicho = nicho;
    if (nivel && nivel !== "") data.nivelIngles = nivel;

    console.log("Filtro a ser buscado:", data);

    const cardsUsuarios = document.getElementById("listagem_usuarios");

    try {
        // Faz a requisição para o filtro
        const resposta = await fetch(`http://localhost:8080/usuarios/filtro/${tipoNome}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (resposta.status === 204) {
            cardsUsuarios.innerHTML = `<span>Não há ${tipoNome}s cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=${tipoNome}'>aqui</a>`;
            return;
        }

        const listaUsuarios = await resposta.json();

        cardsUsuarios.innerHTML = listaUsuarios.map((aluno) => {
            const alunoId = aluno.id;
            return `
            <div class="dados-student" id="card_dados_${alunoId}">
                <div class="header-student">
                    <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
                    <p>${aluno.nomeCompleto}</p>
                </div>
                <br/> <br/>
                <div class="form-student">
                    <div class="personal-information">
                        <div class="form-group">
                            <label for="cpf_${alunoId}">CPF:</label>
                            <label class="label2" type="text" id="cpf_${alunoId}">${aluno.cpf}</label>
                        </div>
                        <div class="form-group">
                            <label for="data-nascimento_${alunoId}">Data de Nascimento:</label>
                            <label class="label2" type="date" id="data-nascimento_${alunoId}">${formatarData(aluno.dataNasc)}</label>
                        </div>
                        <div class="form-group">
                            <label for="email_${alunoId}">E-mail:</label>
                            <label class="label2" type="email" id="email_${alunoId}">${aluno.email}</label>
                        </div>
                        <div class="form-group">
                            <label for="telefone_${alunoId}">Telefone:</label>
                            <label class="label2" type="text" id="telefone_${alunoId}">${formatarCelular(aluno.telefone)}</label>
                        </div>
                        <div class="form-group">
                            <label for="nivel-ingles_${alunoId}">Nível de Inglês:</label>
                            <label class="label2" type="text" id="nivel-ingles_${alunoId}">${aluno.nivelIngles}</label>
                        </div>
                        <div class="form-group">
                            <label for="nicho_${alunoId}">Nicho:</label>
                            <label class="label2" type="text" id="nicho_${alunoId}">${aluno.nicho}</label>
                        </div>
                    </div>
                </div>
                
                <div class="lixeira" onclick="confirmacaoDeleteAluno(${alunoId})">
                    <img src="../imgs/trash-bin.png" alt="Excluir aluno" style="width: 3vw; height: 6vh">
                </div>
            </div>
            <hr class="line">
            `;
        }).join('');

    } catch (error) {
        console.error("Erro ao filtrar usuários:", error);
        cardsUsuarios.innerHTML = `<span>Ocorreu um erro ao buscar os usuários. Por favor, tente novamente mais tarde.</span>`;
    }
}


function confirmacaoDeleteAluno(id) {
    Swal.fire({
        title: "Deseja excluir esse aluno?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        confirmButtonColor: 'green',
        cancelButtonColor: '#aaa',
        background: '#f2f2f2',
        color: '#333'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                deletarAluno(id);
            } catch (e) {
                console.log(e);
            }
        } else {
            return
        }
    });
}

function editarAluno(id) {
    const input = document.getElementById(`nivel-ingles_${id}`);
    if (input) {
        input.removeAttribute("readonly"); 
        input.focus(); 
    }
}

async function deletarAluno(id) {
    const respostaDelete = await fetch(`http://localhost:8080/usuarios/aluno/${id}`, {
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

function atualizarBotoesPaginacaoAluno(total, atual) {
    const paginacao = document.getElementById('paginacao_visualizacao');
    paginacao.innerHTML = '';

    const anterior = document.createElement('li');
    anterior.classList.add('page-item');
    anterior.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${atual - 1})">&laquo;</a>`;
    paginacao.appendChild(anterior);

    for (let i = 0; i < total; i++) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (i === atual) {
            item.classList.add('active'); // Marca a página atual
        }
        item.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${i})">${i + 1}</a>`;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    proximo.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${atual + 1})">&raquo;</a>`;
    paginacao.appendChild(proximo);
}