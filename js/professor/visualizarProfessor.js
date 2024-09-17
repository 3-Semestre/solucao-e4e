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
                <label class="label2" type="text" id="cpf"> ${professor.cpf} </label>
            </div>
            <div class="form-group">
                <label for="data-nascimento">Data de Nascimento:</label>
                <label class="label2" type="date" id="data-nascimento"> ${professor.data_nascimento} </label>
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