let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let timer;
let currentMode = 'focus';

// === TASK MANAGEMENT ===
function addTask() {
  const input = document.getElementById('taskInput');
  const category = document.getElementById('categorySelect').value;
  const taskText = input.value.trim();
  if (taskText !== '') {
    tasks.push({ text: taskText, done: false, category });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    input.value = '';
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `[${task.category}] ${task.text}`;
    span.style.textDecoration = task.done ? 'line-through' : '';
    span.onclick = () => {
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => editTask(index);
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => deleteTask(index);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
  updateProgressBar();
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function updateProgressBar() {
  const completed = tasks.filter(t => t.done).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;
  document.getElementById('progressBar').value = progress;
}

renderTasks();

// === TIMER FUNCTIONALITY ===
function startCustomTimer(type) {
  stopTimer();
  const focusMin = parseInt(document.getElementById('focusInput').value);
  const breakMin = parseInt(document.getElementById('breakInput').value);
  localStorage.setItem('focusTime', focusMin);
  localStorage.setItem('breakTime', breakMin);
  let duration = (type === 'focus' ? focusMin : breakMin) * 60;
  currentMode = type;
  updateTimerDisplay(type, duration);
  timer = setInterval(() => {
    if (--duration < 0) {
      clearInterval(timer);
      document.getElementById('alarmSound').play();
      alert(`${type === 'focus' ? 'Focus' : 'Break'} time is over!`);
      const nextMode = type === 'focus' ? 'break' : 'focus';
      startCustomTimer(nextMode);
    } else {
      updateTimerDisplay(type, duration);
    }
  }, 1000);
}

function updateTimerDisplay(type, total) {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  document.getElementById('timer').innerText =
    `${type.charAt(0).toUpperCase() + type.slice(1)}: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function stopTimer() {
  clearInterval(timer);
  document.getElementById('timer').innerText = 'Stopped';
}

// === THEME SYSTEM ===
function setTheme(mode) {
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-color');
  document.body.classList.add(`theme-${mode}`);
  localStorage.setItem('theme', mode);
}

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  const focusSaved = localStorage.getItem('focusTime');
  const breakSaved = localStorage.getItem('breakTime');
  if (focusSaved) document.getElementById('focusInput').value = focusSaved;
  if (breakSaved) document.getElementById('breakInput').value = breakSaved;
});

