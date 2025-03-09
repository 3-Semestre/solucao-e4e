// Variáveis globais
const token = sessionStorage.getItem('token');
let nav = 0;
let clicked = null;
let selectedTime = null; // Armazena o horário selecionado
const professorSelect = document.getElementById('professor-select');
const divHorarios = document.getElementById("div-horarios");
let events = []; // Lista de eventos

// Variáveis do modal
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const dateInput = document.getElementById('dateInput');

// Elementos do calendário
const calendar = document.getElementById('calendar');
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

// Função para formatar a data no formato DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return dateString;

  // Verifica se a data está no formato AAAA-MM-DD
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // Caso contrário, assume que está no formato MM/DD/AAAA
  const [month, day, year] = dateString.split('/');
  if (!month || !day || !year) return dateString;

  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

function undoFormatDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

// Função para abrir o modal
function openModal(date, id) {
  const today = new Date();
  const selectedDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  clicked = date;

  const eventDay = events.find(event => event.data === clicked);
  document.getElementById('deletar-button').addEventListener('click', () => deleteEvent(eventDay.id));

  document.getElementById('professor-select').value = '';
  document.querySelectorAll('.time-button').forEach(button => button.classList.remove('selected'));
  selectedTime = null;

  dateInput.value = formatDate(clicked);

  document.getElementById('deleteDateInput').value = '';
  document.getElementById('deleteProfessorInput').value = '';
  document.getElementById('deleteTimeInput').value = '';
  document.getElementById('eventText').innerText = '';
  const statusElement = document.getElementById('deleteStatus');
  statusElement.className = 'status';

  if (eventDay && eventDay.status != "CANCELADO") {
    document.getElementById('deleteDateInput').value = formatDate(clicked);
    document.getElementById('deleteProfessorInput').value = eventDay.professor.nomeCompleto;
    document.getElementById('deleteTimeInput').value = `${formatarHorario(eventDay.horarioInicio)} - ${formatarHorario(eventDay.horarioFim)}`;
    document.getElementById('eventText').innerText = eventDay.assunto;
    if (eventDay.status === "CONCLUIDO") {
      document.getElementById('deletar-button').style.display = 'none';
    } else{
      document.getElementById('deletar-button').style.display = 'block';
    }
    statusElement.className = `status ${eventDay.status.toLowerCase()}`;
    statusElement.innerText = getEventStatusText(eventDay.status);

    deleteEventModal.style.display = 'block';
  } else {
    if (selectedDate < today) {
      Swal.fire({
        title: 'Erro',
        text: 'Não é possível selecionar uma data anterior a de hoje.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#830f0f',
        background: '#f2f2f2',
        color: '#333'
      });
      return;
    }
    buscarProfessores();
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

// Função para obter o texto do status do evento
function getEventStatusText(status) {
  return status === 'PENDENTE' ? 'Agendamento pendente' :
    status === 'CONFIRMADO' ? 'Agendamento confirmado' :
      status === 'CONCLUIDO' ? 'Agendamento concluído' :
        'Agendamento cancelado';
}

function load() {
  const date = new Date();
  console.log(date)

  // Ajusta o mês com base na navegação
  date.setMonth(date.getMonth() + nav);
  console.log(nav)
  console.log(date)

  const year = date.getFullYear();
  const month = date.getMonth();

  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);

  const dateString = firstDayMonth.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  let monthName = firstDayMonth.toLocaleDateString('pt-BR', { month: 'long' });
  monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  document.getElementById('monthDisplay').innerText = `${monthName} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    const dayString = `${year}-${(month + 1).toString().padStart(2, '0')}-${(i - paddingDays).toString().padStart(2, '0')}`;

    if (i > paddingDays) {
      const dayNumber = document.createElement('span');
      dayNumber.innerText = i - paddingDays;
      dayS.appendChild(dayNumber);

      const eventDay = events.find((event) => event.data === dayString);

      if (i - paddingDays === date.getDate() && nav === 0 && month === date.getMonth() && year === date.getFullYear()) {
        dayNumber.id = 'currentDay';
      }

      if (eventDay && eventDay.status !== "CANCELADO") {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerHTML = "Professor: <br>" + eventDay.professor.nomeCompleto;
        dayS.appendChild(eventDiv);
        dayS.addEventListener('click', () => openModal(dayString, eventDay.id));
      } else {
        dayS.addEventListener('click', () => openModal(dayString));
      }
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}

// Função para fechar o modal
function closeModal() {
  newEvent.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  divHorarios.innerHTML = "";
  professorSelect.innerHTML = '<option value="" disabled selected>Selecione um professor</option>';
  clicked = null;
  selectedTime = null;
  load();
}

// Função para buscar professores
async function buscarProfessores() {
  try {
    const response = await fetch('http://localhost:8080/api/usuarios/professor', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const professores = await response.json();
      professores.forEach(professor => {
        const option = document.createElement('option');
        option.value = professor.id;
        option.innerText = professor.nomeCompleto;
        professorSelect.appendChild(option);
      });
    } else {
      Swal.fire({
        title: 'Erro',
        text: 'Não há professores cadastrados.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
        background: '#f2f2f2',
        color: '#333'
      });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

professorSelect.addEventListener('change', async (event) => {
  const selectedProfessor = event.target.value;
  console.log("Data selecionada: " + dateInput.value);
  const data = undoFormatDate(dateInput.value)
  console.log(data)
  try {
    const response = await fetch(`http://localhost:8080/api/horario-professor/disponiveis/${selectedProfessor}?dia=${data}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const professorData = await response.json();
      console.log('Horários disponíveis:', professorData);
      divHorarios.innerHTML = ''; // Limpa os horários anteriores

      professorData.forEach(horario => {
        const horarioBtn = document.createElement('button');
        horarioBtn.classList.add('time-button');
        horarioBtn.setAttribute('data-time', `${horario.horario_inicio} - ${horario.horario_fim}`);
        horarioBtn.innerText = `${formatarHorario(horario.horario_inicio)} - ${formatarHorario(horario.horario_fim)}`;
        divHorarios.appendChild(horarioBtn);
      });

      // Adicionar evento de clique para selecionar o horário
      document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', function () {
          document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
          this.classList.add('selected');
          selectedTime = this.getAttribute('data-time');
        });
      });
    } else {
      console.error('Erro ao buscar dados do professor');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
});

