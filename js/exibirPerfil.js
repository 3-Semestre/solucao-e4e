const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')

async function exibirDadosPerfil() {
    const nivel_acesso = sessionStorage.getItem('nivel_acesso').toLowerCase();

    const resposta = await fetch(`http://localhost:8080/usuarios/perfil/${nivel_acesso}/${id}`);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar dados do servidor');
    }

    const dados = await resposta.json();

    if (!dados || dados.length === 0) {
        throw new Error('Dados não encontrados');
    }

    preencherInput(dados);
}

function preencherInput(dados) {
    var nomeTitulo = document.getElementById("nome_titulo");
    var nome = document.getElementById("nome");
    var nomeInput = document.getElementById("input_nome");
    var cpfInput = document.getElementById("input_cpf");
    var dataNascimentoInput = document.getElementById("input_data");
    var telefoneInput = document.getElementById("input_telefone");
    var emailInput = document.getElementById("input_email");
    var profissaoInput = document.getElementById("input_profissao");
    var horario = document.getElementById("horario_card");
    var horarioAtendimentoInicio = document.getElementById("input_atendimento_inicio");
    var horarioAtendimentoFim = document.getElementById("input_atendimento_fim");
    var horarioIntervaloInicio = document.getElementById("input_intervalo_inicio");
    var horarioIntervaloFim = document.getElementById("input_intervalo_fim");

    nomeTitulo.innerHTML = dados.nome_completo || '';
    nome.innerHTML = dados.nome_completo || '';
    nomeInput.value = dados.nome_completo || '';
    cpfInput.value = dados.cpf || '';
    dataNascimentoInput.value = dados.data_nascimento || '';
    telefoneInput.value = dados.telefone ? formatarCelular(dados.telefone) : '';
    emailInput.value = dados.email || '';
    profissaoInput.value = dados.profissao || '';

    horario.innerHTML = `${formatarHorario(dados.inicio || '')} às ${formatarHorario(dados.fim || '')}`;

    horarioAtendimentoInicio.value = formatarHorario(dados.inicio || '');
    horarioAtendimentoFim.value = formatarHorario(dados.fim || '');
    horarioIntervaloInicio.value = formatarHorario(dados.pausa_inicio || '');
    horarioIntervaloFim.value = formatarHorario(dados.pausa_fim || '');

    function formatarCelular(telefone) {
        let value = telefone;
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '+$1 $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        return value.substring(0, 15);
    }

    function formatarHorario(horario) {
        return horario ? horario.slice(0, -3) : '';
    }
}

function tratarNome(nichoNome) {
    let nomeTratado = nichoNome.replace(/_/g, ' ');

    let palavras = nomeTratado.split(' ');

    palavras = palavras.map(palavra => {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    });

    nomeTratado = palavras.join(' ');

    return nomeTratado;
}

async function buscarNivelIngles() {
    const resposta = await fetch("http://localhost:8080/nivel-ingles");
    const listaNiveis = await resposta.json();
    const checkboxList = document.getElementById("nivelCheckboxList");

    checkboxList.innerHTML = "";

    if (nivel_acesso_cod != 3) {
        const checkboxes = listaNiveis.map(nivel => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="nivel" value="${nivel.id}" id="nivel_${nivel.id}">
                    <label class="form-check-label" for="nivel_${nivel.id}">${tratarNome(nivel.nome)}</label>
                </div>
            `).join('');
        checkboxList.innerHTML += checkboxes;
    } else {
        const options = listaNiveis.map((nivel) => `
                <option value="${nivel.id}" id="nivel_${nivel.id}">${tratarNome(nivel.nome)}</option>
            `).join('');
        checkboxList.innerHTML += `
                <label class="form-label" id="nivelTitle"><span>*</span>Nível de Inglês:</label>
                <select class="form-select" id="nivel" aria-label="Default select example" required>
                    <option value="" selected>Selecione uma opção</option>
                    ${options}
                </select>
            `;
    }
}


async function buscarNichos() {
    const resposta = await fetch("http://localhost:8080/nichos");
    const listaNichos = await resposta.json();
    const checkboxList = document.getElementById("nichoCheckboxList");

    if (nivel_acesso_cod != 3) {
        const checkboxes = listaNichos.map(nicho => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="nicho" value="${nicho.id}" id="nicho_${nicho.id}">
                <label class="form-check-label" for="nicho_${nicho.id}">${tratarNome(nicho.nome)}</label>
                </div>
            `).join('');
        checkboxList.innerHTML += checkboxes;
    } else {
        const options = listaNichos.map((nicho) => `
                <option value="${nicho.id}" id="nivel_${nicho.id}">${tratarNome(nicho.nome)}</option>
            `).join('');
        checkboxList.innerHTML += `
                <select class="form-select" id="nicho" aria-label="Default select example" required>
                    <option value="" selected>Selecione uma opção</option>
                    ${options}
                </select>
            `;
    }
}


async function buscarNivelInglesUsuario() {
    const resposta = await fetch(`http://localhost:8080/usuario-nivel-ingles/usuario/${id}`);

    const respostaNivel = await resposta.json();

    console.log(respostaNivel)
    if (nivel_acesso_cod != 3) {
        var nivelIngles = document.getElementById("nivel");
    
        for (let i = 0; i < respostaNivel.length; i++) {
            if (i === respostaNivel.length - 1) {
                nivelIngles.innerHTML += respostaNivel[i].nivelIngles.nome;
            } else {
                nivelIngles.innerHTML += respostaNivel[i].nivelIngles.nome + ", ";
            }
        }
    
        respostaNivel.forEach((nivelUsuario) => {
            const checkbox = document.getElementById(`nivel_${nivelUsuario.nivelIngles.id}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    } else{
        const nivel_ingles_input = document.getElementById("nivel");
    }
        
    
}

async function buscarNichoUsuario() {
    const resposta = await fetch(`http://localhost:8080/usuario-nicho/usuario/${id}`);
    const respostaNicho = await resposta.json();
    const nicho = document.getElementById("nicho");

    const nichos = respostaNicho.map(nivel => nivel.nicho.id);
    sessionStorage.setItem('nichos', JSON.stringify(nichos));

    for (let i = 0; i < respostaNicho.length; i++) {
        var nichoNomeTratado = tratarNome(respostaNicho[i].nicho.nome);
        if (i == respostaNicho.length - 1) {
            nicho.innerHTML += nichoNomeTratado;
        } else {
            nicho.innerHTML += nichoNomeTratado + ", ";
        }
    }

    respostaNicho.forEach((nichoUsuario) => {
        const checkbox = document.getElementById(`nicho_${nichoUsuario.nicho.id}`);
        if (checkbox) {
            checkbox.checked = true;
        }
        checkbox.id = `nicho_${nichoUsuario.nicho.id}`;
    });
}


window.onload = function () {
    exibirDadosPerfil();
    buscarNivelIngles();
    buscarNichos();
    buscarNivelInglesUsuario();
    //buscarNichoUsuario();
};