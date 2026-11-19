let habits = JSON.parse(localStorage.getItem("habits")) || [];

const habitNameInput = document.getElementById("habit-name");
const habitEmojiInput = document.getElementById("habit-emoji");
const addBtn = document.getElementById("add-btn");
const clearTodayBtn = document.getElementById("clear-today-btn");

const habitList = document.getElementById("habit-list");
const weekView = document.getElementById("week-view");

const totalHabitsEl = document.getElementById("total-habits");
const doneTodayEl = document.getElementById("done-today");
const bestStreakEl = document.getElementById("best-streak");
const progressPercentEl = document.getElementById("progress-percent");
const scoreCircle = document.querySelector(".score-circle");
const todayLabel = document.getElementById("today-label");

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function getTodayKey() {
  return getLocalDateKey();
}

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, char => entities[char]);
}

function getLastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = getLocalDateKey(date);
    days.push(key);
  }

  return days;
}

function formatTodayLabel() {
  const today = new Date();

  todayLabel.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function addHabit() {
  const name = habitNameInput.value.trim();
  const emoji = habitEmojiInput.value;

  if (name === "") {
    alert("Please enter a habit name");
    return;
  }

  const newHabit = {
    id: Date.now(),
    name: name,
    emoji: emoji,
    completedDates: [],
  };

  habits.push(newHabit);

  habitNameInput.value = "";

  saveHabits();
  renderApp();
}

function toggleHabit(habitId) {
  const today = getTodayKey();

  const habit = habits.find(function (item) {
    return item.id === habitId;
  });

  const alreadyDone = habit.completedDates.includes(today);

  if (alreadyDone) {
    habit.completedDates = habit.completedDates.filter(function (date) {
      return date !== today;
    });
  } else {
    habit.completedDates.push(today);
  }

  saveHabits();
  renderApp();
}

function deleteHabit(habitId) {
  habits = habits.filter(function (habit) {
    return habit.id !== habitId;
  });

  saveHabits();
  renderApp();
}

function clearToday() {
  const today = getTodayKey();

  for (let i = 0; i < habits.length; i++) {
    habits[i].completedDates = habits[i].completedDates.filter(function (date) {
      return date !== today;
    });
  }

  saveHabits();
  renderApp();
}

function calculateStreak(habit) {
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = getLocalDateKey(date);

    if (habit.completedDates.includes(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML = `
      <div class="empty-message">
        No habits yet. Add your first habit above.
      </div>
    `;
    return;
  }

  const today = getTodayKey();

  for (let i = 0; i < habits.length; i++) {
    const habit = habits[i];
    const isDone = habit.completedDates.includes(today);
    const streak = calculateStreak(habit);

    habitList.innerHTML += `
      <div class="habit-card">
        <div class="habit-left">
          <div class="emoji-box">${escapeHtml(habit.emoji)}</div>

          <div class="habit-info">
            <h3>${escapeHtml(habit.name)}</h3>
            <p>${streak} day streak</p>
            <button class="delete-btn" onclick="deleteHabit(${Number(habit.id)})">
              Delete
            </button>
          </div>
        </div>

        <button 
          class="done-btn ${isDone ? "completed" : ""}" 
          onclick="toggleHabit(${Number(habit.id)})"
        >
          ${isDone ? "✓" : ""}
        </button>
      </div>
    `;
  }
}

function renderStats() {
  const today = getTodayKey();

  const totalHabits = habits.length;

  const doneToday = habits.filter(function (habit) {
    return habit.completedDates.includes(today);
  }).length;

  let bestStreak = 0;

  for (let i = 0; i < habits.length; i++) {
    const streak = calculateStreak(habits[i]);

    if (streak > bestStreak) {
      bestStreak = streak;
    }
  }

  let progress = 0;

  if (totalHabits > 0) {
    progress = Math.round((doneToday / totalHabits) * 100);
  }

  totalHabitsEl.textContent = totalHabits;
  doneTodayEl.textContent = doneToday;
  bestStreakEl.textContent = bestStreak;
  progressPercentEl.textContent = progress + "%";

  scoreCircle.style.background = `conic-gradient(#22c55e ${progress}%, #1f2937 ${progress}%)`;
}

function renderWeekView() {
  weekView.innerHTML = "";

  if (habits.length === 0) {
    weekView.innerHTML = `<p class="empty-message">Your weekly progress will appear here.</p>`;
    return;
  }

  const lastSevenDays = getLastSevenDays();

  for (let i = 0; i < habits.length; i++) {
    const habit = habits[i];

    let dots = "";

    for (let j = 0; j < lastSevenDays.length; j++) {
      const day = lastSevenDays[j];
      const isDone = habit.completedDates.includes(day);

      dots += `<div class="day-dot ${isDone ? "done" : ""}"></div>`;
    }

    weekView.innerHTML += `
      <div class="week-row">
        <div class="week-name">${escapeHtml(habit.emoji)} ${escapeHtml(habit.name)}</div>
        ${dots}
      </div>
    `;
  }
}

function renderApp() {
  formatTodayLabel();
  renderHabits();
  renderStats();
  renderWeekView();
}

addBtn.addEventListener("click", addHabit);
clearTodayBtn.addEventListener("click", clearToday);

habitNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addHabit();
  }
});

renderApp();