// Função para salvar um novo evento
async function saveEvent() {
  const professorSelecionado = professorSelect.value;
  const horarioSelecionado = selectedTime;
  
  if (professorSelecionado && horarioSelecionado) {
    try {
      await salvarAgendamento(professorSelecionado, horarioSelecionado);
      const professorNome = professorSelect.options[professorSelect.selectedIndex].text;
      Swal.fire({
        title: 'Agendamento realizado com sucesso!',
        html: `<p>A aula com o professor <strong>${professorNome}</strong> foi agendada para <strong>${dateInput.value}</strong> às <strong>${selectedTime}</strong>.</p>`,
        icon: 'success',
        showConfirmButton: false, // Remove o botão de confirmação
        timer: 2000,
        background: '#f2f2f2',
        color: '#333'
      }).then(() => closeModal());
    } catch (error) {
      console.log('Erro ao salvar agendamento:', error);
    }
  } else {
    Swal.fire({
      title: 'Erro',
      text: 'Preencha todos os campos e selecione um horário.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: 'red',
      background: '#f2f2f2',
      color: '#333'
    });
  }
}

// Função para salvar um novo agendamento
async function salvarAgendamento(professorId, horario) {
  const [horarioInicio, horarioFim] = horario.split(" - ");

  let agendamento = {
    "data": undoFormatDate(dateInput.value),
    "horarioInicio": horarioInicio.trim(),
    "horarioFim": horarioFim.trim(),
    "fk_professor": professorId,
    "fk_aluno": Number(sessionStorage.getItem('id'))
  };

  try {
    const respostaAgendamento = await fetch("http://localhost:8080/api/agendamento", {
      method: "POST",
      body: JSON.stringify(agendamento),
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const respostaJson = await respostaAgendamento.json();

    if (respostaAgendamento.status === 201) {
      console.log("Agendamento realizado com sucesso!");
      const agendamentoId = respostaJson.id;
      pushAgendamentoStack(agendamentoId);
      localStorage.setItem('exibirAlerta', true)
      setTimeout("location.href = 'agendamentos.html?tipo=futuro'", 2000);
    } else {
      console.log("Erro ao realizar o agendamento:", respostaAgendamento.status);
    }
  } catch (error) {
    console.log("Erro na requisição:", error);
  }
}

// Função para deletar um evento
function deleteEvent(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você deseja cancelar este agendamento?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, cancelar',
    cancelButtonText: 'Não, manter',
    confirmButtonColor: '#830f0f',
    cancelButtonColor: '#072B59',
    background: '#f2f2f2',
    color: '#333'
  }).then(result => {
    if (result.isConfirmed) {
      if (cancelarAgendamento(id)) {
        Swal.fire({
          title: 'Cancelado!',
          text: 'O agendamento foi cancelado com sucesso.',
          icon: 'success',
          background: '#f2f2f2',
          color: '#333',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          closeModal()
          carregarEventos()
        });
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Houve um erro ao cancelar o agendamento.',
          icon: 'error',
          background: '#f2f2f2',
          color: '#333',
          timer: 2000,
          showConfirmButton: false
        }).then(() => closeModal());
      }
    }
  });
}

