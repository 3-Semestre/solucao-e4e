var paginaAtual = 0;
var totalPaginas = 0;
const nivelAcesso = Number(sessionStorage.getItem('nivel_acesso_cod'));

async function buscarAlunos(paginaAtual) {
    if (paginaAtual < 0 || (totalPaginas > 0 && paginaAtual >= totalPaginas)) return; // Limita as páginas

    const cardsAlunos = document.getElementById("listagem_usuarios");

    const resposta = await fetch(`http://localhost:8080/api/usuarios/aluno/paginado?page=${paginaAtual}` + Filters.buildQueryString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        cardsAlunos.innerHTML += "<span>Não há alunos cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=aluno'>aqui</a>";
        return;
    }

    const listaAlunos = await resposta.json();

    if (listaAlunos.content == null || listaAlunos.content.length === 0) {
        atualizarBotoesPaginacaoAluno(0, 0);
        cardsAlunos.innerHTML = `<span class="text-muted">Não há alunos cadastrados com os filtros aplicados. <br/></span>`;
        return;
    }

    cardsAlunos.innerHTML = "";
    cardsAlunos.innerHTML += listaAlunos.content.map((aluno) => {
        const alunoId = aluno.id; // ID do aluno para garantir unicidade

        // Converte as strings em arrays
        const niveisInglesArray = aluno.niveis_Ingles ? aluno.niveis_Ingles.split(", ") : [];
        const nichosArray = aluno.nichos ? aluno.nichos.split(", ") : [];

        return `
        <div class="dados-student" id="card_dados_${alunoId}">
            <div class="header-student ${aluno.status === "INATIVO" ? "inativo" : ""}">
                <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
                <p>${aluno.nome_completo}</p>
            </div>
            <br/><br/>
            <div class="form-student ${aluno.status === "INATIVO" ? "inativo" : ""}">
                <div class="personal-information">
                    <div class="form-group">
                        <label for="cpf_${alunoId}">CPF:</label>
                        <label class="label2" type="text" id="cpf_${alunoId}">${aluno.cpf}</label>
                    </div>
                    <div class="form-group">
                        <label for="data-nascimento_${alunoId}">Data de Nascimento:</label>
                        <label class="label2" type="date" id="data-nascimento_${alunoId}">${formatarData(aluno.data_nascimento)}</label>
                    </div>
                    <div class="form-group">
                        <label for="email_${alunoId}">E-mail:</label>
                        <label class="label2" type="email" id="email_${alunoId}">${aluno.email}</label>
                    </div>
                    <div class="form-group">
                        <label for="telefone_${alunoId}">Telefone:</label>
                        <label class="label2" type="text" id="telefone_${alunoId}">${formatarCelular(aluno.telefone)}</label>
                    </div>
                    <div class="form-group">
                        <label for="nivel-ingles_${alunoId}">Nível de Inglês:</label>
                        <select class="label2" id="nivel-ingles_${alunoId}" disabled>
                            ${niveisInglesArray.map((nivel) => `<option value="${nivel}">${nivel}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="nicho_${alunoId}">Nicho:</label>
                        <select class="label2" id="nicho_${alunoId}" disabled>
                            ${nichosArray.map((nicho) => `<option value="${nicho}">${tratarNome(nicho)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status_${alunoId}">Status:</label>
                        <select class="label2" id="status_${alunoId}" disabled>
                            <option value="1" ${aluno.status === "ATIVO" ? "selected" : ""}>Ativo</option>
                            <option value="2" ${aluno.status === "INATIVO" ? "selected" : ""}>Inativo</option>
                        </select>
                    </div>
                </div>
            </div>
                <div class="lapis">
                    <img src="../imgs/pen.png" alt="Editar aluno" style="width: 3vw; height: 6vh" onclick="editarAluno(${alunoId})">
                </div>
                <div class="lixeira" style="display: none;">
                    <img src="../imgs/cancel.png" alt="Cancelar mudança" style="width: 3vw; height: 6vh" onclick="cancelarEdicao(${alunoId})">
                </div>          
        </div>
        <hr class="line">
        `;
    }).join('');

    const elementos = document.querySelectorAll('.dados-student');
    elementos.forEach(elemento => {
        elemento.style.height = "50vh";
    });

    atualizarBotoesPaginacaoAluno(listaAlunos.totalPages, listaAlunos.pageable.pageNumber);

    // Esconde o GIF de carregamento
    const loadingGif = document.getElementById('loading');
    loadingGif.style.display = 'none';

}

function confirmacaoDeleteAluno(id) {
    Swal.fire({
        title: "Deseja inativar esse aluno?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#072B59',
        cancelButtonColor: '#830f0f',
        background: '#f2f2f2',
        color: '#333'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                deletarAluno(id);
            } catch (e) {
                console.log(e);
            }
        } else {
            return
        }
    });
}

