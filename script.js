// Replace with your deployed Apps Script web app URL
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwvTmvUmo-lNBM5fCwZ3bD0whOVHy40FUUSuFQbeMUMWW0vhOdpxlT_pmYCLzCsenM5GQ/exec';

let username = localStorage.getItem('username') || 'guest';

document.addEventListener('DOMContentLoaded', async () => {
  setupProfile();
  await loadMessages();
  setupForm();
  setupLogout();
});

function setupProfile() {
  const profileName = document.getElementById('profileName');
  profileName.textContent = username;

  if (username !== 'guest') {
    document.getElementById('logoutBtn').style.display = '';
    fetch(`${'https://script.google.com/macros/s/AKfycbwvTmvUmo-lNBM5fCwZ3bD0whOVHy40FUUSuFQbeMUMWW0vhOdpxlT_pmYCLzCsenM5GQ/exec'}?action=getColor&username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        if (data.color) profileName.style.color = data.color;
        else profileName.style.color = 'black';
      });
    document.getElementById('guestNotice').style.display = 'none';
    document.getElementById('sendForm').style.display = '';
  } else {
    profileName.style.color = 'black';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('guestNotice').style.display = '';
    document.getElementById('sendForm').style.display = 'none';
  }
}

async function loadMessages() {
  const res = await fetch(`${'https://script.google.com/macros/s/AKfycbwvTmvUmo-lNBM5fCwZ3bD0whOVHy40FUUSuFQbeMUMWW0vhOdpxlT_pmYCLzCsenM5GQ/exec'}?action=getMessages`);
  const messages = await res.json();
  const list = document.getElementById('messages');
  list.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = `${msg.username || 'guest'}: ${msg.content}`;
    if (msg.username && msg.color) {
      li.style.color = msg.color;
    }
    list.appendChild(li);
  });
}

function setupForm() {
  const form = document.getElementById('sendForm');
  if (!form) return;
  form.onsubmit = async function(e) {
    e.preventDefault();
    if (username === 'guest') {
      alert('Please login or sign up to send messages.');
      return;
    }
    const content = document.getElementById('messageInput').value.trim();
    if (!content) return;
    await fetch(`${'https://script.google.com/macros/s/AKfycbwvTmvUmo-lNBM5fCwZ3bD0whOVHy40FUUSuFQbeMUMWW0vhOdpxlT_pmYCLzCsenM5GQ/exec'}?action=sendMessage`, {
      method: 'POST',
      body: JSON.stringify({ username, content }),
      headers: { 'Content-Type': 'application/json' }
    });
    document.getElementById('messageInput').value = '';
    await loadMessages();
  };
}

function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.onclick = () => {
    localStorage.removeItem('username');
    location.reload();
  };
}
