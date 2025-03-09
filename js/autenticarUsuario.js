async function autenticar() {
    const email = document.getElementById("input_email").value;
    const senha = document.getElementById("input_senha").value;

    const dadosAluno = {
        "email": email,
        "senha": senha
    }

    try {
        const respostaLogin = await fetch("http://localhost:8080/api/usuarios/autenticar", {
            method: "POST",
            body: JSON.stringify(dadosAluno),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (respostaLogin.status == 201) {
            const usuario = await respostaLogin.json();
            salvarInformacoes(usuario)

            if (usuario.nivelAcesso.nome == "ALUNO") {
                window.location.href = "dashboardAluno.html"
            } else {
                window.location.href = "dashboardAdmin.html"
            }

        } else if (respostaLogin.status == 403) {
            exibirMensagemErro();  // Exibe erros de login
        }
    } catch (error) {
        // TODO TRATIVA ERRO LOGIN
    }

    function salvarInformacoes(usuario) {
        sessionStorage.id = usuario.id;
        if(usuario.id == "1") {
            localStorage.setItem('teacherImage', cris);
        } else if(usuario.id == "4") {
            localStorage.setItem('teacherImage', felipe);
        } else{
            localStorage.setItem('teacherImage', "");
        }
        sessionStorage.nivel_acesso = usuario.nivelAcesso.nome;
        sessionStorage.nivel_acesso_cod = usuario.nivelAcesso.id;
        sessionStorage.nome_completo = usuario.nomeCompleto;
        sessionStorage.token = usuario.token;

        let check = document.getElementById("check_lembrar")

        if (check.checked) {
            localStorage.email = usuario.email;
            localStorage.senha = document.getElementById("input_senha").value;
        } else {
            localStorage.removeItem('senha');
        }
    }
}

function exibirMensagemErro() {
    const emailInput = document.getElementById("input_email");
    const senhaInput = document.getElementById("input_senha");

    // Seta o estilo de erro
    emailInput.classList.add('error');
    senhaInput.classList.add('error');
    
    // Exibe a mensagem de erro
    document.getElementById('email-error').style.display = 'block';
    document.getElementById('senha-error').style.display = 'block';

    // Remove as mensagens de erro quando o usuário começa a digitar novamente
    emailInput.addEventListener("input", function () {
        emailInput.classList.remove('error');
        document.getElementById('email-error').style.display = 'none';
    });

    senhaInput.addEventListener("input", function () {
        senhaInput.classList.remove('error');
        document.getElementById('senha-error').style.display = 'none';
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
