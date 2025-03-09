const id = sessionStorage.getItem('id')
const nivel_acesso_cod = sessionStorage.getItem('nivel_acesso_cod')
const token = sessionStorage.getItem('token')

async function buscarProfessor() {
    const cardsProfessor = document.getElementById("listagem_usuarios")

    const resposta = await fetch(`http://localhost:8080/api/usuarios/professor/paginado?page=${paginaAtual}` + Filters.buildQueryString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (resposta.status == 204) {
        atualizarBotoesPaginacaoProfessor(0, 0)
        cardsProfessor.innerHTML = "<span>Não há professores cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=professor'>aqui</a>";
        return;
    }
    const listaProfessors = await resposta.json();

    if (listaProfessors.content == null || listaProfessors.content.length === 0) {
        atualizarBotoesPaginacaoProfessor(0, 0);
        cardsProfessor.innerHTML = `<span class="text-muted">Não há professores cadastrados com os filtros aplicados. <br/></span>`;
        return;
    }

    cardsProfessor.innerHTML = "";
    cardsProfessor.innerHTML += listaProfessors.content.map((professor) => {
        const professorId = professor.id; // ID do professor para garantir unicidade

        return `<div id="listagem_usuarios">
    <!-- Card de Professor -->
    <div class="dados-student" id="card_dados_${professorId}">
        <div class="header-student ${professor.status === "INATIVO" ? "inativo" : ""}">
            <img src="../imgs/perfil_blue.png" alt="Foto do professor">
            <p>${professor.nome_completo}</p>
        </div>
        <br/>
        <br/>
        <div class="form-student ${professor.status === "INATIVO" ? "inativo" : ""}">
            <div class="personal-information">
                <div class="form-group">
                    <label for="cpf_${professorId}">CPF:</label>
                    <label class="label2" type="text" id="cpf_${professorId}"> ${professor.cpf} </label>
                </div>
                <div class="form-group">
                    <label for="data-nascimento_${professorId}">Data de Nascimento:</label>
                    <label class="label2" type="date" id="data-nascimento_${professorId}"> ${formatarData(professor.data_nascimento)} </label>
                </div>
                <div class="form-group">
                    <label for="email_${professorId}">E-mail:</label>
                    <label class="label2" type="email" id="email_${professorId}"> ${professor.email} </label>
                </div>
                <div class="form-group">
                    <label for="telefone_${professorId}">Telefone:</label>
                    <label class="label2" type="text" id="telefone_${professorId}"> ${formatarCelular(professor.telefone)} </label>
                </div>
            </div>

            <div class="course-information">
                <div class="form-group">
                    <label for="nivel-ingles_${professorId}">Nível de Inglês:</label>
                    <label class="label2" type="text" id="nivel-ingles_${professorId}"> ${professor.niveis_Ingles} </label>
                </div>
                <div class="form-group">
                    <label for="nicho_${professorId}">Nicho:</label>
                    <label class="label2" type="text" id="nicho_${professorId}"> ${tratarNome(professor.nichos) || ''} </label>
                </div>
                <div class="form-group">
                    <label for="horario-trabalho_${professorId}">Horário de trabalho:</label>
                    <label class="label2" type="text" id="horario-trabalho_${professorId}">${formatarHorario(professor.inicio || '')} às ${formatarHorario(professor.fim || '')} </label>
                </div>
                <div class="form-group">
                    <label for="horario-intervalo_${professorId}">Horário de intervalo:</label>
                    <label class="label2" type="text" id="horario-intervalo_${professorId}">${formatarHorario(professor.pausa_inicio || '')} às ${formatarHorario(professor.pausa_fim || '')} </label>
                </div>
            </div>
        </div>
        <br>
        <div class="course-information ${professor.status === "INATIVO" ? "inativo" : ""}">
            <div class="form-group">
                <label for="meta_${professorId}">Metas:</label>
                <input class="label2" type="text" id="meta_${professorId}" value="${professor.qtd_aula} aulas" readonly>
            </div>
            <div class="form-group" id="status">
                <label for="status_${professorId}">Status:</label>
                <select class="label2" id="status_${professorId}" disabled>
                    <option value="1" ${professor.status === "ATIVO" ? "selected" : ""}>Ativo</option>
                    <option value="2" ${professor.status === "INATIVO" ? "selected" : ""}>Inativo</option>
                </select>
            </div>
        </div>
        <div class="lixeira-professor" id="lixeira_${professorId}" style="display: none;">
            <img src="../imgs/cancel.png" onclick="cancelarEdicaoProfessor(${professorId})" alt="Excluir professor" style="width: 3vw; height: 6vh">
        </div>
        <div class="lapis-professor" id="editar_${professorId}">
            <img src="../imgs/pen.png" alt="Editar professor" style="width: 3vw; height: 6vh" onclick="editarProfessor(${professorId})">
        </div>
    </div>
    <hr class="line">
</div>
`;
    }).join('');

    const elementos = document.querySelectorAll('.dados-student');
    elementos.forEach(elemento => {
        elemento.style.height = "50vh";
    });

    atualizarBotoesPaginacaoProfessor(listaProfessors.totalPages, listaProfessors.pageable.pageNumber);

    // Esconde o GIF de carregamento
    const loadingGif = document.getElementById('loading');
    loadingGif.style.display = 'none';
}

function confirmacaoDeleteProfessor(id) {
    Swal.fire({
        title: "Deseja inativar esse Professor?",
        showCancelButton: false,
        showDenyButton: true,
        confirmButtonText: "Sim",
        denyButtonText: "Não",
        confirmButtonColor: '#072B59',
        denyButtonColor: '#830f0f',
        background: '#f2f2f2',
        color: '#333'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                deletarProfessor(id);
            } catch (e) {
                console.log(e);
            }
        }
    });
}

