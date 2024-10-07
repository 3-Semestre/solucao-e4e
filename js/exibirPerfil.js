const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function exibirDadosPerfil() {
    const nivel_acesso = sessionStorage.getItem('nivel_acesso').toLowerCase();

    const resposta = await fetch(`http://localhost:8080/usuarios/perfil/${nivel_acesso}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    ;
    if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dados = await resposta.json();

    if (!dados || dados.length === 0) {
        throw new Error('Dados não encontrados');
    }

    preencherInput(dados);
    preencherNivelInglesUsuario(dados.niveis_Ingles)
    preencherNichoUsuario(dados.nichos)
}

function preencherInput(dados) {
    const nomeTitulo = document.getElementById("nome_titulo");
    const nome = document.getElementById("nome");
    const nomeInput = document.getElementById("input_nome");
    const cpfInput = document.getElementById("input_cpf");
    const dataNascimentoInput = document.getElementById("input_data");
    const telefoneInput = document.getElementById("input_telefone");
    const emailInput = document.getElementById("input_email");
    const profissaoInput = document.getElementById("input_profissao");
    const horario = document.getElementById("horario_card");
    const horarioAtendimentoInicio = document.getElementById("input_atendimento_inicio");
    const horarioAtendimentoFim = document.getElementById("input_atendimento_fim");
    const horarioIntervaloInicio = document.getElementById("input_intervalo_inicio");
    const horarioIntervaloFim = document.getElementById("input_intervalo_fim");
    const nicho = document.getElementById("nicho");
    const nivelIngles = document.getElementById("nivel");

    nomeTitulo.innerHTML = dados.nome_completo || '';
    nome.innerHTML = dados.nome_completo || '';
    nomeInput.value = dados.nome_completo || '';
    cpfInput.value = dados.cpf || '';
    dataNascimentoInput.value = dados.data_nascimento || '';
    telefoneInput.value = dados.telefone ? formatarCelular(dados.telefone) : '';
    emailInput.value = dados.email || '';
    profissaoInput.value = dados.profissao || '';
    nicho.innerHTML = tratarNome(dados.nichos) || '';
    nivelIngles.innerHTML = tratarNome(dados.niveis_Ingles) || '';

    horario.innerHTML = `${formatarHorario(dados.inicio || '')} às ${formatarHorario(dados.fim || '')}`;

    horarioAtendimentoInicio.value = (dados.inicio || '');
    horarioAtendimentoFim.value = (dados.fim || '');
    horarioIntervaloInicio.value = (dados.pausa_inicio || '');
    horarioIntervaloFim.value = (dados.pausa_fim || '');

    sessionStorage.setItem('horarioAtendimentoInicio', (dados.inicio || ''));
    sessionStorage.setItem('horarioAtendimentoFim',(dados.fim || ''));
    sessionStorage.setItem('horarioIntervaloInicio', (dados.pausa_inicio || ''));
    sessionStorage.setItem('horarioIntervaloFim', (dados.pausa_fim || ''));
    console.log(sessionStorage.getItem('horarioIntervaloFim'))
}

async function buscarNivelIngles() {
    const resposta = await fetch("http://localhost:8080/nivel-ingles", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const listaNiveis = await resposta.json();
    const checkboxList = document.getElementById("nivelCheckboxList");

    checkboxList.innerHTML = "";


    if (nivel_acesso_cod != 1) {
        const checkboxes = listaNiveis.map(nivel => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="${nivel.nome}" value="${nivel.id}" id="nivel_${nivel.id}">
                    <label class="form-check-label" for="nivel_${nivel.id}">${tratarNome(nivel.nome)}</label>
                </div>
            `).join('');
        checkboxList.innerHTML += `<label class="form-label" id="nivelTitle"><span>*</span>Nível de Inglês:</label>` + checkboxes;
    } else {
        const options = listaNiveis.map(nivel => `
            <option value="${nivel.id}" id="nivel_${nivel.id}">
                ${tratarNome(nivel.nome)}
            </option>
        `).join('');
        checkboxList.innerHTML += `
         <label class="form-label" id="nivelTitle"><span>*</span>Nível de Inglês:</label>
            <select class="form-select" name="nivel" id="nivel" aria-label="Default select example" required>
                <option value="">Selecione uma opção</option>
                ${options}
            </select>
        `;
    }
}

async function buscarNichos() {
    const resposta = await fetch("http://localhost:8080/nichos", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const listaNichos = await resposta.json();
    const checkboxList = document.getElementById("nichoCheckboxList");

    if (nivel_acesso_cod != 1) {
        const checkboxes = listaNichos.map(nicho => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="${tratarNome(nicho.nome)}" value="${nicho.id}" id="nicho_${nicho.id}">
                    <label class="form-check-label" for="nicho_${nicho.id}">${tratarNome(nicho.nome)}</label>
                </div>
            `).join('');
        checkboxList.innerHTML += checkboxes;
    } else {
        const options = listaNichos.map(nicho => `
            <option value="${nicho.id}" id="${nicho.nome}">
                ${tratarNome(nicho.nome)}
            </option>
        `).join('');
        checkboxList.innerHTML += `
            <select class="form-select" name="nicho" id="nicho" aria-label="Default select example" required>
                <option value="">Selecione uma opção</option>
                ${options}
            </select>
        `;
    }
}


function preencherNivelInglesUsuario(niveis) {
    const nivelInglesElement = document.getElementById("nivel");
    const niveisArray = niveis.split(',').map(n => tratarNome(n.trim()));

    if (nivel_acesso_cod != 1) {
        nivelInglesElement.innerHTML = niveisArray.join(', ');

        niveisArray.forEach((nivelNome) => {
            const checkbox = document.querySelector(`input[type="checkbox"][name="${nivelNome}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    } else {
        const opcaoSelect = Array.from(document.querySelector('select[name="nivel"]')).find(option => tratarNome(option.textContent.trim()) === niveisArray[0]);

        if (opcaoSelect) {
            Array.from(document.querySelector('select[name="nivel"]')).forEach(option => option.selected = false);

            opcaoSelect.selected = true;
        }
    }
}


function preencherNichoUsuario(nichos) {
    const nichoElement = document.getElementById("nicho");
    const nichosArray = nichos.split(',').map(n => tratarNome(n.trim()));

    if (nivel_acesso_cod != 1) {

        nichoElement.innerHTML = nichosArray.join(', ');

        nichosArray.forEach((nichoNome) => {
            const checkbox = document.querySelector(`input[type="checkbox"][name="${tratarNome(nichoNome)}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    } else {
        const opcaoSelect = Array.from(document.querySelector('select[name="nicho"]')).find(option => tratarNome(option.textContent.trim()) === nichosArray[0]);

        if (opcaoSelect) {
            Array.from(document.querySelector('select[name="nicho"]')).forEach(option => option.selected = false);

            opcaoSelect.selected = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await buscarNichos(); 
    await buscarNivelIngles();
    exibirDadosPerfil();
});

