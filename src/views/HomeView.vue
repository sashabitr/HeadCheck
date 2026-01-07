<!-- src/views/Home.vue -->
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
        <div class="greeting-left">
          <div class="avatar">
            <img src="/rsc/profile1.png" class="avatar-img" alt="Profile" />
          </div>

          <div class="greeting-text">
            <p class="hi">Hi, User</p>
          </div>
        </div>

        <!-- STREAK BADGE -->
        <div class="streak-badge" :class="{ 'is-inactive': !hasTodayEntry }">
          <span class="streak-emoji">🔥</span>
          <span class="streak-count">{{ streak }}</span>
        </div>
      </section>

      <!-- MOOD SECTION -->
      <section class="mood">
        <h2>Your mood last days</h2>
        <div class="mood-row">
          <button
            v-for="emoji in moodEmojis"
            :key="emoji"
            type="button"
            class="mood-slot"
            :class="{ 'is-selected': selectedMood === emoji }"
            @click="selectedMood = emoji"
            :aria-pressed="selectedMood === emoji"
          >
            {{ emoji }}
          </button>
        </div>
      </section>

      <!-- KALENDER -->
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
          <template v-for="(cell, index) in calendarCells" :key="index">
            <span v-if="cell === null" class="calendar-day is-empty"></span>

            <button
              v-else
              type="button"
              class="calendar-day-btn"
              :class="dayButtonClass(cell)"
              :disabled="true"
              :aria-label="`Day ${cell.day} ${cell.dateStr}`"
            >
              {{ cell.day }}
            </button>
          </template>
        </div>
      </section>

      <!-- NORMALE WERTE -->
      <section v-if="triggerNormal" class="normal-section">
        <h2>Your Usual Habits</h2>

        <div class="normal-card">
          <div class="normal-row">
            <span>Sleep</span>
            <span>{{ triggerNormal.sleep.toFixed(1) }} h</span>
          </div>

          <div class="normal-row">
            <span>Screen time</span>
            <span>{{ triggerNormal.screenTime.toFixed(1) }} h</span>
          </div>

          <div class="normal-row">
            <span>Water</span>
            <span>{{ triggerNormal.water.toFixed(1) }} L</span>
          </div>

          <div class="normal-row">
            <span>Caffeine (safe)</span>
            <span>{{ safeCaffeineCups.toFixed(1) }} cups</span>
          </div>
        </div>
      </section>
    </div>

    <!-- BOTTOM NAVIGATION -->
    <nav class="bottom-nav">
      <button class="nav-btn is-active" @click="goHome">
        <img src="/rsc/home2.png" alt="Home" />
      </button>

      <button class="nav-btn" @click="goWizard">
        <img src="/rsc/plus1.png" alt="Add" />
      </button>

      <button class="nav-btn" @click="goReport">
        <img src="/rsc/report1.png" alt="Reports" />
      </button>

      <button class="nav-btn" @click="goProfile">
        <img src="/rsc/profile1.png" alt="Profile" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { didDailySurveyToday } from '@/state/dailyState'

const DAILY_SURVEY_STORAGE_KEY = 'dailySurveyResult'

const router = useRouter()

const entries = ref([])
const streak = ref(0)
const hasTodayEntry = ref(false)

/* ---------- mood ---------- */
const moodEmojis = ['😄', '🙂', '😐', '😕', '😫']
const selectedMood = ref(null)

/* ---------- navigation ---------- */
function goHome() {
  router.push('/home')
}
function goProfile() {
  router.push('/profile')
}
function goWizard() {
  router.push('/headache')
}
function goReport() {
  router.push('/headache-report')
}

/* ---------- date helpers (lokal, ohne UTC shift) ---------- */
function pad2(n) {
  return String(n).padStart(2, '0')
}

function toLocalIsoDate(date) {
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD
}

const todayStr = computed(() => toLocalIsoDate(new Date()))

function makeDateStr(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function isBeforeToday(dateStr) {
  return dateStr < todayStr.value
}

function isToday(dateStr) {
  return dateStr === todayStr.value
}

/* ---------- localStorage parsing (robust) ---------- */
function normalizeHeadacheToStatus(v) {
  if (typeof v === 'boolean') return v ? 'red' : 'green'
  if (typeof v === 'number') return v === 1 ? 'red' : v === 0 ? 'green' : null
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    if (['true', 'yes', 'y', 'ja', '1', 'red'].includes(s)) return 'red'
    if (['false', 'no', 'n', 'nein', '0', 'green'].includes(s)) return 'green'
  }
  return null
}

