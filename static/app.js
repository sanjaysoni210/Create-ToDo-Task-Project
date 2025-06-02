const API_BASE = 'https://create-todo-task-project.onrender.com'; // Flask default
const token = localStorage.getItem('token');

// ---------- Login ----------
function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        window.location.href = 'index.html';
      } else {
        alert('Login failed');
      }
    });
}

// ---------- Register ----------
function register(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const organization = document.getElementById('organization').value;

  fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, organization })
  })
    .then(res => {
      if (res.status === 201) {
        alert('Registered successfully. Please login.');
        window.location.href = 'login.html';
      } else {
        alert('Registration failed');
      }
    });
}

// ---------- Logout ----------
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// ---------- Load Todos ----------
if (window.location.pathname.endsWith('index.html')) {
  if (!token) {
    window.location.href = 'login.html';
  } else {
    fetchTodos();
  }
}

function fetchTodos() {
  fetch(`${API_BASE}/todos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(todos => {
      const list = document.getElementById('todo-list');
      list.innerHTML = ''; // Clear existing list

      todos.forEach(todo => {
        const li = document.createElement('li');

        li.innerHTML = `
          <span id="content-${todo.id}">${todo.content}</span>
          <input type="text" id="edit-${todo.id}" value="${todo.content}" style="display:none;" />
          <button onclick="enableEdit(${todo.id})">Edit</button>
          <button onclick="saveEdit(${todo.id})" id="save-${todo.id}" style="display:none;">Save</button>
          <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;

        list.appendChild(li);
      });
    });
}

// ---------- Create New Todo ----------
function createTodo() {
  const content = document.getElementById('new-todo').value;
  if (!content) {
    alert('Please enter a task.');
    return;
  }

  fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('new-todo').value = '';
      fetchTodos(); // Refresh without full page reload
    })
    .catch(() => {
      alert('Error creating todo. Please make sure you are logged in.');
    });
}

// ---------- Edit Todo ----------
function enableEdit(id) {
  document.getElementById(`content-${id}`).style.display = 'none';
  document.getElementById(`edit-${id}`).style.display = 'inline';
  document.getElementById(`save-${id}`).style.display = 'inline';
}

function saveEdit(id) {
  const newContent = document.getElementById(`edit-${id}`).value;

  fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: newContent })
  })
    .then(res => res.json())
    .then(() => fetchTodos());
}

// ---------- Delete Todo ----------
function deleteTodo(id) {
  fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(() => fetchTodos());
}
