// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

// Load tasks from localStorage when the page loads
window.addEventListener('load', loadTasks);

// Add Task Functionality
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Task cannot be empty!');
    return;
  }
  addTaskToDOM(taskText);
  saveTasks();
  taskInput.value = '';
});

// Add Task to DOM
function addTaskToDOM(taskText) {
  const taskItem = document.createElement('li');
  taskItem.className = 'taskItem';

  // Task content wrapper
  const taskContent = document.createElement('div');
  taskContent.className = 'taskContent';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';

  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;

  // Buttons container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'buttonContainer';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'editBtn';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'deleteBtn';

  // Append elements
  taskContent.appendChild(checkbox);
  taskContent.appendChild(taskTextSpan);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);
  
  taskItem.appendChild(taskContent);
  taskItem.appendChild(buttonContainer);
  taskList.prepend(taskItem);

  // Checkbox Functionality
  checkbox.addEventListener('change', () => {
    taskTextSpan.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    saveTasks();
  });

  // Edit Task Functionality
  editBtn.addEventListener('click', () => {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = taskTextSpan.textContent;
    taskItem.replaceChild(inputField, taskContent);
    inputField.focus();

    inputField.addEventListener('blur', () => {
      const updatedText = inputField.value.trim();
      if (updatedText !== '') {
        taskTextSpan.textContent = updatedText;
      }
      taskItem.replaceChild(taskContent, inputField);
      saveTasks();
    });

    inputField.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const updatedText = inputField.value.trim();
        if (updatedText !== '') {
          taskTextSpan.textContent = updatedText;
        }
        taskItem.replaceChild(taskContent, inputField);
        saveTasks();
      }
    });
  });

  // Delete Task Functionality
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(taskItem);
    saveTasks();
  });
}

// Search Filter
searchInput.addEventListener('input', () => {
  const searchText = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll('.taskItem');

  tasks.forEach(task => {
    const taskText = task.querySelector('.taskContent span').textContent.toLowerCase();
    task.style.display = taskText.includes(searchText) ? 'flex' : 'none';
  });
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.taskItem').forEach(taskItem => {
    const taskText = taskItem.querySelector('.taskContent span').textContent;
    const completed = taskItem.querySelector('.checkbox').checked;
    tasks.push({ text: taskText, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    addTaskToDOM(task.text);
    const taskItem = taskList.firstChild;
    if (task.completed) {
      taskItem.querySelector('.checkbox').checked = true;
      taskItem.querySelector('.taskContent span').style.textDecoration = 'line-through';
    }
  });
}