async function cancelarAgendamento(id) {
  try {
    const respostaAgendamento = await fetch(`http://localhost:8080/api/agendamento/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    agendamento = await respostaAgendamento.json()

    const respostaStatus = await fetch(`http://localhost:8080/api/status/4`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    statusObj = await respostaStatus.json()

    const dadosAlteracao = {
      "novoAgendamento": agendamento,
      "status": statusObj
    }

    const novoStatus = await fetch("http://localhost:8080/api/historico-agendamento", {
      method: "POST",
      body: JSON.stringify(dadosAlteracao),
      headers: { 'Authorization': `Bearer ${token}`, "Content-type": "application/json; charset=UTF-8" }
    });

    console.log(novoStatus.status)
  } catch (error) {
    console.log(error)
  }
}

// Funções adicionais
// Função para carregar os agendamentos e exibi-los no calendário
async function carregarEventos() {
  try {
    // Calcular o mês e ano com base na navegação (nav)
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + nav); // Ajusta o mês com base na navegação
    const currentMonth = currentDate.getMonth() + 1; // O mês é baseado em zero, então somamos 1
    const currentYear = currentDate.getFullYear();

    const response = await fetch(`http://localhost:8080/api/agendamento/1/${sessionStorage.getItem('id')}/${currentMonth}/${currentYear}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      console.error('Não há agendamentos');
      events = [];
    } else if (response.ok) {
      const dados = await response.json();
      events = Array.isArray(dados) ? dados : [];
      console.log('Eventos carregados:', events);
    } else {
      console.error('Erro ao carregar eventos do banco');
      events = [];
    }
    load();
  } catch (error) {
    console.error('Erro na requisição:', error);
    events = [];
    load();
  }
}

// Função para adicionar os eventos aos botões
function buttons() {
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    carregarEventos();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    carregarEventos();
  });

  document.getElementById('agendar-button').addEventListener('click', saveEvent);
  document.getElementById('cancelar-button').addEventListener('click', closeModal);
  document.getElementById('fechar-button').addEventListener('click', closeModal);

  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', closeModal);
  });
}

// Chama as funções principais
buttons();
carregarEventos();