async function deletarProfessor(id) {
    const respostaDelete = await fetch(`http://localhost:8080/api/usuarios/Professor/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (respostaDelete.status === 204) {
        Swal.fire({
            title: "Professor excluído com sucesso!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            background: '#f2f2f2',
            color: '#333',
            timerProgressBar: true
        });
        setTimeout(() => buscarProfessor(0), 1500);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com nosso suporte pelo telefone (xx) xxxx-xxxx.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 2000
        });
    }
}

function editarProfessor(id) {
    const cardProfessor = document.getElementById(`card_dados_${id}`);
    if (!cardProfessor) {
        console.error(`Card do professor com ID ${id} não encontrado.`);
        return;
    }

    const metaInput = cardProfessor.querySelector(`#meta_${id}`);
    const statusSelect = cardProfessor.querySelector(`#status_${id}`);
    const botaoEditar = cardProfessor.querySelector(`#editar_${id} img`);
    const lixeira = cardProfessor.querySelector(`#lixeira_${id}`);

    if (statusSelect) {
        statusSelect.removeAttribute("disabled");
        statusSelect.style.pointerEvents = "auto";
        statusSelect.style.opacity = "1";
        statusSelect.setAttribute("data-original-value", statusSelect.value);
    }

    if (metaInput) {
        if (statusSelect.value != "1") {
            metaInput.setAttribute("readonly", true);
        } else {
            metaInput.removeAttribute("readonly");
            metaInput.focus();
        }
    }

    if (lixeira) {
        lixeira.style.display = "flex";
    }

    if (botaoEditar) {
        botaoEditar.src = "../imgs/check.png";
        botaoEditar.alt = "Confirmar edição";
        botaoEditar.style.position = "relative";
        botaoEditar.style.bottom = "3.5vw";
        botaoEditar.onclick = () => confirmarEdicaoProfessor(id);
    } else {
        console.error('Botão de edição não encontrado.');
    }
}

function cancelarEdicaoProfessor(id) {
    const cardProfessor = document.getElementById(`card_dados_${id}`);
    if (!cardProfessor) {
        console.error(`Card do professor com ID ${id} não encontrado.`);
        return;
    }

    const metaInput = cardProfessor.querySelector(`#meta_${id}`);
    const statusSelect = cardProfessor.querySelector(`#status_${id}`);
    const botaoEditar = cardProfessor.querySelector(`#editar_${id} img`);
    const lixeira = cardProfessor.querySelector(`#lixeira_${id}`);

    if (metaInput && statusSelect && botaoEditar && lixeira) {
        metaInput.setAttribute("readonly", "true");
        statusSelect.setAttribute("disabled", "true");
        statusSelect.style.pointerEvents = "none";
        statusSelect.style.opacity = "0.5";

        lixeira.style.display = "none";

        botaoEditar.style.position = "relative";
        botaoEditar.style.bottom = "0";
        botaoEditar.src = "../imgs/pen.png";
        botaoEditar.alt = "Editar professor";
        botaoEditar.onclick = () => editarProfessor(id);
    } else {
        console.error('Algum elemento não foi encontrado dentro do card do professor');
    }
}

function confirmarEdicaoProfessor(id) {
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
            const cardProfessor = document.getElementById(`card_dados_${id}`);
            if (!cardProfessor) {
                console.error(`Card do professor com ID ${id} não encontrado.`);
                return;
            }

            const metaInput = cardProfessor.querySelector(`#meta_${id}`);
            const statusSelect = cardProfessor.querySelector(`#status_${id}`);
            const novaMeta = metaInput.value.split(" ")[0];

            let alteracoesFeitas = false;

            if (statusSelect.value !== statusSelect.getAttribute("data-original-value")) {
                const statusAtualizado = await atualizarStatus(id, statusSelect.value);
                if (statusAtualizado) alteracoesFeitas = true;
            }

            const metaAtualizada = await atualizarMetaProfessor(id, novaMeta);
            if (metaAtualizada) alteracoesFeitas = true;

            if (alteracoesFeitas) {
                Swal.fire({
                    title: "Alterações realizadas com sucesso!",
                    icon: "success",
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Nenhuma alteração foi feita.",
                    icon: "info",
                    timer: 1500
                });
            }
        }
        cancelarEdicaoProfessor(id);
        buscarProfessor(paginaAtual);
    });
}

