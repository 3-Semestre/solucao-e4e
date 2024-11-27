var paginaAtual = 0;
var totalPaginas = 0;

const id = sessionStorage.getItem('id')
const token = sessionStorage.getItem('token')

async function buscarProfessor(paginaAtual) {
    if (paginaAtual < 0 || (totalPaginas > 0 && paginaAtual >= totalPaginas)) return; // Limita as páginas

    const cardsProfessor = document.getElementById("listagem_usuarios");

    const resposta = await fetch(`http://localhost:8080/usuarios/professor/paginado?page=${paginaAtual}` + Filters.buildQueryString(), {
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
        console.log(professor)
        const professorId = professor.id; // ID do professor para garantir unicidade

        return `
      <div class="dados-student" id="card_dados_${professorId}">
        <div class="header-student">
            <img src="../imgs/perfil_blue.png" alt="Foto do professor">
            <p>${professor.nome_completo}</p>
        </div>
        <br/>
        <br/>
        <div class="form-student">
            <div class="personal-information ${professor.status === "INATIVO" ? "inativo" : ""}">
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

            <div class="course-information ${professor.status === "INATIVO" ? "inativo" : ""}">
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
            <div class="form-group">
                <label for="status_${professorId}">Status:</label>
                <label class="label2" type="text" id="status_${professorId}"> ${tratarNome(professor.status)} </label>
        </div>
    </div>
</div>

    

        ${nivelAcesso === 3 ? `
            <div class="lixeira-professor" >
                <img src="../imgs/trash-bin.png" onclick="confirmacaoDeleteProfessor(${professorId})" alt="Excluir professor" style="width: 3vw; height: 6vh">
            </div>
            <div class="lapis-professor">
                <img src="../imgs/pen.png" alt="Editar professor" style="width: 3vw; height: 6vh" onclick="editarProfessor(${professorId})">
            </div>
            ` : ''}
      </div>
      <hr class="line">
    `;
    }).join('');

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
    const respostaDelete = await fetch(`http://localhost:8080/usuarios/Professor/${id}`, {
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
    const metaInput = document.getElementById(`meta_${id}`);
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis-professor img`);
    const botaoExcluir = document.querySelector(`#card_dados_${id} .lixeira-professor img`);

    // Permite edição no campo de meta
    if (metaInput) {
        metaInput.removeAttribute("readonly");
        metaInput.focus();
    }

    // Troca os ícones de editar para confirmar e excluir para cancelar
    botaoEditar.src = "../imgs/check.png";
    botaoEditar.alt = "Confirmar edição";
    botaoEditar.onclick = () => confirmarEdicaoProfessor(id);

    // Troca o ícone e a função do botão de excluir para cancelar
    botaoExcluir.src = "../imgs/cancel.png";
    botaoExcluir.alt = "Cancelar edição";
    botaoExcluir.onclick = () => cancelarEdicaoProfessor(id);
}

function confirmarEdicaoProfessor(id) {
    const metaInput = document.getElementById(`meta_${id}`);
    const novaMeta = metaInput.value;

    Swal.fire({
        title: "Deseja confirmar a nova meta?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#072B59',
        cancelButtonColor: '#830f0f',
        background: '#f2f2f2',
        color: '#333'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const sucesso = await atualizarMetaProfessor(id, novaMeta);
            if (sucesso) {
                Swal.fire({
                    title: "Meta atualizada com sucesso!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f2f2f2',
                    color: '#333',
                    timerProgressBar: true
                });
            }
            cancelarEdicaoProfessor(id);
        }
    });
}

function cancelarEdicaoProfessor(id) {
    const metaInput = document.getElementById(`meta_${id}`);
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis-professor img`);
    const botaoExcluir = document.querySelector(`#card_dados_${id} .lixeira-professor img`);

    metaInput.setAttribute("readonly", "true");

    botaoEditar.src = "../imgs/pen.png";
    botaoEditar.alt = "Editar professor";
    botaoEditar.onclick = () => editarProfessor(id);

    // Restaura o ícone e função do botão de excluir
    botaoExcluir.src = "../imgs/trash-bin.png";
    botaoExcluir.alt = "Excluir professor";
    botaoExcluir.onclick = () => confirmacaoDeleteProfessor(id);
    buscarProfessor(paginaAtual);
}

async function atualizarMetaProfessor(id) {
    try {
        const meta = (document.getElementById(`meta_${id}`).value).split(" ")[0];

        const resposta = await fetch(`http://localhost:8080/metas/${id}`, {
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