function extractStatusFromParsed(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  return (
    normalizeHeadacheToStatus(parsed.headache) ??
    normalizeHeadacheToStatus(parsed.hasHeadache) ??
    normalizeHeadacheToStatus(parsed.headacheAnswer) ??
    normalizeHeadacheToStatus(parsed.answer) ??
    normalizeHeadacheToStatus(parsed.value) ??
    null
  )
}

function dateMatchesToday(dateValue) {
  const stored = String(dateValue || '').slice(0, 10)
  if (!stored) return false

  const localToday = todayStr.value
  const utcToday = new Date().toISOString().slice(0, 10)

  return stored === localToday || stored === utcToday
}

function readTodaySurveyStatusFromLocalStorage() {
  // 1) expected key
  try {
    const raw = localStorage.getItem(DAILY_SURVEY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (dateMatchesToday(parsed?.date)) {
        const status = extractStatusFromParsed(parsed)
        if (status) return status
      }
    }
  } catch {
    // ignore
  }

  // 2) scan all keys (fallback)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    let raw = null
    try {
      raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw)

      if (!dateMatchesToday(parsed?.date)) continue

      const status = extractStatusFromParsed(parsed)
      if (status) return status
    } catch {
      continue
    }
  }

  return null
}

const todayLocalStatus = ref(null)

function refreshTodayLocalStatus() {
  todayLocalStatus.value = readTodaySurveyStatusFromLocalStorage()
}

/* ---------- init + migration ---------- */
onMounted(async () => {
  setCalendarToTodayClamped()
  refreshTodayLocalStatus()

  const res = await fetch('/headacheEntries.json')
  const data = await res.json()

  entries.value = (data || []).map((e) => {
    const headacheIsBool = typeof e?.headache === 'boolean'
    return {
      ...e,
      headacheAnswered:
        typeof e?.headacheAnswered === 'boolean' ? e.headacheAnswered : headacheIsBool,
    }
  })

  recomputeStreakState()
})

function recomputeStreakState() {
  refreshTodayLocalStatus()

  const today = todayStr.value
  const answeredBeforeToday = (entries.value || []).filter(
    (e) => e && e.headacheAnswered === true && e.date < today,
  )

  const baseStreak = calculateStreak(answeredBeforeToday)

  // today is “done” if either memory flag OR localStorage status exists
  const doneToday = didDailySurveyToday.value || todayLocalStatus.value !== null
  hasTodayEntry.value = doneToday
  streak.value = baseStreak + (doneToday ? 1 : 0)
}

watch(
  () => didDailySurveyToday.value,
  () => {
    recomputeStreakState()
  },
)

/* SPA navigation back to home */
const removeAfterEach = router.afterEach((to) => {
  if (to?.path === '/home') recomputeStreakState()
})

function onFocus() {
  recomputeStreakState()
}

onMounted(() => {
  window.addEventListener('focus', onFocus)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', onFocus)
  removeAfterEach()
})

/* ---------- streak ---------- */
function calculateStreak(entriesList) {
  if (!entriesList || entriesList.length === 0) return 0

  const dates = entriesList.map((e) => e.date).sort((a, b) => new Date(b) - new Date(a))

  let s = 0
  const expected = new Date()
  expected.setHours(0, 0, 0, 0)
  expected.setDate(expected.getDate() - 1)

  for (const d of dates) {
    const current = new Date(d)
    current.setHours(0, 0, 0, 0)

    if (current.getTime() === expected.getTime()) {
      s++
      expected.setDate(expected.getDate() - 1)
    } else {
      break
    }
  }

  return s
}

/* ---------- calendar bounds ---------- */
/* Grenzen: Sep 2025 bis Sep 2026 */
const minDate = { month: 8, year: 2025 } // September 2025 (0-indexed)
const maxDate = { month: 8, year: 2026 } // September 2026

const currentMonth = ref(minDate.month)
const currentYear = ref(minDate.year)

function monthKey({ year, month }) {
  return year * 12 + month
}

function setCalendarToTodayClamped() {
  const now = new Date()
  const desired = { year: now.getFullYear(), month: now.getMonth() }

  const minK = monthKey(minDate)
  const maxK = monthKey(maxDate)
  const desK = monthKey(desired)

  const clampedK = Math.min(Math.max(desK, minK), maxK)
  currentYear.value = Math.floor(clampedK / 12)
  currentMonth.value = clampedK % 12
}

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
  const jsDay = new Date(year, monthIndex, 1).getDay()
  return (jsDay + 6) % 7
}

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

/* ---------- fast lookup ---------- */
const entriesByDate = computed(() => {
  const map = new Map()
  for (const e of entries.value || []) {
    if (e?.date) map.set(e.date, e)
  }
  return map
})

