const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function buscarProfessor() {
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

    console.log(listaProfessors.content)

    cardsProfessor.innerHTML += listaProfessors.content.map((professor) => {
        return `
      <div class="dados-student" id="card_dados">
    <div class="header-student">
        <img src="../imgs/perfil_blue.png" alt="Foto do professor">
        <p>${professor.nome_completo}</p>
    </div>
        
    <div class="form-student">
        <div class="personal-information">
            <div class="form-group">
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" value="${professor.cpf}" readonly>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <input type="date" id="data-nascimento" value="${professor.data_nascimento}" readonly>
            </div>
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" value="${professor.email}" readonly>
            </div>
            <div class="form-group">
                <label for="telefone">Telefone:</label>
                <input type="text" id="telefone" value="${professor.telefone}" readonly>
            </div>
        </div>

        <div class="course-information">
            <div class="form-group">
                <label for="nivel-ingles">Nível de Inglês:</label>
                <input type="text" id="nivel-ingles" value="${professor.niveis_Ingles}" readonly>
            </div>
            <div class="form-group">
                <label for="nicho">Nicho:</label>
                <input type="text" id="nicho" value="${tratarNome(professor.nichos) || ''}" readonly>
            </div>
            <div class="form-group">
                <label for="nicho">Horário de trabalho:</label>
                ${formatarHorario(professor.inicio || '')} às ${formatarHorario(professor.fim || '')}
            </div>
            <div class="form-group">
                <label for="nicho">Horário de intervalo:</label>
                ${formatarHorario(professor.pausa_inicio || '')} às ${formatarHorario(professor.pausa_fim || '')}
            </div>
        </div>
    </div>

    <div class="lixeira" onclick="confirmacaoDeleteProfessor(${professor.id})">
        <img src="../imgs/trash-bin.png" alt="Excluir professor">
    </div>
</div>
<hr class="line">`
    }).join('');
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



    console.log(respostaDelete);

    if (respostaDelete.status == 204) {
        window.location.reload()
        Swal.fire({ title: "Excluído com sucesso!", icon: "success", confirmButtonColor: 'green' });
    } else {
        console.log("erro no delete")
    }
}