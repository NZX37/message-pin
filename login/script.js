// Replace with your Google Apps Script Web App URL
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwLGEPD8-fkSYqGgE0j4Ok4roqJWmemzxVP3Acm2BWQTd9i1xhLMQB6ufwSEKI6Wpys/exec';

document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch(`${BACKEND_URL}?action=login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
  } else {
    document.getElementById('message').textContent = 'Login failed: ' + data.error;
  }
};

document.getElementById('signupForm').onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  const res = await fetch(`${BACKEND_URL}?action=signup`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
  } else {
    document.getElementById('message').textContent = 'Signup failed: ' + data.error;
  }
};
