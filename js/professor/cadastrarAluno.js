const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function cadastrarAluno() {
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const dataNascimento = document.getElementById("input_data").value;
    const telefone = document.getElementById("input_telefone").value;
    const email = document.getElementById("input_email").value;
    const profissao = document.getElementById("input_profissao").value;
    const senha = document.getElementById("input_senha").value;
    const nivel = document.getElementById('nivel').value;
    const nicho = document.getElementById('nicho').value;


    const dadosAluno = {
        "nomeCompleto": nome,
        "cpf": cpf,
        "dataNascimento": dataNascimento,
        "telefone": telefone,
        "email": email,
        "profissao": profissao,
        "senha": senha,
        "nivelAcesso": {
            "id": 1
        },
        "listaDeNichos": [
            {
                "id": nicho
            }
        ],
        "listaDeNiveis": [
            {
                "id": nivel
            }
        ]
    }

    const respostaCadastro = await fetch("http://localhost:8080/api/usuarios/salvar/aluno", {
        method: "POST",
        body: JSON.stringify(dadosAluno),
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaCadastro.status == 201) {
        Swal.fire({
            icon: "success",
            title: "Aluno cadastrado com sucesso!",
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout("location.href = 'visualizar.html?tipo=aluno'", 2000);

    } else if (respostaCadastro.status == 409) {
        erroCpf()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            showConfirmButton: false,
            text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 1500
        });
    }

    function erroCpf() {
        const inputCpf = document.getElementById("input_cpf");
        inputCpf.classList.add("input-error");

        let errorMessage = document.getElementById("cpf-error-message");
        if (!errorMessage) {
            let errorMessage = document.getElementById("cpf-error-message");
            errorMessage = document.createElement("div");
            errorMessage.id = "cpf-error-message";
            errorMessage.className = "error-message";
            errorMessage.textContent = "O CPF informado já está cadastrado.";
            inputCpf.parentNode.appendChild(errorMessage);
        }
    }

    document.getElementById("input_cpf").addEventListener("input", function () {
        this.classList.remove("input-error");
        const errorMessage = document.getElementById("cpf-error-message");
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}