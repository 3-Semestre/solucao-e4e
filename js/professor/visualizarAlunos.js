var paginaAtual = 0;
var totalPaginas = 0;
const nivelAcesso = Number(sessionStorage.getItem('nivel_acesso_cod'));

async function buscarAlunos(paginaAtual) {
    if (paginaAtual < 0 || (totalPaginas > 0 && paginaAtual >= totalPaginas)) return; // Limita as páginas

    const cardsAlunos = document.getElementById("listagem_usuarios");

    const resposta = await fetch(`http://localhost:8080/usuarios/aluno/paginado?page=${paginaAtual}`, {
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

    cardsAlunos.innerHTML = "";
    cardsAlunos.innerHTML += listaAlunos.content.map((aluno) => {
        const alunoId = aluno.id; // ID do aluno para garantir unicidade

        // Converte as strings em arrays
        const niveisInglesArray = aluno.niveis_Ingles ? aluno.niveis_Ingles.split(", ") : [];
        const nichosArray = aluno.nichos ? aluno.nichos.split(", ") : [];

        return `
        <div class="dados-student" id="card_dados_${alunoId}">
            <div class="header-student">
                <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
                <p>${aluno.nome_completo}</p>
            </div>
            <br/><br/>
            <div class="form-student">
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
                </div>
            </div>
            
            <div class="lapis">
                <img src="../imgs/pen.png" alt="Editar aluno" style="width: 3vw; height: 6vh" onclick="editarAluno(${alunoId})">
            </div>
            ${nivelAcesso === 3 ? `
                <div class="lixeira">
                    <img src="../imgs/trash-bin.png" alt="Excluir aluno" style="width: 3vw; height: 6vh" onclick="confirmacaoDeleteAluno(${alunoId})">
                </div>
            ` : ''}
        </div>
        <hr class="line">
        `;
    }).join('');


    atualizarBotoesPaginacaoAluno(listaAlunos.totalPages, listaAlunos.pageable.pageNumber);

    // Esconde o GIF de carregamento
    const loadingGif = document.getElementById('loading');
    loadingGif.style.display = 'none';
}

async function filtraUsuarios() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const tipoNome = (tipo !== "aluno") ? "professor" : "aluno";

    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const nicho = document.getElementById("select_nicho").value;
    const nivel = document.getElementById("select_nivel").value;

    const data = {};    
    if (nome) data.nome = nome;
    if (cpf) data.cpf = cpf;
    if (nicho && nicho !== "") data.nicho = nicho;
    if (nivel && nivel !== "") data.nivelIngles = nivel;

    console.log("Filtro a ser buscado:", data);

    const cardsUsuarios = document.getElementById("listagem_usuarios");

    try {
        // Faz a requisição para o filtro
        const resposta = await fetch(`http://localhost:8080/usuarios/filtro/${tipoNome}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (resposta.status === 204) {
            cardsUsuarios.innerHTML = `<span>Não há ${tipoNome}s cadastrados...<span> <br/>Cadastre um novo clicando <a href='cadastrar.html?tipo=${tipoNome}'>aqui</a>`;
            return;
        }

        const listaUsuarios = await resposta.json();

        console.log(listaUsuarios)
        console.log('fafak',tipoNome)
        if (tipoNome === "aluno") {
            cardsUsuarios.innerHTML = listaUsuarios.content.map((aluno) => {
                const alunoId = aluno.id;
                return `
                <div class="dados-student" id="card_dados_${alunoId}">
                    <div class="header-student">
                        <img src="../imgs/perfil_blue.png" alt="Foto do Aluno">
                        <p>${aluno.nome_completo}</p>
                    </div>
                    <br/> <br/>
                    <div class="form-student">
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
                                <label class="label2" type="text" id="nivel-ingles_${alunoId}">${aluno.niveis_Ingles}</label>
                            </div>
                            <div class="form-group">
                                <label for="nicho_${alunoId}">Nicho:</label>
                                <label class="label2" type="text" id="nicho_${alunoId}">${aluno.nichos}</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lixeira" onclick="confirmacaoDeleteAluno(${alunoId})">
                        <img src="../imgs/trash-bin.png" alt="Excluir aluno" style="width: 3vw; height: 6vh">
                    </div>
                </div>
                <hr class="line">
                `;
            }).join('');
        }

        console.log('tipo nome', tipoNome)
        if (tipoNome === "professor") {
            console.log('opa')
            cardsUsuarios.innerHTML = listaUsuarios.content.map((professor) => {
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
        
                <div class="course-information">
                        <div class="form-group">
                            <label for="meta_${professorId}">Metas:</label>
                            <input class="label2" type="text" id="meta_${professorId}" value="${professor.qtd_aula} aulas" readonly>
                        </div>
                </div>
        
                ${nivelAcesso === 3 ? `
                    <div class="lapis-professor">
                        <img src="../imgs/pen.png" alt="Editar professor" style="width: 3vw; height: 6vh" onclick="editarProfessor(${professorId})">
                    </div>
                    <div class="lixeira-professor" onclick="confirmacaoDeleteProfessor(${professorId})">
                        <img src="../imgs/trash-bin.png" alt="Excluir professor" style="width: 3vw; height: 6vh">
                    </div>
                    ` : ''}
              </div>
              <hr class="line">
            `;
            }).join('');
        }
       

    } catch (error) {
        console.error("Erro ao filtrar usuários:", error);
        cardsUsuarios.innerHTML = `<span>Ocorreu um erro ao buscar os usuários. Por favor, tente novamente mais tarde.</span>`;
    }
}

