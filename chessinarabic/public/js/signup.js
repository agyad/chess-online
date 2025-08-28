document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://localhost:3000/chessinarabic/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    alert(data.data.message);
    if (data.status) {
      window.location.href = '/chessinarabic/login';
    }
  } catch (err) {
    alert(err.message);
  }
});
