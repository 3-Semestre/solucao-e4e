async function atualizarAluno() {
    console.log("a")
    const id = sessionStorage.getItem('id');
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const dataNascimento = document.getElementById("input_data").value;
    var telefone = document.getElementById("input_telefone").value;
    telefone = telefone.replace(/\s+/g, '').replace(/\+/g, '').replace(/-/g, '');
    const email = document.getElementById("input_email").value;
    const profissao = document.getElementById("input_profissao").value;
    const senha = document.getElementById("input_senha").value;

    const dadosAluno = {
        "nomeCompleto": nome,
        "cpf": cpf,
        "telefone": telefone,
        "email": email,
        "profissao": profissao,
        "dataNascimento": dataNascimento,
        "senha": senha,
        "nivelAcesso": {
            "id": 3
        },
        "situacao": {
            "id": 1
        }
    }

    console.log(dadosAluno)

    const respostaCadastro = await fetch(`http://localhost:8080/usuarios/professor/${id}`, {
        method: "PUT",
        body: JSON.stringify(dadosAluno),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaCadastro.status == 200) {
        const usuario = await respostaCadastro.json();
        salvarInformacoes(usuario)
        Swal.fire({ title: "Salvo!", icon: "success", confirmButtonColor: 'green' });
        atualizarNichoUsuario()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            showConfirmButton: false,
            text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>'
        });
    }
}

async function atualizarNichoUsuario() {
    console.log("Atualizando nicho do usuário...");
    const id = sessionStorage.getItem('id');
    const nichosAnteriores = JSON.parse(sessionStorage.getItem('nichos')) || [];

    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="nicho_"]');
    const novosNichos = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.id.split('_')[1]))
        .filter(nicho => !nichosAnteriores.includes(nicho));

    if (novosNichos.length > 0) {g
        for (const nicho of novosNichos) {
            const dadosNicho = {
                usuario: { id: id },
                nicho: { id: nicho }
            };

            try {
                const respostaCadastro = await fetch(`http://localhost:8080/usuario-nicho`, {
                    method: "POST",
                    body: JSON.stringify(dadosNicho),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                });

                if (respostaCadastro.status == 201) {
                    console.log(`Nicho ${nicho} atualizado com sucesso`);
                    exibirDadosPerfil();
                } else {
                    console.log(`Erro ao atualizar nicho ${nicho}`);
                    return;
                }
            } catch (e) {
                console.log(e);
                return;
            }
        }
    }
}



function salvarInformacoes(usuario) {
    sessionStorage.id = usuario.id;
    sessionStorage.cpf = usuario.cpf;
    sessionStorage.dataNascimento = usuario.dataNasc;
    sessionStorage.email = usuario.email; sessionStorage
    sessionStorage.nivel_acesso = usuario.nivelAcesso.nome;
    sessionStorage.nomeCompleto = usuario.nomeCompleto;
    sessionStorage.profissao = usuario.profissao;
    sessionStorage.telefone = usuario.telefone;
}