function editarAluno(id) {
    const nivelSelect = document.getElementById(`nivel-ingles_${id}`);
    const nichoSelect = document.getElementById(`nicho_${id}`);
    const statusSelect = document.getElementById(`status_${id}`);
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis img`);
    const lixeira = document.querySelector(`#card_dados_${id} .lixeira`);

    if (statusSelect && statusSelect.value != "2") {
        if (nivelSelect) {
            nivelSelect.removeAttribute("disabled");
            nivelSelect.focus();
            buscarNivel(nivelSelect);
        }

        if (nichoSelect) {
            nichoSelect.removeAttribute("disabled");
            buscarNicho(nichoSelect);
        }
    }

    if (statusSelect) {
        statusSelect.removeAttribute("disabled");
        statusSelect.setAttribute("data-original-value", statusSelect.value);
    }

    if (lixeira) {
        lixeira.style.display = "flex";
        lixeira.style.position = "relative";
        lixeira.style.bottom = "11vw";
    }

    botaoEditar.src = "../imgs/check.png";
    botaoEditar.alt = "Confirmar edição";
    botaoEditar.style.position = "relative";
    botaoEditar.style.bottom = "10vw";
    botaoEditar.onclick = () => confirmarEdicao(id);
}

function confirmarEdicao(id) {
    Swal.fire({
        title: "Deseja confirmar as alterações?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#072B59',
        cancelButtonColor: '#830f0f',
        background: '#f2f2f2',
        color: '#333'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let alteracoesFeitas = false;

            const statusSelect = document.getElementById(`status_${id}`);
            const nivelSelect = document.getElementById(`nivel-ingles_${id}`);
            const nichoSelect = document.getElementById(`nicho_${id}`);

            if (statusSelect && statusSelect.value !== statusSelect.getAttribute("data-original-value")) {
                const statusAtualizado = await atualizarStatus(id, statusSelect.value);
                if (statusAtualizado) alteracoesFeitas = true;
            }

            if (nivelSelect && nivelSelect.value !== nivelSelect.getAttribute("data-original-value")) {
                const nivelAtualizado = await atualizarNivel(id);
                if (nivelAtualizado) alteracoesFeitas = true;
            }

            if (nichoSelect && nichoSelect.value !== nichoSelect.getAttribute("data-original-value")) {
                const nichoAtualizado = await atualizarNicho(id);
                if (nichoAtualizado) alteracoesFeitas = true;
            }

            if (alteracoesFeitas) {
                Swal.fire({
                    title: "Alterações confirmadas com sucesso!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f2f2f2',
                    color: '#333',
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    title: "Nenhuma alteração foi feita.",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f2f2f2',
                    color: '#333',
                    timerProgressBar: true
                });
            }
        }
        cancelarEdicao(id);
        buscarAlunos(paginaAtual);
    });
}

function cancelarEdicao(id) {
    const nivelSelect = document.getElementById(`nivel-ingles_${id}`);
    const nichoSelect = document.getElementById(`nicho_${id}`);
    const statusSelect = document.getElementById(`status_${id}`);
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis img`);
    const lixeira = document.querySelector(`#card_dados_${id} .lixeira`); // Seleciona a lixeira

    nivelSelect.setAttribute("disabled", "true");
    nichoSelect.setAttribute("disabled", "true");
    statusSelect.setAttribute("disabled", "true");

    if (lixeira) {
        lixeira.style.display = "none";
    }

    botaoEditar.style.position = "relative";
    botaoEditar.style.bottom = "0"
    botaoEditar.src = "../imgs/pen.png";
    botaoEditar.alt = "Editar aluno";
    botaoEditar.onclick = () => editarAluno(id);
}

