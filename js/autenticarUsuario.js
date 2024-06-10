async function autenticar() {
    const email = document.getElementById("input_email").value;
    const senha = document.getElementById("input_senha").value;

    console.log(email)
    console.log(senha)

    const dadosAluno = {
        "email": email,
        "senha": senha
    }

    const respostaLogin = await fetch("http://localhost:8080/usuarios/autenticar", {
        method: "POST",
        body: JSON.stringify(dadosAluno),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    console.log(respostaLogin)

    if (respostaLogin.status == 201) {
        const usuario = await respostaLogin.json();
        salvarInformacoes(usuario)
        window.location.href = "dashboardProfessor.html"

    } else if (respostaLogin.status == 403) {
        exibirMensagemErro();
    }
    else {
        console.log("erro ao realizar login")
    }

    function salvarInformacoes(usuario) {
        sessionStorage.cpf = usuario.cpf;
        sessionStorage.dataNascimento = usuario.dataNasc;
        sessionStorage.email = usuario.email; sessionStorage
        sessionStorage.nivel_acesso = usuario.nivelAcesso.nome;
        sessionStorage.nomeCompleto = usuario.nomeCompleto;
        sessionStorage.profissao = usuario.profissao;
        sessionStorage.telefone = usuario.telefone;

        check = document.getElementById("check_lembrar")
        console.log(check)
        console.log(check.checked)
        if (check.checked) {
            localStorage.email = usuario.email; sessionStorage
            localStorage.senha = document.getElementById("input_senha").value;
        } else {
            localStorage.removeItem('senha');
        }
    }

}

function exibirMensagemErro() {
    document.getElementById('mensagemErro').style.display = 'block';
}

function preencherDadosLogin() {
    var email = localStorage.getItem('email');
    var senha = localStorage.getItem('senha');


    if (email && senha) {
        check = document.getElementById("check_lembrar")
        check.checked = true
        document.getElementById('input_email').value = email;
        document.getElementById('input_senha').value = senha;
    }
}

window.onload = preencherDadosLogin;
