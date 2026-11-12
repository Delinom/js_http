const BASE_URL = 'http://localhost:7070';

export async function fetchAllTickets() {
  try {
    const res = await fetch(`${BASE_URL}/?method=allTickets`);
    if (!res.ok) throw new Error('Ошибка получения тикетов');
    return res.json();
  } catch (e) {
    throw new Error('Ошибка получения тикетов');
  }
}

export async function createTicket(name, description) {
  try {
    const res = await fetch(`${BASE_URL}/?method=createTicket`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, description, status: false }),
    });
    if (!res.ok) throw new Error('Ошибка создания тикета');
    return res.json();
  } catch (e) {
    throw new Error('Ошибка создания тикета');
  }
}

export async function deleteTicketById(id) {
  try {
    const res = await fetch(`${BASE_URL}/?method=deleteById&id=${id}`);
    if (!res.ok) throw new Error('Ошибка удаления тикета');
  } catch (e) {
    throw new Error('Ошибка удаления тикета');
  }
}

export async function updateTicketById(id, name, description, status) {
  try {
    const res = await fetch(`${BASE_URL}/?method=updateById&id=${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, description, status }),
    });
    if (!res.ok) throw new Error('Ошибка изменения');
    return res.json();
  } catch (e) {
    throw new Error('Ошибка изменения');
  }
}

export async function fetchTicketDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/?method=ticketById&id=${id}`);
    if (!res.ok) throw new Error('Ошибка подробностей');
    return res.json();
  } catch (e) {
    throw new Error('Ошибка подробностей');
  }
}