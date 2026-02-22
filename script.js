<script>
    const scriptURL = "https://script.google.com/macros/s/AKfycbz5dKd7bzUa4-dd-2UlH--Q8rhLuZetcfM5us4eijeP2p-wpyNI25HAK5E3oAVTTMo/exec";
    let currentUsername = null;

    // Check if user is already logged in
    window.onload = function() {
      const savedUser = localStorage.getItem('username');
      if (savedUser) {
        currentUsername = savedUser;
        showApp();
        loadMessages();
      }
    };

    function showError(message) {
      const errorDiv = document.getElementById('errorMsg');
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
      setTimeout(() => errorDiv.classList.add('hidden'), 3000);
    }

    function showLogin() {
      document.getElementById('loginForm').classList.remove('hidden');
      document.getElementById('registerForm').classList.add('hidden');
    }

    function showRegister() {
      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('registerForm').classList.remove('hidden');
    }

    function showApp() {
      document.getElementById('authPage').classList.add('hidden');
      document.getElementById('appPage').classList.remove('hidden');
      document.getElementById('currentUser').textContent = currentUsername;
    }

    function showAuth() {
      document.getElementById('authPage').classList.remove('hidden');
      document.getElementById('appPage').classList.add('hidden');
    }

    async function register() {
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value;
      const passwordConfirm = document.getElementById('regPasswordConfirm').value;

      if (!username || !password) {
        showError('Please fill in all fields');
        return;
      }

      if (password !== passwordConfirm) {
        showError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
      }

      try {
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: new URLSearchParams({
            action: 'register',
            username: username,
            password: password
          })
        });

        const result = await response.json();
        
        if (result.success) {
          currentUsername = username;
          localStorage.setItem('username', username);
          showApp();
          loadMessages();
          
          // Clear form
          document.getElementById('regUsername').value = '';
          document.getElementById('regPassword').value = '';
          document.getElementById('regPasswordConfirm').value = '';
        } else {
          showError(result.message || 'Registration failed');
        }
      } catch (error) {
        showError('Network error. Please try again.');
      }
    }

    async function login() {
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!username || !password) {
        showError('Please fill in all fields');
        return;
      }

      try {
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: new URLSearchParams({
            action: 'login',
            username: username,
            password: password
          })
        });

        const result = await response.json();
        
        if (result.success) {
          currentUsername = username;
          localStorage.setItem('username', username);
          showApp();
          loadMessages();
          
          // Clear form
          document.getElementById('loginUsername').value = '';
          document.getElementById('loginPassword').value = '';
        } else {
          showError(result.message || 'Invalid username or password');
        }
      } catch (error) {
        showError('Network error. Please try again.');
      }
    }

    function logout() {
      currentUsername = null;
      localStorage.removeItem('username');
      showAuth();
      showLogin();
    }

    async function submitMessage() {
      const messageText = document.getElementById('messageText').value.trim();
      
      if (!messageText) {
        alert('Please enter a message');
        return;
      }

      const button = document.getElementById('submitBtn');
      button.disabled = true;
      button.textContent = 'Posting...';

      try {
        await fetch(scriptURL, {
          method: 'POST',
          body: new URLSearchParams({
            action: 'postMessage',
            username: currentUsername,
            message: messageText
          })
        });

        document.getElementById('messageText').value = '';
        loadMessages();
      } catch (error) {
        alert('Failed to post message');
      } finally {
        button.disabled = false;
        button.textContent = 'Post Message';
      }
    }

    async function loadMessages() {
      try {
        const response = await fetch(scriptURL + '?action=getMessages');
        const messages = await response.json();

        const container = document.getElementById('messagesContainer');
        container.innerHTML = '';

        if (!messages || messages.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No messages yet. Be the first to post!</p>';
          return;
        }

        messages.reverse().forEach(msg => {
          if (!msg.message || !msg.username) return;

          const div = document.createElement('div');
          div.className = 'message';

          const header = document.createElement('div');
          header.className = 'message-header';

          const usernameSpan = document.createElement('span');
          usernameSpan.className = 'username';
          usernameSpan.textContent = msg.username;

          const timestampSpan = document.createElement('span');
          timestampSpan.className = 'timestamp';
          if (msg.timestamp) {
            const date = new Date(msg.timestamp);
            timestampSpan.textContent = date.toLocaleString();
          }

          header.appendChild(usernameSpan);
          header.appendChild(timestampSpan);

          const messageText = document.createElement('div');
          messageText.className = 'message-text';
          messageText.textContent = msg.message;

          div.appendChild(header);
          div.appendChild(messageText);
          container.appendChild(div);
        });
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }

    // Refresh messages every 10 seconds
    setInterval(() => {
      if (currentUsername) {
        loadMessages();
      }
    }, 10000);
