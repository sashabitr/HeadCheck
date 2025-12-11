<template>
  <div class="home">
    <div class="home-inner">
      <!-- STATUSBAR -->
      <header class="status-bar">
        <span class="time">9:41</span>
        <span class="status-spacer"></span>
        <span class="status-icons">📶 🔋</span>
      </header>

      <!-- GREETING -->
      <section class="greeting">
        <div class="avatar">
          <img src="/rsc/profile1.png" class="avatar-img" alt="Profile" />
        </div>
        <div class="greeting-text">
          <p class="hi">Hi, User</p>
        </div>
      </section>

      <!-- MOOD SECTION (noch ohne Emojis) -->
      <section class="mood">
        <h2>Your mood last days</h2>
        <div class="mood-row">
          <div v-for="n in 5" :key="n" class="mood-slot"></div>
        </div>
      </section>

      <!--  KALENDER -->
      <section class="calendar-card">
        <div class="calendar-header">
          <button class="month-arrow" @click="prevMonth" :disabled="isMinMonth">▲</button>

          <span class="month-label"> {{ currentMonthName }} {{ currentYear }} </span>

          <button class="month-arrow" @click="nextMonth" :disabled="isMaxMonth">▼</button>
        </div>

        <div class="calendar-weekdays">
          <span v-for="d in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="d">
            {{ d }}
          </span>
        </div>

        <div class="calendar-grid">
          <span
            v-for="(cell, index) in calendarCells"
            :key="index"
            class="calendar-day"
            :class="{ 'is-empty': cell === null }"
          >
            {{ cell }}
          </span>
        </div>
      </section>
    </div>

    <!-- BOTTOM NAVIGATION -->
    <nav class="bottom-nav">
      <button class="nav-btn is-active" @click="goHome">
        <img src="/rsc/home2.png" alt="Home" />
      </button>

      <button class="nav-btn">
        <img src="/rsc/plus1.png" alt="Add" />
      </button>

      <button class="nav-btn">
        <img src="/rsc/report1.png" alt="Reports" />
      </button>

      <button class="nav-btn" @click="goProfile">
        <img src="/rsc/profile1.png" alt="Profile" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/home')
}

function goProfile() {
  router.push('/profile')
}

/* Grenzen: Sep 2025 bis Sep 2026 */
const minDate = { month: 8, year: 2025 } // September 2025 (0-indexed)
const maxDate = { month: 8, year: 2026 } // September 2026

const currentMonth = ref(minDate.month)
const currentYear = ref(minDate.year)

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currentMonthName = computed(() => monthNames[currentMonth.value])

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function getMondayBasedFirstWeekday(year, monthIndex) {
  const jsDay = new Date(year, monthIndex, 1).getDay() // 0 = Sonntag
  return (jsDay + 6) % 7
}

/* Immer 6 Reihen × 7 Spalten = 42 Zellen */
const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const days = getDaysInMonth(year, month)
  const firstWeekday = getMondayBasedFirstWeekday(year, month)

  const cells = []

  // leere Felder vor dem 1.
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null)
  }

  // Tage 1..n
  for (let d = 1; d <= days; d++) {
    cells.push(d)
  }

  // auffüllen auf genau 42
  while (cells.length < 42) {
    cells.push(null)
  }

  return cells
})

const isMinMonth = computed(
  () => currentYear.value === minDate.year && currentMonth.value === minDate.month,
)

const isMaxMonth = computed(
  () => currentYear.value === maxDate.year && currentMonth.value === maxDate.month,
)

function prevMonth() {
  if (isMinMonth.value) return
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (isMaxMonth.value) return
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>

<style scoped>
/* ========= GANZES LAYOUT ========= */
.home {
  width: 100%;
  height: 100%;
  background: #49435b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.home-inner {
  width: 100%;
  max-width: 430px;
  flex: 1;
  padding: 24px 20px 16px;
  box-sizing: border-box;
}

/* STATUSBAR */
.status-bar {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 24px;
}

.status-spacer {
  flex: 1;
}

.status-icons {
  font-size: 1rem;
}

/* GREETING */
.greeting {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.hi {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

/* MOOD SECTION */
.mood {
  margin-bottom: 24px;
}

.mood h2 {
  font-size: 1rem;
  margin-bottom: 8px;
}

.mood-row {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.1);
}

.mood-slot {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
}

/* ========= KALENDER ========= */
.calendar-card {
  margin-top: 16px;
  padding: 20px 20px 20px;
  border-radius: 16px;
  background: #a3767d;
  color: #f7f2f5;

  width: 100%;
  max-width: 95%;
  margin-left: auto;
  margin-right: auto;

  height: 360px; /* fixe Höhe */
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
}

/* Header mit Pfeilen */
.calendar-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.month-arrow {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  border: none;
  width: 28px;
  height: 28px;
  color: #f7f2f5;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    opacity 0.15s ease,
    transform 0.1s ease;
  flex: 0 0 28px;
}

.month-arrow:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.22);
  transform: translateY(-1px);
}

.month-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.month-label {
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: capitalize;
}

/* Wochentage */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.calendar-weekdays span {
  text-align: center;
}

/* Grid: füllt den restlichen Platz fix aus */
.calendar-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 6px;
  font-size: 0.95rem;
}

.calendar-day {
  text-align: center;
  padding: 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Leere Felder bleiben unsichtbar, halten aber die Höhe */
.calendar-day.is-empty {
  visibility: hidden;
}

/* ========= BOTTOM NAVIGATION ========= */
.bottom-nav {
  width: 100%;
  max-width: 430px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #a3767d;
  padding: 14px 24px;
  min-height: 80px;
  gap: 16px;
  box-sizing: border-box;
}

.nav-btn {
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
}

.nav-btn.is-active {
  opacity: 1;
}

.nav-btn img {
  width: 42px;
  height: 42px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
