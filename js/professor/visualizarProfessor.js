const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function buscarProfessor() { 
    const cardsProfessor = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/api/usuarios/professor/paginado?page=${paginaAtual}`, {
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

    const respostaDelete = await fetch(`http://localhost:8080/api/usuarios/Professor/${id}`, {
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

async function importarDados() {
    console.log("Botão clicado! Função importarDados() executada.");
    
    const file = importInput.files[0]; 

    if (!file) {
        console.error("Nenhum arquivo selecionado.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Envia o arquivo ao endpoint
        const response = await fetch('http://localhost:8080/api/archive/txt/usuarios', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        console.log(response)

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Aluno cadastrado com sucesso!",
                showConfirmButton: false,
                timer: 1500
            });
            console.log('Upload realizado com sucesso:', response);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao deletar',
                showConfirmButton: false,
                text: 'Erro ao fazer o import de usuãrio.',
                footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
                timer: 2000
            });
            console.error('Erro ao enviar o arquivo:', response.statusText);
        }
    } catch (error) {
        console.error('Erro de rede ou servidor:', error);
    }
}

async function exportarDados() {
    console.log("passei por aqui!")
    try {
      const response = await fetch(`http://localhost:8080/api/archive/csv/usuarios/${tipo}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}` 
        }
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      // Obtém o arquivo como um blob
      const blob = await response.blob();
      // Cria uma URL para o blob
      const url = window.URL.createObjectURL(blob);

      // Cria um elemento <a> para simular o clique
      const a = document.createElement('a');
      a.href = url;

      // Define o nome do arquivo a ser baixado
      const filename = 'usuarios.csv';
      a.download = filename;

      // Simula o clique no link
      document.body.appendChild(a);
      a.click();

      // Remove o link após o download
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("Usuários salvos")
    } catch (error) {
      console.error('Erro ao exportar arquivo:', error);
      alert('Erro ao exportar o arquivo. Tente novamente mais tarde.');
    }
  }