function getDayStatus(dateStr) {
  if (isBeforeToday(dateStr)) {
    const e = entriesByDate.value.get(dateStr)
    if (!e || e.headacheAnswered !== true) return null
    if (e.headache === true) return 'red'
    if (e.headache === false) return 'green'
    return null
  }

  if (isToday(dateStr)) {
    refreshTodayLocalStatus()
    return todayLocalStatus.value
  }

  return null
}

/* ---------- calendar cells ---------- */
const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const days = getDaysInMonth(year, month)
  const firstWeekday = getMondayBasedFirstWeekday(year, month)

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)

  for (let d = 1; d <= days; d++) {
    const dateStr = makeDateStr(year, month, d)
    cells.push({
      day: d,
      dateStr,
      status: getDayStatus(dateStr),
    })
  }

  while (cells.length < 42) cells.push(null)
  return cells
})

function dayButtonClass(cell) {
  return {
    'has-status': cell.status === 'red' || cell.status === 'green',
    'is-headache': cell.status === 'red',
    'is-noheadache': cell.status === 'green',
  }
}

/* ---------- Normal section ---------- */
const triggerNormal = computed(() => {
  if (entries.value.length === 0) return null

  const lastDate = new Date(entries.value[entries.value.length - 1].date)
  const cutoff = new Date(lastDate)
  cutoff.setDate(cutoff.getDate() - 29)

  const last30Days = entries.value.filter((e) => new Date(e.date) >= cutoff)
  if (last30Days.length === 0) return null

  const avg = (key) => last30Days.reduce((s, e) => s + Number(e[key] || 0), 0) / last30Days.length

  return {
    sleep: avg('sleepHours'),
    screenTime: avg('screenHours'),
    water: avg('waterLiters'),
    caffeine: (last30Days.filter((e) => e.caffeine).length / last30Days.length) * 100,
  }
})

const safeCaffeineCups = computed(() => {
  if (entries.value.length === 0) return 0

  const lastDate = new Date(entries.value.at(-1).date)
  const cutoff = new Date(lastDate)
  cutoff.setDate(cutoff.getDate() - 29)

  const last30Days = entries.value.filter((e) => new Date(e.date) >= cutoff)
  const safeDays = last30Days.filter((e) => !e.headache && Number(e.caffeineCups || 0) > 0)

  if (safeDays.length === 0) return 0
  return safeDays.reduce((s, e) => s + Number(e.caffeineCups || 0), 0) / safeDays.length
})
</script>

<style scoped>
/* ========= GANZES LAYOUT ========= */
.home {
  width: 100%;
  height: 100vh;
  background: #49435b;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.home-inner {
  flex: 1;
  width: 100%;
  max-width: 430px;
  padding: 24px 20px 96px;
  box-sizing: border-box;
  overflow-y: auto;
  margin: 0 auto;
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
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.greeting-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* STREAK BADGE */
.streak-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.streak-badge:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.streak-badge.is-inactive {
  background: rgba(255, 255, 255, 0.08);
  opacity: 0.45;
  filter: grayscale(1);
}

.streak-badge.is-inactive .streak-emoji {
  filter: grayscale(1);
}

.streak-emoji {
  font-size: 1.2rem;
}

.streak-count {
  font-size: 0.95rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.12s ease,
    filter 0.12s ease;
}

.mood-slot:hover {
  background: rgba(255, 255, 255, 0.12);
  filter: brightness(1.03);
}

.mood-slot:active {
  transform: translateY(1px);
}

.mood-slot.is-selected {
  background: rgba(255, 255, 255, 0.18);
}

.mood-slot:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.55);
  outline-offset: 2px;
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
  height: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

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

.calendar-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 6px;
  font-size: 0.95rem;
}

.calendar-day.is-empty {
  visibility: hidden;
}

.calendar-day-btn {
  border: none;
  background: transparent;
  color: #2a2328;
  font: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  cursor: default;
  opacity: 0.65;
  user-select: none;
}

.calendar-day-btn:disabled {
  cursor: default;
  opacity: 0.65;
}

.calendar-day-btn.has-status {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  color: rgba(0, 0, 0, 0.72);
}

.calendar-day-btn.has-status.is-headache {
  background: #f08a86;
}

.calendar-day-btn.has-status.is-noheadache {
  background: #b8e39a;
}

/* ========= NORMAL SECTION ========= */
.normal-section {
  margin-top: 32px;
  text-align: center;
}

.normal-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  opacity: 0.95;
}

.normal-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.normal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.normal-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.normal-row span:first-child {
  opacity: 0.85;
}

.normal-row span:last-child {
  font-weight: 600;
  color: #f2d3c9;
}

/* ========= BOTTOM NAVIGATION ========= */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
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