function confirmacaoDeleteAluno(id) {
    Swal.fire({
        title: "Deseja excluir esse aluno?",
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
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis img`);
    const botaoExcluir = document.querySelector(`#card_dados_${id} .lixeira img`);

    if (nivelSelect) {
        nivelSelect.removeAttribute("disabled");
        nivelSelect.focus();
        buscarNivel(nivelSelect);
    }

    if (nichoSelect) {
        nichoSelect.removeAttribute("disabled");
        buscarNicho(nichoSelect);
    }

    botaoEditar.src = "../imgs/check.png";
    botaoEditar.alt = "Confirmar edição";
    botaoEditar.onclick = () => confirmarEdicao(id);

    botaoExcluir.src = "../imgs/cancel.png";
    botaoExcluir.alt = "Cancelar edição";
    botaoExcluir.onclick = () => cancelarEdicao(id);
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
            const nivelAtualizado = await atualizarNivel(id);
            const nichoAtualizado = await atualizarNicho(id);

            if (nivelAtualizado && nichoAtualizado) {
                Swal.fire({
                    title: "Aluno atualizado com sucesso!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f2f2f2',
                    color: '#333',
                    timerProgressBar: true
                });
            }
        }
        cancelarEdicao(id);
    });
}

function cancelarEdicao(id) {
    const nivelSelect = document.getElementById(`nivel-ingles_${id}`);
    const nichoSelect = document.getElementById(`nicho_${id}`);
    const botaoEditar = document.querySelector(`#card_dados_${id} .lapis img`);
    const botaoExcluir = document.querySelector(`#card_dados_${id} .lixeira img`);

    botaoEditar.classList.add("trocando");
    botaoExcluir.classList.add("trocando");

    nivelSelect.setAttribute("disabled", "true");
    nichoSelect.setAttribute("disabled", "true");

    botaoEditar.src = "../imgs/pen.png";
    botaoEditar.alt = "Editar aluno";
    botaoEditar.onclick = () => editarAluno(id);

    botaoExcluir.src = "../imgs/trash-bin.png";
    botaoExcluir.alt = "Excluir aluno";
    botaoExcluir.onclick = () => confirmacaoDeleteAluno(id);
}

async function deletarAluno(id) {
    const respostaDelete = await fetch(`http://localhost:8080/usuarios/aluno/${id}`, {
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
    anterior.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${atual - 1})">&laquo;</a>`;
    paginacao.appendChild(anterior);

    for (let i = 0; i < total; i++) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (i === atual) {
            item.classList.add('active'); // Marca a página atual
        }
        item.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${i})">${i + 1}</a>`;
        paginacao.appendChild(item);
    }

    const proximo = document.createElement('li');
    proximo.classList.add('page-item');
    proximo.innerHTML = `<a class="page-link" href="#" onclick="buscarAlunos(${atual + 1})">&raquo;</a>`;
    paginacao.appendChild(proximo);
}

async function buscarNivel(selectElement) {
    const textoSelecionado = selectElement.options[selectElement.selectedIndex]?.textContent;

    const resposta = await fetch("http://localhost:8080/nivel-ingles", {
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

    const resposta = await fetch("http://localhost:8080/nichos", {
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
        var resposta = await fetch(`http://localhost:8080/usuario-nivel-ingles/${id}`, {
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
        var resposta = await fetch(`http://localhost:8080/usuario-nicho/${id}`, {
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