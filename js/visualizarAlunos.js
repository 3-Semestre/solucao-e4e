async function buscarAlunos() {

    const resposta = await fetch("https://660f44ad356b87a55c510d25.mockapi.io/agendas");

    const listaAlunos = await resposta.json();

    const cardsAlunos = document.getElementById("cards_games");

    cardsAlunos.innerHTML = listaAlunos.map((aluno) => {
        return `
       <div class="photo-student">
                    <img src="../imgs/student.jpg" alt="Foto de perfil">
                    <p>${aluno.nomeCompleto}</p>
                </div>
                <div class="lixeira" id="lixeira">
                    <img src="../imgs/trash-bin.png" alt="Ícone de lixeira">
                </div>
    `

    }).join('');
}

buscarAlunos();
