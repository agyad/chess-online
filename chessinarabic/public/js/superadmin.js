function getFormValues() {
  return {
    id: document.getElementById('id').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    email: document.getElementById('email').value,
  };
}

// GET User
document.getElementById('getBtn').addEventListener('click', async () => {
  const { id } = getFormValues();
  try {
    const res = await fetch(
      'http://127.0.0.1:3000/chessinarabic/superadmin/' + id,
      {
        method: 'GET',
      }
    );
    const data = await res.json();

    if (data.status) {
      document.getElementById('rate').textContent = data.data.rate || '-';
      document.getElementById('games').textContent =
        data.data.games.length || '-';
      document.getElementById('createdAt').textContent =
        data.data.createdAt || '-';
      document.getElementById('wins').textContent = data.data.wins || '-';
      document.getElementById('loss').textContent = data.data.loss || '-';
      document.getElementById('drew').textContent = data.data.drew || '-';
      document.getElementById('visits').textContent = data.data.visits || '-';
      document.getElementById('infoUsername').textContent =
        data.data.username || '-';
      document.getElementById('infoEmail').textContent = data.data.email || '-';
      document.getElementById('WinsRate').textContent =
        `${data.data.WinsRate}%` || '-';

      document.getElementById('extraFields').classList.remove('hidden');
    }
  } catch (err) {
    alert('Error fetching user info');
  }
});

document.getElementById('createBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const { id, username, password, email } = getFormValues();
  try {
    const res = await fetch('http://127.0.0.1:3000/chessinarabic/superadmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });
    const data = await res.json();
    if (!data.status) window.alert(data.message);
  } catch {}
});

document.getElementById('deleteBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const { id } = getFormValues();
  console.log(id);
  try {
    const res = await fetch(
      'http://127.0.0.1:3000/chessinarabic/superadmin/' + id,
      {
        method: 'DELETE',
      }
    );
    const data = await res.json();
  } catch {}
});
