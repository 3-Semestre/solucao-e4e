let paginaAtual = 0;
let totalPaginas = 0;

async function buscarAlunos() {
    const cardsAlunos = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/usuarios/aluno/paginado?page=${paginaAtual}`, {
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
    console.log(listaAlunos.content)

    cardsAlunos.innerHTML += listaAlunos.content.map((aluno) => {
        return `
<div class="dados-student" id="card_dados">
    <div class="header-student">
        <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
        <p>${aluno.nome_completo}</p>
    </div>
        
    <div class="form-student">
        <div class="personal-information">
            <div class="form-group">
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" value="${aluno.cpf}" readonly>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <input type="date" id="data-nascimento" value="${aluno.data_nascimento}" readonly>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" value="${aluno.email}" readonly>
            </div>
            <div class="form-group">
                <label for="telefone">Telefone:</label>
                <input type="text" id="telefone" value="${formatarCelular(aluno.telefone)}" readonly>
            </div>
        </div>

        <div class="course-information">
            <div class="form-group">
                <label for="nivel-ingles">Nível de Inglês:</label>
                <input type="text" id="nivel-ingles" value="${aluno.niveis_Ingles}" readonly>
            </div>
            <div class="form-group">
                <label for="nicho">Nicho:</label>
                <input type="text" id="nicho" value="${aluno.nichos}" readonly>
            </div>
        </div>
    </div>

    <div class="lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})">
        <img src="../imgs/trash-bin.png" alt="Excluir aluno">
    </div>
</div>
<hr class="line">
`}).join('');
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

    cardsUsuarios.innerHTML = listaUsuarios.map((aluno) => {
        return `
      <div class="dados-student" id="card_dados">
                <div class="photo-student">
                    <img src="../imgs/perfil_blue.png" alt="">
                    <p>${aluno.nomeCompleto}</p>
                </div>
                <div class="lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})" id="lixeira_${aluno.id}">
                    <img src="../imgs/trash-bin.png" alt="icone_lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})">
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
            title: 'Erro ao cadastrar',
            showConfirmButton: false,
            text: 'Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 1500
        });
    }
}