async function atualizarPerfil() {
    const id = sessionStorage.getItem('id');
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const dataNascimento = document.getElementById("input_data").value;
    var telefone = document.getElementById("input_telefone").value;
    telefone = telefone.replace(/\s+/g, '').replace(/\+/g, '').replace(/-/g, '');
    const email = document.getElementById("input_email").value;
    const profissao = document.getElementById("input_profissao").value;
    const senha = document.getElementById("input_senha").value;
    const nivel_acesso = sessionStorage.getItem('nivel_acesso_cod');
    
    const dados = {
        "nomeCompleto": nome,
        "cpf": cpf,
        "telefone": telefone,
        "email": email,
        "profissao": profissao,
        "dataNascimento": dataNascimento,
        "senha": senha,
        "nivelAcesso": {
            "id": nivel_acesso
        },
        "situacao": {
            "id": 1
        }
    }

    function retornaNivelRequisicao() {
        if (nivel_acesso === "1") {
            return "representante-legal"
        } else if (nivel_acesso === "2") {
            return "professor"
        } else if (nivel_acesso === "3") {
            return "aluno"
        }
    }

    try {
        const respostaCadastro = await fetch(`http://localhost:8080/usuarios/${retornaNivelRequisicao()}/${sessionStorage.getItem('id')}`, {
            method: "PUT",
            body: JSON.stringify(dados),
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });
        /*
        if (!respostaCadastro.status == 200) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar',
                showConfirmButton: false,
                text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
                footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>'
            });
        } else {
            const usuario = await respostaCadastro.json();
            salvarInformacoes(usuario)
            //atualizarNivelIngles()
        }
            */
    } catch (e) {
        console.log(e)
    }
}

async function atualizarNivelIngles() {
    const id = sessionStorage.getItem('id');
    const nivelAnteriores = JSON.parse(sessionStorage.getItem('nivel')) || [];

    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="nivel_"]');
    const novosnivel = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.id.split('_')[1]))
        .filter(nivel => !nivelAnteriores.includes(nivel));

    if (novosnivel.length > 0) {
        for (const nivelIngles of novosnivel) {
            const dadosNivel = {
                usuario: { id: id },
                nivelIngles: { id: nivelIngles }
            };

            try {
                const respostaCadastro = await fetch(`http://localhost:8080/usuario-nivel-ingles`, {
                    method: "POST",
                    body: JSON.stringify(dadosNivel),
                    headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
                });

                if (respostaCadastro.status == 201) {
                    console.log(`Nicho ${nicho} atualizado com sucesso`);
                    atualizarNichoUsuario();
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

async function atualizarNichoUsuario() {
    console.log("Atualizando nicho do usuário...");
    const id = sessionStorage.getItem('id');
    const nichosAnteriores = JSON.parse(sessionStorage.getItem('nichos')) || [];

    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="nicho_"]');
    const novosNichos = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.id.split('_')[1]))
        .filter(nicho => !nichosAnteriores.includes(nicho));

    if (novosNichos.length > 0) {
        for (const nicho of novosNichos) {
            const dadosNicho = {
                usuario: { id: id },
                nicho: { id: nicho }
            };

            try {
                const respostaCadastro = await fetch(`http://localhost:8080/usuario-nicho`, {
                    method: "POST",
                    body: JSON.stringify(dadosNicho),
                    headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
                });

                if (respostaCadastro.status == 201) {
                    console.log(`Nicho ${nicho} atualizado com sucesso`);
                    Swal.fire({ title: "Salvo!", icon: "success", confirmButtonColor: 'green' });
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
    console.log("teste")
    sessionStorage.id = usuario.id;
    sessionStorage.cpf = usuario.cpf;
    sessionStorage.data_nascimento = usuario.dataNasc;
    sessionStorage.email = usuario.email; sessionStorage
    sessionStorage.nivel_acesso = usuario.nivelAcesso.nome;
    sessionStorage.nome_completo = usuario.nomeCompleto;
    sessionStorage.profissao = usuario.profissao;
    sessionStorage.telefone = usuario.telefone;
}