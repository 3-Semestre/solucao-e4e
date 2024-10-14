// Variáveis globais
let nav = 0;
let clicked = null;
var eventDay;
let selectedTime = null; // Armazena o horário selecionado
const professorSelect = document.getElementById('professor-select');
const divHorarios = document.getElementById("div-horarios");

// Variáveis do modal
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const dateInput = document.getElementById('dateInput');

// Elementos do calendário
const calendar = document.getElementById('calendar');
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

// Função para formatar a data no formato YYYY-MM-DD
function formatDate(dateString) {
  const [month, day, year] = dateString.split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

function undoFormatDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

// Função para abrir o modal
function openModal(date) {
  const today = new Date();
  const selectedDate = new Date(date);

  // Removendo horas para garantir que as comparações sejam feitas apenas com base em dia/mês/ano
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  clicked = date;
  
  // Comparando diretamente a data no formato YYYY-MM-DD
  const eventDay = events.find(event => {
    const eventDateString = event.data; // Já está no formato correto 'YYYY-MM-DD'
    return eventDateString === clicked; // Comparação direta com a data clicada
  });

  // Limpar todos os campos do modal de novo evento
  document.getElementById('professor-select').value = '';
  document.querySelectorAll('.time-button').forEach(button => button.classList.remove('selected'));
  selectedTime = null; // Limpar o horário selecionado

  // Definir a data selecionada no campo do modal
  dateInput.value = formatDate(clicked);

  // Limpar campos do modal de deletar evento
  document.getElementById('deleteDateInput').value = '';
  document.getElementById('deleteProfessorInput').value = '';
  document.getElementById('deleteTimeInput').value = '';
  document.getElementById('eventText').innerText = '';
  const statusElement = document.getElementById('deleteStatus');
  statusElement.className = 'status'; // Limpar a classe de status

  if (eventDay) {
    console.log("Evento encontrado");
    document.getElementById('deleteDateInput').value = formatDate(clicked);
    document.getElementById('deleteProfessorInput').value = eventDay.professor.nomeCompleto;
    document.getElementById('deleteTimeInput').value = `${formatarHorario(eventDay.horarioInicio)} - ${formatarHorario(eventDay.horarioFim)}`;
    console.log(eventDay)
    document.getElementById('eventText').innerText = eventDay.assunto;

    statusElement.className = `status ${eventDay.status.toLowerCase()}`;
    statusElement.innerText = eventDay.status === 'PENDENTE' ? 'Agendamento pendente' :
      eventDay.status === 'CONFIRMADO' ? 'Agendamento confirmado' :
        eventDay.status === 'CONCLUIDO' ? 'Agendamento concluído' :
          'Agendamento cancelado';

    deleteEventModal.style.display = 'block';
  } else {
    console.log("Evento não encontrado");
    buscarProfessores();
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}



function load() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);

  const dateString = firstDayMonth.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  let monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
  monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  document.getElementById('monthDisplay').innerText = `${monthName} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    // Formatando corretamente a data no formato 'YYYY-MM-DD'
    const dayString = `${year}-${(month + 1).toString().padStart(2, '0')}-${(i - paddingDays).toString().padStart(2, '0')}`;

    if (i > paddingDays) {
      dayS.innerText = i - paddingDays;

      const eventDay = events.find(event => {
        return event.data === dayString; // Comparação direta no formato correto
      });

      if (i - paddingDays === day && nav === 0) {
        dayS.id = 'currentDay';
      }

      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.assunto;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}


// Adiciona alerta quando o campo de entrada de data é clicado
dateInput.addEventListener('click', function () {
  alert('Para alterar a data, selecione-a no calendário.');
});

// Função para fechar o modal
function closeModal() {
  newEvent.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  divHorarios.innerHTML = "";
  professorSelect.innerHTML = '<option value="" disabled selected>Selecione um professor</option>';
  clicked = null;
  selectedTime = null; // Limpa a seleção de horário
  load();
}

async function buscarProfessores() {
  repostaBuscaProfessor = await fetch('http://localhost:8080/usuarios/professor', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  if (repostaBuscaProfessor.status == 204) {
    Swal.fire({
      title: 'Erro',
      text: 'Não há professores cadastrados.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: 'red',
      background: '#f2f2f2',
      color: '#333'
    });
    return
  } else if (repostaBuscaProfessor.status == 200) {
    const professores = await repostaBuscaProfessor.json();
    console.log(professores)

    professores.forEach(professor => {
      const option = document.createElement('option');
      option.value = professor.id;
      option.innerText = professor.nomeCompleto;
      professorSelect.appendChild(option);
    });
  }

}

professorSelect.addEventListener('change', async (event) => {
  const selectedProfessor = event.target.value;
  console.log("data selecionada " + dateInput.value);
  try {
    const response = await fetch(`http://localhost:8080/horario-professor/disponiveis/${selectedProfessor}?dia=${dateInput.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const professorData = await response.json();

      console.log('Horarios disponiveis:', professorData);
      professorData.forEach(horario => {
        const horarioBtn = document.createElement('button');
        horarioBtn.classList.add('time-button');
        horarioBtn.setAttribute('data-time', `${horario.horario_inicio} - ${horario.horario_fim}`);
        horarioBtn.innerText = `${formatarHorario(horario.horario_inicio)} - ${formatarHorario(horario.horario_fim)}`;
        divHorarios.appendChild(horarioBtn)
      });

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
function saveEvent() {
  const professorSelecionado = document.getElementById('professor-select').value;
  const horarioSelecionado = document.querySelector('.time-button.selected').getAttribute('data-time');
  console.log(horarioSelecionado)
  console.log(professorSelecionado)

  if (professorSelecionado != null && horarioSelecionado != null) {
    console.log(horarioSelecionado)
    try {
      salvarAgendamento(professorSelecionado, horarioSelecionado);

      Swal.fire({
        title: 'Agendamento realizado com sucesso!',
        html: `
        <p>A aula com o professor <strong>${professorSelect.value}</strong> foi agendada para <strong>${dateInput.value}</strong> às <strong>${selectedTime}</strong>.</p>
      `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'green',
        background: '#f2f2f2',
        color: '#333'
      }).then(() => {
        closeModal(); // Fechar o modal após confirmação
      });

    } catch (error) {
      console.log(error)
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

// Função para deletar um evento
function deleteEvent() {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Você deseja cancelar este agendamento?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, cancelar',
    cancelButtonText: 'Não, manter',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#072B59',
    background: '#f2f2f2',
    color: '#333'
  }).then((result) => {
    if (result.isConfirmed) {
      events = events.filter((event) => event.date !== clicked);
      localStorage.setItem('events', JSON.stringify(events));

      Swal.fire({
        title: 'Cancelado!',
        text: 'O agendamento foi cancelado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'green',
        background: '#f2f2f2',
        color: '#333'
      }).then(() => {
        closeModal();
        load();
      });
    } else {
      Swal.fire({
        title: 'Cancelado',
        text: 'O agendamento não foi cancelado.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        background: '#f2f2f2',
        color: '#333'
      });
    }
  });
}

// Função para adicionar os eventos aos botões
function buttons() {
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('agendar-button').addEventListener('click', saveEvent);
  document.getElementById('cancelar-button').addEventListener('click', closeModal);
  document.getElementById('deletar-button').addEventListener('click', deleteEvent);
  document.getElementById('fechar-button').addEventListener('click', closeModal);

  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', closeModal);
  });
}
buttons();
carregarEventos();

async function salvarAgendamento(professorId, horario) {
  const [horarioInicio, horarioFim] = horario.split(" - ");

  let agendamentos = {
    "data": undoFormatDate(dateInput.value),
    "horarioInicio": horarioInicio.trim(),
    "horarioFim": horarioFim.trim(),
    "fk_professor": professorId,
    "fk_aluno": Number(sessionStorage.getItem('id'))
  };

  try {
    const respostaAgendamento = await fetch("http://localhost:8080/agendamento", {
      method: "POST",
      body: JSON.stringify(agendamentos),
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`, "Content-type": "application/json; charset=UTF-8" }
    });

    if (respostaAgendamento == 201) {
      console.log("tudo joia")
    }
    console.log(respostaAgendamento)
  } catch (error) {
    console.log("Erro! " + error)
  }
}

async function carregarEventos() {
  try {
    const response = await fetch(`http://localhost:8080/agendamento/1/${sessionStorage.getItem('id')}?page=0&size=5&sortDirection=desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const dados = await response.json();
      console.log(dados);

      events = Array.isArray(dados.content) ? dados.content : [];
      console.log('Eventos carregados:', events);

      load();
    } else {
      console.error('Erro ao carregar eventos do banco');
      events = [];
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    events = [];
  }
}

