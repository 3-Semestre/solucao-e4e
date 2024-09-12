const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function buscarProfessor() {
    const cardsProfessor = document.getElementById("listagem")

    const resposta = await fetch("http://localhost:8080/usuarios/professor", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        cardsProfessor.innerHTML += "<span>Não há alunos cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=professor'>aqui</a>"
        return
    }
    const listaProfessors = await resposta.json();

    cardsProfessor.innerHTML += listaProfessors.map((Professor) => {
        return `
      <div class="dados-student" id="card_dados">
                <div class="photo-student">
                    <img src="../imgs/perfil_blue.png" alt="">
                    <p>${Professor.nomeCompleto}</p>
                </div>
                <div class="lixeira" onclick="confirmacaoDeleteProfessor(${Professor.id})" id="lixeira_${Professor.id}">
                    <img src="../imgs/trash-bin.png" alt="icone_lixeira" onclick="excluirProfessor()">
                </div>
            </div>
            <hr class="line">
    `
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