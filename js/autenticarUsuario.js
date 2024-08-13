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

        if(usuario.nivelAcesso.nome == "ALUNO"){
            window.location.href = "aluno/dashboardAluno.html"
        } else {
            window.location.href = "dashboardProfessor.html"
        }
        

    } else if (respostaLogin.status == 403) {
        exibirMensagemErro();
    }
    else {
        console.log("erro ao realizar login")
    }

    function salvarInformacoes(usuario) {
        console.log(usuario)
        sessionStorage.id = usuario.id;
        sessionStorage.cpf = usuario.cpf;
        sessionStorage.email = usuario.email; sessionStorage
        sessionStorage.nivel_acesso = usuario.nivelAcesso.nome;
        sessionStorage.nivel_acesso_cod = usuario.nivelAcesso.id;
        sessionStorage.nome_completo = usuario.nomeCompleto;
        sessionStorage.token = usuario.token;

        let check = document.getElementById("check_lembrar")

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

    document.getElementById("input_email").addEventListener("input", function () {
        document.getElementById('mensagemErro').style.display = 'none';
    });
    
    document.getElementById("input_senha").addEventListener("input", function () {
        document.getElementById('mensagemErro').style.display = 'none';
    });
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