async function deletarAluno(id) {
    const respostaDelete = await fetch(`http://localhost:8080/api/usuarios/aluno/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaDelete.status == 204) {
        Swal.fire({
            title: "Aluno excluído com sucesso!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            background: '#f2f2f2',
            color: '#333',
            timerProgressBar: true
        });
        setTimeout(() => buscarAlunos(0), 1500);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 1500
        });
    }
}

function atualizarBotoesPaginacaoAluno(total, atual) {
    const paginacao = document.getElementById('paginacao_visualizacao');
    paginacao.innerHTML = '';

    const anterior = document.createElement('li');
    anterior.classList.add('page-item');
    if (total === 0 && atual === 0) {
        paginacao.style.display = 'none';
        return;
    } else if (atual === 0) {
        anterior.classList.add('disabled');
    }
    paginacao.style.display = 'flex';
    anterior.innerHTML = `
        <a class="page-link" href="#" onclick="buscarAlunos(${atual - 1})" aria-disabled="${atual === 0}">
            &laquo; Anterior
        </a>
    `;
    paginacao.appendChild(anterior);

    // Botões numéricos
    for (let i = 0; i < total; i++) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (i === atual) {
            item.classList.add('active');
        }
        item.innerHTML = `
            <a class="page-link" href="#" onclick="buscarAlunos(${i})">${i + 1}</a>
        `;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    if (atual === total - 1) {
        proximo.classList.add('disabled');
    }
    proximo.innerHTML = `
        <a class="page-link" href="#" onclick="buscarAlunos(${atual + 1})" aria-disabled="${atual === total - 1}">
            Próximo &raquo;
        </a>
    `;
    paginacao.appendChild(proximo);

    paginaAtual = atual;
}

async function buscarNivel(selectElement) {
    const textoSelecionado = selectElement.options[selectElement.selectedIndex]?.textContent;

    const resposta = await fetch("http://localhost:8080/api/nivel-ingles", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const listaNiveis = await resposta.json();

    selectElement.innerHTML = "";

    listaNiveis.forEach((nivel) => {
        let optionExistente = Array.from(selectElement.options).find(option => option.textContent === nivel.nome);

        if (optionExistente) {
            optionExistente.value = nivel.id;
        } else {
            const option = document.createElement("option");
            option.value = nivel.id;
            option.textContent = nivel.nome;
            selectElement.appendChild(option);
        }
    });

    const optionToSelect = Array.from(selectElement.options).find(option => option.textContent === textoSelecionado);
    if (optionToSelect) {
        optionToSelect.selected = true;
    }
}

async function buscarNicho(selectElement) {
    const textoSelecionado = selectElement.options[selectElement.selectedIndex]?.textContent;

    const resposta = await fetch("http://localhost:8080/api/nichos", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const listaNichos = await resposta.json();

    selectElement.innerHTML = "";

    listaNichos.forEach((nicho) => {
        let optionExistente = Array.from(selectElement.options).find(option => option.textContent === tratarNome(nicho.nome));

        if (optionExistente) {
            optionExistente.value = nicho.id;
        } else {
            const option = document.createElement("option");
            option.value = nicho.id;
            option.textContent = tratarNome(nicho.nome);
            selectElement.appendChild(option);
        }
    });

    const optionToSelect = Array.from(selectElement.options).find(option => option.textContent === textoSelecionado);
    if (optionToSelect) {
        optionToSelect.selected = true;
    }
}

async function atualizarNivel(id) {
    const nivelSelect = document.getElementById(`nivel-ingles_${id}`);
    var id_nivel = nivelSelect.value;

    try {
        var resposta = await fetch(`http://localhost:8080/api/usuario-nivel-ingles/${id}`, {
            method: "PUT",
            body: id_nivel,
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        if (resposta.status == 201) {
            return true;
        }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar o nivel do aluno',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 2000
        });
        console.log(error);
    }
}

async function atualizarNicho(id) {
    console.log(id);
    const nichoSelect = document.getElementById(`nicho_${id}`);
    var id_nicho = nichoSelect.value;

    console.log(id_nicho);

    try {
        var resposta = await fetch(`http://localhost:8080/api/usuario-nicho/${id}`, {
            method: "PUT",
            body: id_nicho,
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        if (resposta.status == 201) {
            return true;
        }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar o nicho do aluno',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 2000
        });
        console.log(error);
    }
}

async function atualizarStatus(id, novoStatus) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/usuarios/desativar/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoStatus)
        });

        if (resposta.ok) {
            return true;
        } else {
            const errorData = await resposta.json();
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar o status',
                text: errorData.message || 'Por favor, tente novamente mais tarde.',
                background: '#f2f2f2',
                color: '#333'
            });
            return false;
        }
    } catch (error) {
        console.error("Erro ao atualizar o status:", error);
        return false;
    }
}
