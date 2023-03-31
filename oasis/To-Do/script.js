// Select DOM elements
const todoForm = document.querySelector('#todo-form');
const pendingList = document.querySelector('#pending-list');
const completedList = document.querySelector('#completed-list');

// Define variables
let todoList = [];

// Add task to list
function addTask(event) {
  event.preventDefault();
  const todoInput = event.target.querySelector('.todo-input');
  const todoName = todoInput.value.trim();
  if (todoName === '') {
    return;
  }

  // Create new task object
  const task = {
    id: Date.now(),
    name: todoName,
    completed: false,
    date: new Date()
  };

  // Add task to array and save to local storage
  todoList.push(task);
  saveTodoList();

  // Clear input and focus on it
  todoInput.value = '';
  todoInput.focus();

  // Render task to UI
  renderTask(task, pendingList);
}

// Render task to UI
function renderTask(task, list) {
  const taskEl = document.createElement('li');
  taskEl.setAttribute('data-id', task.id);
  taskEl.classList.add('todo-item');
  if (task.completed) {
    taskEl.classList.add('completed');
  }
  const taskContent = `
    <input type="text" value="${task.name}" readonly>
    <span class="date">${task.date.toLocaleString()}</span>
    <div class="actions">
      <button class="btn edit-button">Edit</button>
      <button class="btn delete-button">Delete</button>
      <button class="btn complete-button">Complete</button>
    </div>
  `;
  taskEl.innerHTML = taskContent;
  list.appendChild(taskEl);

  // Add event listeners to task buttons
  const editButton = taskEl.querySelector('.edit-button');
  const deleteButton = taskEl.querySelector('.delete-button');
  const completeButton = taskEl.querySelector('.complete-button');

  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);
  completeButton.addEventListener('click', completeTask);
}

// Edit task
function editTask(event) {
  const taskEl = event.target.closest('.todo-item');
  const taskId = taskEl.getAttribute('data-id');
  const taskNameEl = taskEl.querySelector('input');
  const taskName = taskNameEl.value;
  taskNameEl.removeAttribute('readonly');
  taskNameEl.focus();

  // Update task in array and save to local storage
  todoList = todoList.map(task => {
    if (task.id == taskId) {
      task.name = taskName;
      return task;
    }
    return task;
  });
  saveTodoList();

  // Disable edit mode when input loses focus
  taskNameEl.addEventListener('blur', function() {
    taskNameEl.setAttribute('readonly', true);
  });
}

// Delete task
function deleteTask(event) {
  const taskEl = event.target.closest('.todo-item');
  const taskId = taskEl.getAttribute('data-id');

  // Remove task from array and save to local storage
  todoList = todoList.filter(task => task.id != taskId);
  saveTodoList();

  // Remove task from UI
  taskEl.remove();
}

// Complete task
function completeTask(event) {
  const taskEl = event.target.closest('.todo-item');
  const taskId = taskEl.getAttribute('data-id');

  // Update task in array and save to local storage
  todoList = todoList.map(task => {
    if (task.id == taskId) {
      task.completed = true;
      return task;
    }
    return task;
  });
  saveTodoList();
  // Move task to completed list
const completedTask = todoList.find(task => task.id == taskId);
renderTask(completedTask, completedList);
taskEl.remove();
}

// Save todo list to local storage
function saveTodoList() {
localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Load todo list from local storage
function loadTodoList() {
const todoListJson = localStorage.getItem('todoList');
if (todoListJson !== null) {
todoList = JSON.parse(todoListJson);
todoList.forEach(task => {
if (task.completed) {
renderTask(task, completedList);
} else {
renderTask(task, pendingList);
}
});
}
}

// Load saved todo list on page load
loadTodoList();

// Add event listener to todo form
todoForm.addEventListener('submit', addTask);