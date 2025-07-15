// ========== Task Manager ==========
let tasks = [];

function addTask() {
  const input = document.getElementById('taskInput');
  const category = document.getElementById('categorySelect').value;
  if (input.value.trim() === '') return;

  const task = { text: input.value, category, done: false };
  tasks.push(task);
  input.value = '';
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  let completed = 0;

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.textContent = `${task.category}: ${task.text}`;
    li.style.textDecoration = task.done ? 'line-through' : 'none';
    li.onclick = () => {
      task.done = !task.done;
      renderTasks();
    };
    list.appendChild(li);
    if (task.done) completed++;
  });

  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  document.getElementById('progressBar').value = percent;
}

// ========== Pomodoro Timer ==========
let timer;

function startCustomTimer(type) {
  const minutes = type === 'focus'
    ? parseInt(document.getElementById('focusInput').value)
    : parseInt(document.getElementById('breakInput').value);

  let seconds = minutes * 60;
  const timerEl = document.getElementById('timer');
  const label = type === 'focus' ? 'Focus' : 'Break';

  clearInterval(timer);
  timer = setInterval(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerEl.textContent = `${label}: ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (--seconds < 0) {
      clearInterval(timer);
      document.getElementById('alarmSound').play();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  document.getElementById('timer').textContent = 'Focus: 25:00';
}

// ========== Theme Toggle ==========
function setTheme(mode) {
  document.body.className = mode;
  localStorage.setItem('theme', mode);
}

window.onload = () => {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
};

// ========== PWA Install ==========
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('✅ Installed');
      } else {
        console.log('❌ Dismissed');
      }
      deferredPrompt = null;
    });
  }
});



