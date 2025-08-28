async function loadProfile() {
  try {
    const res = await fetch('http://127.0.0.1:3000/chessinarabic/me/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    // Fill fields
    document.getElementById('rate').textContent = data.data.rate;
    document.getElementById('games').textContent = data.data.games.length;
    document.getElementById('createdAt').textContent = data.data.createdAt;
    document.getElementById('wins').textContent = data.data.wins;
    document.getElementById('loss').textContent = data.data.loss;
    document.getElementById('drew').textContent = data.data.drew;
    document.getElementById('username').textContent = data.data.username;
    document.getElementById('myprofile').textContent = data.data.username;
    document.getElementById('email').textContent = data.data.email;
    document.getElementById('winsrate').textContent = `${data.data.WinsRate}%`;
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

// Load on page start
loadProfile();
