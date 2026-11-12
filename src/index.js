import './styles.css';
import {
  fetchAllTickets, createTicket, deleteTicketById,
  updateTicketById, fetchTicketDetails
} from './api';

const list = document.getElementById('ticket-list');
const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const modalCancel = document.getElementById('modal-cancel');
const addTicketBtn = document.getElementById('add-ticket-btn');
const modalTitle = document.getElementById('modal-title');
const confirmModal = document.getElementById('confirm-modal');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmOk = document.getElementById('confirm-ok');

let idToDelete = null;
let editingTicketId = null;

function showError(error) {
  const msg = error?.message || error?.toString?.() || String(error);
  alert('Ошибка: ' + msg);
}

function errorHandled(fn) {
  return async function(...args) {
    try {
      await fn.apply(this, args);
    } catch (e) {
      showError(e);
    }
  }
}

const renderTickets = errorHandled(async function() {
  const tickets = await fetchAllTickets();
  list.innerHTML = '';
  tickets.forEach(ticket => {
    const el = document.createElement('div');
    el.className = 'ticket';
    el.innerHTML = `
      <div class="ticket-left">
        <input type="checkbox" class="ticket-status" ${ticket.status ? 'checked' : ''} data-id="${ticket.id}">
        <span class="ticket-name" data-id="${ticket.id}">${ticket.name}</span>
      </div>
      <div class="ticket-right">
        <span class="ticket-date">${new Date(ticket.created).toLocaleString()}</span>
        <button class="edit-btn" data-id="${ticket.id}" title="Редактировать">✎</button>
        <button class="delete-btn" data-id="${ticket.id}" title="Удалить">✖</button>
      </div>
      <div class="full-desc" id="desc-${ticket.id}" style="display:none"></div>
    `;
    if (ticket.status) {
      el.querySelector('.ticket-name').classList.add('completed');
    };
    list.appendChild(el);
  });
});

document.addEventListener('DOMContentLoaded', renderTickets);

addTicketBtn.addEventListener('click', () => {
  editingTicketId = null;
  modalForm.reset();
  modalTitle.textContent = "Создать тикет";
  modal.classList.remove('hidden');
});

modalCancel.addEventListener('click', () => {
  modal.classList.add('hidden');
  editingTicketId = null;
});

confirmCancel.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  idToDelete = null;
});

confirmOk.addEventListener('click', errorHandled(async () => {
  if (idToDelete) {
    await deleteTicketById(idToDelete);
    await renderTickets();
    idToDelete = null;
  }
  confirmModal.classList.add('hidden');
}));

modalForm.addEventListener('submit', errorHandled(async (e) => {
  e.preventDefault();
  const formData = new FormData(modalForm);
  const name = formData.get('name');
  const description = formData.get('description');
  if (editingTicketId) {
    const dt = await fetchTicketDetails(editingTicketId);
    await updateTicketById(editingTicketId, name, description, dt.status);
  } else {
    await createTicket(name, description);
  }
  modal.classList.add('hidden');
  editingTicketId = null;
  await renderTickets();
}));

list.addEventListener('click', errorHandled(async (e) => {
  const { id } = e.target.dataset;
  if (!id) return;

  if (e.target.classList.contains('delete-btn')) {
    idToDelete = id;
    confirmModal.classList.remove('hidden');
    return;
  }

  if (e.target.classList.contains('edit-btn')) {
    editingTicketId = id;
    const dt = await fetchTicketDetails(id);
    modalForm.name.value = dt.name;
    modalForm.description.value = dt.description;
    modalTitle.textContent = "Изменить тикет";
    modal.classList.remove('hidden');
  }

  if (e.target.classList.contains('ticket-name')) {
    const descDiv = document.getElementById(`desc-${id}`);
    // toggle
    if (descDiv.style.display === 'none') {
      const dt = await fetchTicketDetails(id);
      descDiv.textContent = dt.description;
      descDiv.style.display = 'block';
    } else {
      descDiv.style.display = 'none';
    }
  }
}));

list.addEventListener('change', errorHandled(async (e) => {
  if (e.target.classList.contains('ticket-status')) {
    const id = e.target.dataset.id;
    const dt = await fetchTicketDetails(id);
    await updateTicketById(id, dt.name, dt.description, e.target.checked);
    await renderTickets();
  }
}));
