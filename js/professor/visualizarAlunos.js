async function buscarAlunos() {
    const resposta = await fetch("http://localhost:8080/usuarios/aluno", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    const listaAlunos = await resposta.json();

    cardsAlunos = document.getElementById("listagem")

    cardsAlunos.innerHTML += listaAlunos.map((aluno) => {
        return `
      <div class="dados-student" id="card_dados">
                <div class="photo-student">
                    <img src="../imgs/perfil_blue.png" alt="">
                    <p>${aluno.nomeCompleto}</p>
                </div>
                <div class="lixeira" onclick="confirmacaoDeleteAluno(${aluno.id})" id="lixeira_${aluno.id}">
                    <img src="../imgs/trash-bin.png" alt="icone_lixeira" onclick="excluirALuno()">
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
            try{
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


    
    console.log(respostaDelete);

    if (respostaDelete.status == 204) {
        window.location.reload()
        Swal.fire({ title: "Excluído com sucesso!", icon: "success", confirmButtonColor: 'green' });
    } else {
        console.log("erro no delete")
    }
}