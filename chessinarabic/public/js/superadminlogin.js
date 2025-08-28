document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch(
      'http://127.0.0.1:3000/chessinarabic/superadmin/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await res.json();
    if (data.status) {
      if (data.data.message) {
        alert(data.data.message);
      }
      window.location.href = '/chessinarabic/superadmin';
    } else {
      alert('Login failed ❌ ' + data.data.message);
    }
  } catch (err) {
    alert('Error logging in:', err.message);
  }
});