async function atualizarMetaProfessor(id) {
    try {
        const meta = (document.getElementById(`meta_${id}`).value).split(" ")[0];

        const resposta = await fetch(`http://localhost:8080/api/metas/${id}`, {
            method: "PUT",
            body: meta,
            headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
        });

        return resposta.status === 201;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar a meta do professor',
            showConfirmButton: false,
            text: 'Por favor, tente novamente mais tarde.',
            footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
            timer: 2000
        });
        console.log(error);
        return false;
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
        Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar o status',
            text: 'Por favor, tente novamente mais tarde.',
            background: '#f2f2f2',
            color: '#333'
        });
        console.error("Erro ao atualizar o status:", error);
        return false;
    }
}

function atualizarBotoesPaginacaoProfessor(total, atual) {
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
        <a class="page-link" href="#" onclick="buscarProfessor(${atual - 1})" aria-disabled="${atual === 0}">
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
            <a class="page-link" href="#" onclick="buscarProfessor(${i})">${i + 1}</a>
        `;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    if (atual === total - 1) {
        proximo.classList.add('disabled');
    }
    proximo.innerHTML = `
        <a class="page-link" href="#" onclick="buscarProfessor(${atual + 1})" aria-disabled="${atual === total - 1}">
            Próximo &raquo;
        </a>
    `;
    paginacao.appendChild(proximo);

    paginaAtual = atual;
}

async function importarDados() {
    console.log("Botão clicado! Função importarDados() executada.");

    const file = importInput.files[0];

    if (!file) {
        console.error("Nenhum arquivo selecionado.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Envia o arquivo ao endpoint
        const response = await fetch('http://localhost:8080/api/archive/txt/usuarios', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        console.log(response)

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Aluno cadastrado com sucesso!",
                showConfirmButton: false,
                timer: 1500
            });
            console.log('Upload realizado com sucesso:', response);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao importar',
                showConfirmButton: false,
                text: 'Erro ao fazer o import de usuãrio.',
                footer: '<a href="mailto:support@eduivonatte.com">Precisa de ajuda? Clique aqui para enviar um e-mail para o suporte.</a>',
                timer: 2000
            });
            console.error('Erro ao enviar o arquivo:', response.statusText);
        }
    } catch (error) {
        console.error('Erro de rede ou servidor:', error);
    }
}

async function exportarDados() {
    console.log("Iniciando exportação de dados...");
    try {
        const response = await fetch(`http://localhost:8080/api/archive/csv/usuarios/${tipo}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Se necessário para autenticação
            }
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // Obtém o arquivo como um blob
        const blob = await response.blob();
        // Cria uma URL para o blob
        const url = window.URL.createObjectURL(blob);

        // Cria um elemento <a> para simular o clique
        const a = document.createElement('a');
        a.href = url;

        // Define o nome do arquivo a ser baixado
        const filename = `usuarios_${tipo}.csv`;
        a.download = filename;

        // Simula o clique no link
        document.body.appendChild(a);
        a.click();

        // Remove o link após o download
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log("Usuários salvos com sucesso.");
    } catch (error) {
        console.error('Erro ao exportar arquivo:', error);
        alert('Erro ao exportar o arquivo. Tente novamente mais tarde.');
    }
}

