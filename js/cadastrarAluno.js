async function cadastrarAluno() {
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const dataNascimento = document.getElementById("input_data").value;
    const telefone = document.getElementById("input_telefone").value;
    const email = document.getElementById("input_email").value;
    const profissao = document.getElementById("input_profissao").value;
    const senha = document.getElementById("input_senha").value;

    const dadosAgenda = {
        "nomeCompleto": nome,
        "cpf": cpf,
        // "dataNascimento": dataNascimento,
        "telefone": telefone,
        "email": email,
        // "profissao": profissao,
        "senha": senha,
        "nivelAcesso": {
            "id": 1
        }
    }

    const respostaCadastro = await fetch("http://localhost:8080/usuarios/aluno", {
        method: "POST",
        body: JSON.stringify(dadosAgenda),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaCadastro.status == 201) {
        Swal.fire({
            icon: "success",
            title: "Aluno cadastrado com sucesso!",
            showConfirmButton: false,
            timer: 1500
        });

        console.log("cadastro realizado com sucesso")
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Erro ao realizar o cadastro!",
        });
    }
}

