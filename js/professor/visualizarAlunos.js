var paginaAtual = 0;
var totalPaginas = 0;

async function buscarAlunos(pagina) {
    if (pagina < 0 || (totalPaginas > 0 && pagina >= totalPaginas)) return; // Limita as páginas

    const cardsAlunos = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/usuarios/aluno/paginado?page=${pagina}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        cardsAlunos.innerHTML += "<span>Não há alunos cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=aluno'>aqui</a>"
        return
    }

    const listaAlunos = await resposta.json();

    cardsAlunos.innerHTML = "";
    cardsAlunos.innerHTML += listaAlunos.content.map((aluno) => {
        return `
<div class="dados-student" id="card_dados">
    <div class="header-student">
        <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
        <p>${aluno.nome_completo}</p>
    </div>
        <br/> <br/>
    <div class="form-student">
        <div class="personal-information">
            <div class="form-group">
                <label for="cpf">CPF:</label>
                <label class="label2" type="text" id="cpf">${aluno.cpf}</label>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <label class="label2" type="date" id="data-nascimento">${formatarData(aluno.data_nascimento)}</label>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <label class="label2" type="email" id="email">${aluno.email}</label>
            </div>
            <div class="form-group">
                <label for="telefone">Telefone:</label>
                <label class="label2" type="text" id="telefone">${formatarCelular(aluno.telefone)}</label>
            </div>
            <div class="form-group">
                <label for="nivel-ingles">Nível de Inglês:</label>
                <label class="label2" type="text" id="nivel-ingles">${aluno.niveis_Ingles}</label>
            </div>
            <div class="form-group">
                <label for="nicho">Nicho:</label>
                <label class="label2" type="text" id="nicho">${aluno.nichos}</label>
            </div>
        </div>

        <div class="course-information">
            
        </div>
    </div>

    <div class="lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})">
        <img src="../imgs/trash-bin.png" alt="Excluir aluno"  style="width: 3vw; height: 6vh">
    </div>
</div>
<hr class="line">
`}).join('');

atualizarBotoesPaginacaoAluno(listaAlunos.totalPages, listaAlunos.pageable.pageNumber)
}

async function filtraUsuarios() {
    const urlParams = new URLSearchParams(window.location.search);

    const tipo = urlParams.get('tipo');

    var tipoNome = ""

    if (tipo != "aluno") {
        tipoNome = "professor"
    } else {
        tipoNome = "aluno"
    }


    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;

    const nicho = document.getElementById("nicho").value;
    const nivel = document.getElementById("nivel").value;


    const data = {};
    if (nome) data.nome = nome;
    if (cpf) data.cpf = cpf;
    if (nicho && nicho !== "") data.nicho = nicho;
    if (nivel && nivel !== "") data.nivelIngles = nivel;

    console.log("Filtro a ser buscado")
    console.log(data)

    const cardsUsuarios = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/usuarios/filtro/${tipoNome}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (resposta.status == 204) {
        cardsAlunos.innerHTML += `<span>Não há ${tipoNome} cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=aluno'>aqui</a>`
        return
    }

    const listaUsuarios = await resposta.json();

    console.log(listaUsuarios)
    cardsUsuarios.innerHTML = listaUsuarios.map((aluno) => {
        return `
<div class="dados-student" id="card_dados">
    <div class="header-student">
        <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
        <p>${aluno.nomeCompleto}</p>
    </div>
        <br/> <br/>
    <div class="form-student">
        <div class="personal-information">
            <div class="form-group">
                <label for="cpf">CPF:</label>
                <label class="label2" type="text" id="cpf">${aluno.cpf}</label>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <label class="label2" type="date" id="data-nascimento">${aluno.dataNascimento}</label>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <label class="label2" type="email" id="email">${aluno.email}</label>
            </div>
            <div class="form-group">
                <label for="telefone">Telefone:</label>
                <label class="label2" type="text" id="telefone">${formatarCelular(aluno.telefone)}</label>
            </div>
            <div class="form-group">
                <label for="nivel-ingles">Nível de Inglês:</label>
                <label class="label2" type="text" id="nivel-ingles">${aluno.nicho.map((nicho) => {return nicho.nicho.nome})}</label>
            </div>
            <div class="form-group">
                <label for="nicho">Nicho:</label>
                <label class="label2" type="text" id="nicho">${aluno.nivelIngles.map((nivel) => {return nivel.nivelIngles.nome})}</label>
            </div>
        </div>

        <div class="course-information">
            
        </div>
    </div>

    <div class="lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})">
        <img src="../imgs/trash-bin.png" alt="Excluir aluno"  style="width: 3vw; height: 6vh">
    </div>
</div>
<hr class="line">
`
    }).join('');
}

function confirmacaoDeleteAluno(id) {
    Swal.fire({
        title: "Deseja excluir esse aluno?",
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
                deletarAluno(id)
            } catch (e) {
                console.log(e)
            }
        } else if (result.isDenied) {
            Swal.fire({ title: "As alterações não foram salvas", icon: "info", confirmButtonColor: 'green' });
        }
    });
}

async function deletarAluno(id) {
    const respostaDelete = await fetch(`http://localhost:8080/usuarios/aluno/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaDelete.status == 204) {
        Swal.fire({ title: "Excluído com sucesso!", icon: "success", confirmButtonColor: 'green' });
        setTimeout(window.location.reload(), 2000);
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