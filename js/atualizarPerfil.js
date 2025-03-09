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

    try {
        const respostaCadastro = await fetch(`http://localhost:8080/api/usuarios/${retornaNivelRequisicao(Number(sessionStorage.getItem('nivel_acesso_cod')))}/${sessionStorage.getItem('id')}`, {
            method: "PUT",
            body: JSON.stringify(dados),
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        console.log(respostaCadastro)

        if (respostaCadastro.status == 401) {
            Swal.fire({
                icon: 'error',
                title: 'Senha incorreta',
                showConfirmButton: false,
                text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
                footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>'
            });
        } else if (respostaCadastro.status == 400) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao realizar o cadastro',
                showConfirmButton: false,
                text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
                footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>'
            });
        } else if (respostaCadastro.status == 200) {
            Swal.fire({
                title: "Alterações salvas com sucesso!",
                icon: "success",
                background: '#f2f2f2',
                color: '#333',
                showConfirmButton: false, 
                timer: 1500,
                timerProgressBar: true
            });
        }
    } catch (e) {
        console.log(e)
        Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            showConfirmButton: false,
            text: 'Por favor, revise os dados inseridos e tente novamente. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>'
        });
    }
}

async function atualizarMeta() {
    const meta = document.getElementById("input_meta").value;

    if (meta != sessionStorage.getItem("meta")) {
        const respostaAtt = await fetch(`http://localhost:8080/api/metas/${sessionStorage.getItem("id")}`, {
            method: "PUT",
            body: meta,
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });
    }

    if (respostaAtt.status == 201) {
        return true;
    }
    return false;
}

async function atualizaHorarioAtendimento() {
    const horarioAtendimentoInicio = formatarHorarioPut(document.getElementById("input_atendimento_inicio").value);
    const horarioAtendimentoFim = formatarHorarioPut(document.getElementById("input_atendimento_fim").value);
    const horarioIntervaloInicio = formatarHorarioPut(document.getElementById("input_intervalo_inicio").value);
    const horarioIntervaloFim = formatarHorarioPut(document.getElementById("input_intervalo_fim").value);

    var validacaoUm = horarioAtendimentoInicio != sessionStorage.getItem("horarioAtendimentoInicio");
    var validacaoDois = horarioAtendimentoFim != sessionStorage.getItem("horarioAtendimentoFim");
    var validacaoTres = horarioIntervaloInicio != sessionStorage.getItem("input_intervalo_inicio");
    var validacaoQuatro = horarioIntervaloFim != sessionStorage.getItem("input_intervalo_fim");

    if (validacaoUm || validacaoDois || validacaoTres || validacaoQuatro) {
        var id = Number(sessionStorage.getItem('id'));
        const dados = {
            "inicio": horarioAtendimentoInicio,
            "fim": horarioAtendimentoFim,
            "pausaInicio": horarioIntervaloInicio,
            "pausaFim": horarioIntervaloFim
        }

        const respostaAtt = await fetch(`http://localhost:8080/api/horario-professor/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados),
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        if (respostaAtt.ok) {
            return true;
        }
        return false;
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
                const respostaCadastro = await fetch(`http://localhost:8080/api/usuario-nivel-ingles`, {
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

let nichosSelecionados = new Set();
let niveisSelecionados = new Set();

const todosNichos = [1, 2, 3, 4, 5];
const todosNiveis = [1, 2, 3, 4, 5, 6];

function toggleItem(itemId, isChecked, selectedSet) {
    if (isChecked) {
        selectedSet.add(itemId);
    } else {
        selectedSet.delete(itemId);
    }
}

function obterItensAtuais(todosItens, selectedSet) {
    const selecionadosArray = Array.from(selectedSet);
    const naoSelecionados = todosItens.filter(itemId => !selectedSet.has(itemId));

    return {
        selecionados: selecionadosArray,
        naoSelecionados: naoSelecionados
    };
}

async function atualizarItensUsuario(prefixo, todosItens, selectedSet) {
    console.log(`Atualizando ${prefixo}`);

    todosItens.forEach(itemId => {
        const checkbox = document.getElementById(`${prefixo}_${itemId}`);
        if (checkbox) {
            toggleItem(itemId, checkbox.checked, selectedSet);
        }
    });

    const { selecionados, naoSelecionados } = obterItensAtuais(todosItens, selectedSet);

    const dados = {
        "usuarioId": sessionStorage.getItem("id"),
        [`${prefixo}Selecionados`]: selecionados,
        [`${prefixo}NaoSelecionados`]: naoSelecionados
    };

    try {
        const url = `http://localhost:8080/api/usuario-${prefixo === 'nivel' ? 'nivel-ingles' : 'nicho'}/professor/${sessionStorage.getItem("id")}`;
        console.log(dados)
        const resposta = await fetch(url, {
            method: "POST",
            body: JSON.stringify(dados),
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        console.log(resposta.status)
        if (resposta.ok) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function atualizarNichoUsuario() {
    return await atualizarItensUsuario('nicho', todosNichos, nichosSelecionados);
}

async function atualizarNivelUsuario() {
    return await atualizarItensUsuario('nivel', todosNiveis, niveisSelecionados);
}
