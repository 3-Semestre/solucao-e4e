async function buscarAlunos() {

    const resposta = await fetch("http://localhost:8080/usuarios/aluno");

    const listaAlunos = await resposta.json();

    console.log(listaAlunos);

    cardsAlunos = document.getElementById("listagem")

    cardsAlunos.innerHTML += listaAlunos.map((aluno) => {
        return `
      <div class="dados-student" id="card_dados">
                <div class="photo-student">
                    <img src="../imgs/perfil_blue.png" alt="">
                    <p>${aluno.nomeCompleto}</p>
                </div>
                <div class="lixeira" id="lixeira_${aluno.id}">
                    <img src="../imgs/trash-bin.png" alt="icone_lixeira" onclick="excluirALuno()">
                </div>
            </div>
            <hr class="line">
    `

    }).join('');
    
}
try{
    buscarAlunos()
} catch (e){
    console.log(e)
}