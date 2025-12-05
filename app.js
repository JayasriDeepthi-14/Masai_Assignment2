const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const STORAGE_KEY = 'todos';

// DOM elements
const fetchAndSaveBtn = document.getElementById('fetchAndSaveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const todosList = document.getElementById('todosList');
const statusEl = document.getElementById('status');
const emptyMsg = document.getElementById('emptyMsg');

// show a short status message
function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? '#b22222' : '';
  // optionally clear after some time
  setTimeout(() => {
    statusEl.textContent = '';
  }, 3000);
}

// save array of todos to localStorage
function saveTodosToStorage(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// load todos from localStorage; returns array (or empty array)
function loadTodosFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored todos:', e);
    return [];
  }
}

// Fetch all todos from API and store first 20 in localStorage
async function fetchAndStoreFirst20() {
  setStatus('Fetching todos from API...');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    // Take first 20 items (if available) and map to minimal fields we care about
    const first20 = data.slice(0, 20).map(item => ({
      id: item.id,            // use API id (unique)
      title: item.title || '',
      completed: !!item.completed
    }));

    saveTodosToStorage(first20);
    setStatus('Saved first 20 todos to localStorage.');
    renderTodos(); // show immediately
  } catch (err) {
    console.error(err);
    setStatus('Failed to fetch todos: ' + err.message, true);
  }
}

// Create and return a DOM node for a single todo
function createTodoNode(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;

  // left: checkbox + title
  const left = document.createElement('div');
  left.className = 'left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => toggleTodoCompleted(todo.id, checkbox.checked));

  const title = document.createElement('div');
  title.className = 'title' + (todo.completed ? ' completed' : '');
  title.textContent = todo.title;

  left.appendChild(checkbox);
  left.appendChild(title);

  // actions: delete button (and optional toggle)
  const actions = document.createElement('div');
  actions.className = 'actions';

  // delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => deleteTodo(todo.id));

  // optional: toggle completed (for UX) - duplicates checkbox functionality
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn-toggle';
  toggleBtn.textContent = todo.completed ? 'Mark Incomplete' : 'Mark Complete';
  toggleBtn.addEventListener('click', () => toggleTodoCompleted(todo.id, !todo.completed));

  actions.appendChild(toggleBtn);
  actions.appendChild(delBtn);

  li.appendChild(left);
  li.appendChild(actions);

  return li;
}

// Render all todos stored in localStorage
function renderTodos() {
  const todos = loadTodosFromStorage();
  todosList.innerHTML = ''; // clear previous

  if (!todos || todos.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  } else {
    emptyMsg.style.display = 'none';
  }

  // create nodes and append
  todos.forEach(todo => {
    const node = createTodoNode(todo);
    todosList.appendChild(node);
  });
}

// Delete a todo by id (remove from storage and re-render)
function deleteTodo(id) {
  const todos = loadTodosFromStorage();
  const idx = todos.findIndex(t => String(t.id) === String(id));
  if (idx === -1) {
    setStatus('Todo not found', true);
    return;
  }

  // confirm deletion
  const ok = confirm('Delete this todo?');
  if (!ok) return;

  todos.splice(idx, 1);
  saveTodosToStorage(todos);
  setStatus('Todo deleted.');
  renderTodos();
}

// Toggle completed status for a todo id
function toggleTodoCompleted(id, completed) {
  const todos = loadTodosFromStorage();
  const idx = todos.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return;

  todos[idx].completed = !!completed;
  saveTodosToStorage(todos);
  renderTodos(); // re-render to update visual state
}

// Clear all stored todos
function clearAllTodos() {
  const ok = confirm('Clear all stored todos from localStorage?');
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  setStatus('Stored todos cleared.');
  renderTodos();
}

fetchAndSaveBtn.addEventListener('click', fetchAndStoreFirst20);
loadBtn.addEventListener('click', renderTodos);
clearAllBtn.addEventListener('click', clearAllTodos);

// render on initial load (if any items exist)
window.addEventListener('DOMContentLoaded', () => {
  renderTodos();
});