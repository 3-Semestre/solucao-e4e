// Variáveis globais
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let selectedTime = null; // Armazena o horário selecionado

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

// Função para abrir o modal
function openModal(date) {
  clicked = date;
  const eventDay = events.find(event => event.date === clicked);

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
    // Se existe um evento para a data selecionada, preencher o modal de deletar evento
    document.getElementById('deleteDateInput').value = formatDate(clicked);
    document.getElementById('deleteProfessorInput').value = eventDay.professor;
    document.getElementById('deleteTimeInput').value = eventDay.time;
    document.getElementById('eventText').innerText = eventDay.title;
    
    statusElement.className = `status ${eventDay.status.toLowerCase()}`;
    statusElement.innerText = eventDay.status === 'PENDENTE' ? 'Agendamento pendente' :
                               eventDay.status === 'CONFIRMADO' ? 'Agendamento confirmado' :
                               eventDay.status === 'CONCLUIDO' ? 'Agendamento concluído' :
                               'Agendamento cancelado';

    deleteEventModal.style.display = 'block';
  } else {
    // Se não há evento para a data, abrir o modal de novo evento
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

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      dayS.innerText = i - paddingDays;

      const eventDay = events.find((event) => event.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        dayS.id = 'currentDay';
      }

      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}

// Adiciona alerta quando o usuário tenta alterar a data diretamente
dateInput.addEventListener('change', function() {
  alert('Para alterar a data, selecione-a no calendário.');
  dateInput.value = formatDate(clicked);
});

// Adiciona alerta quando o campo de entrada de data é clicado
dateInput.addEventListener('click', function() {
  alert('Para alterar a data, selecione-a no calendário.');
});

// Função para fechar o modal
function closeModal() {
  newEvent.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  clicked = null;
  selectedTime = null; // Limpa a seleção de horário
  load();
}

// Função para salvar um novo evento
function saveEvent() {
  const professorSelect = document.getElementById('professor-select');
  const horarioSelect = document.querySelector('.time-button.selected');

  console.log('Professor Selected:', professorSelect.value);
  console.log('Horario Selected:', horarioSelect);

  if (professorSelect.value && horarioSelect) {
    selectedTime = horarioSelect.getAttribute('data-time');

    events.push({
      date: clicked,
      professor: professorSelect.value,
      time: selectedTime,
      title: `${professorSelect.value} - ${selectedTime}`,
      status: 'PENDENTE', // Status padrão ao agendar
    });

    localStorage.setItem('events', JSON.stringify(events));

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
    cancelButtonColor: '#3085d6',
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

  document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');
      selectedTime = this.getAttribute('data-time');
      console.log('Selected time:', selectedTime);
    });
  });

  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', closeModal);
  });
}

buttons();
load();
