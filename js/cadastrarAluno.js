async function cadastrarAgenda() {
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
        "dataNascimento": dataNascimento,
        "telefone": telefone,
        "email": email,
        "profissao": profissao,
        "senha": senha,
        "nivelAcesso": {
            "id": 1
        }
    }

    const respostaCadastro = await fetch("http://localhost:8080/usuarios/alunos", {
        method: "POST",
        body: JSON.stringify(dadosAgenda),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaCadastro.status == 201) {
        console.log("cadastro realizado com sucesso")
    } else {
        alert("Ocorreu um erro ao cadastrar")
    }
}

document.getElementById('botaoCadastro').addEventListener('click', function () {
    console.log("aaaaa")
    try {
        cadastrarAgenda()
    } catch {
        console.log(e) 
    }
});


/*
{
    "nomeCompleto": "Kauan",
    "cpf": "454.066.693-20",
 "dataNascimento": "2002-09-09",
    "telefone": "11993788173",
    "email": "kauan@email.com",
    "profissao": "profissao",
    "senha": "bananaKQ1935",
    "profissao": "Engenheiro",
    "nivelAcesso": {
        "id": 1
    }
}
    */