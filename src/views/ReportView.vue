<template>
    <div class="report">
        <div class="report-inner">
            <header class="status-bar">
                <span class="time">9:41</span>
                <span class="status-spacer"></span>
                <span class="status-icons">📶 🔋</span>
            </header>

            <!-- ===== PAGE HEADER ===== -->
            <section class="page-header">
                <h1 class="page-title">Headache report</h1>

                <div class="segment-control">
                <button
                    class="segment-btn"
                    :class="{ active: range === 'week' }"
                    @click="range = 'week'"
                >
                    week
                </button>

                <button
                    class="segment-btn"
                    :class="{ active: range === '2weeks' }"
                    @click="range = '2weeks'"
                >
                    2 weeks
                </button>

                <button
                    class="segment-btn"
                    :class="{ active: range === 'month' }"
                    @click="range = 'month'"
                >
                    month
                </button>
                </div>
            </section>

            <Transition name="fade-slide" mode="out-in">
                <section v-if="triggerPercentages" class="trigger-section">
                    <h2>Your Headache Trigger</h2>

                    <div class="donut-row">
                        <svg
                            class="donut"
                            viewBox="0 0 120 120"
                        >
                            <!-- Hintergrund -->
                            <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            stroke-width="14"
                            />

                            <!-- Segmente -->
                            <circle
                            v-for="(t, i) in triggerPercentages"
                            :key="t.key"
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke-width="14"
                            :stroke="colors[t.key]"
                            :stroke-dasharray="dashArray(t.percent)"
                            :stroke-dashoffset="dashOffset(i)"
                            stroke-linecap="butt"
                            transform="rotate(-90 60 60)"
                            />
                        </svg>

                        <!-- Labels -->
                        <div class="donut-labels">
                            <div
                            v-for="t in triggerPercentages"
                            :key="t.key"
                            class="label"
                            >
                            <span
                                class="dot"
                                :style="{ background: colors[t.key] }"
                            ></span>
                            {{ t.label }} — {{ t.percent.toFixed(0) }}%
                            </div>
                        </div>
                    </div>
                </section>
            </Transition>

            <Transition name="fade-slide" mode="out-in">
                <section v-if="headacheHoursPerDay.length" class="hours-section">
                    <h2>Hours of headache per day</h2>

                    <div class="hours-chart-wrapper">
    
                        <!-- Y-AXIS -->
                        <div class="y-axis">
                            <span>4h</span>
                            <span>3h</span>
                            <span>2h</span>
                            <span>1h</span>
                            <span>0h</span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <!-- CHART -->
                        <div class="hours-chart">
                            <div
                            v-for="d in headacheHoursPerDay"
                            :key="d.date"
                            class="bar-wrapper"
                            >
                            <div
                                class="bar"
                                :style="{ height: (d.hours / 4) * 100 + 'px' }"
                            ></div>
                            <span class="day">
                                {{ new Date(d.date).toLocaleDateString('en', { weekday: 'short' }) }}
                            </span>
                            </div>
                        </div>
                    </div>
                </section>
            </Transition>

            <Transition name="fade-slide" mode="out-in">
                <section
                    v-if="weekdayWeekendPercentages"
                    class="weekday-weekend-section"
                    >
                    <h2>Headache on weekdays vs weekends</h2>

                    <div class="donut-row">
                        <svg class="donut" viewBox="0 0 120 120">
                        <!-- Hintergrund -->
                        <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            stroke-width="14"
                        />

                        <!-- Segmente -->
                        <circle
                            v-for="(d, i) in weekdayWeekendPercentages"
                            :key="d.key"
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke-width="14"
                            :stroke="colors[d.key]"
                            :stroke-dasharray="dashArray(d.percent)"
                            :stroke-dashoffset="weekdayWeekendOffset(i)"
                            stroke-linecap="butt"
                            transform="rotate(-90 60 60)"
                        />
                        </svg>

                        <!-- Labels -->
                        <div class="donut-labels">
                        <div
                            v-for="d in weekdayWeekendPercentages"
                            :key="d.key"
                            class="label"
                        >
                            <span
                            class="dot"
                            :style="{ background: colors[d.key] }"
                            ></span>
                            {{ d.label }} — {{ d.percent.toFixed(0) }}%
                        </div>
                        </div>
                    </div>
                </section>
            </Transition>


        </div>

        <!-- BOTTOM NAVIGATION -->
        <nav class="bottom-nav">
            <button class="nav-btn is-active" @click="goHome">
                <img src="/rsc/home1.png" alt="Home" />
            </button>

            <button class="nav-btn" @click="goWizard">
                <img src="/rsc/plus1.png" alt="Add" />
            </button>

            <button class="nav-btn" @click="goReport">
                <img src="/rsc/report2.png" alt="Reports" />
            </button>

            <button class="nav-btn" @click="goProfile">
                <img src="/rsc/profile1.png" alt="Profile" />
            </button>
        </nav>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const range = ref('week')
const router = useRouter()
const entries = ref([])

// Zeitraum filtern
const filteredEntries = computed(() => {
  if (entries.value.length === 0) return []

  const days =
    range.value === 'week' ? 7 :
    range.value === '2weeks' ? 14 :
    30

  // 🔑 letztes Datum aus den Daten
  const lastDate = new Date(
    entries.value[entries.value.length - 1].date
  )

  const cutoff = new Date(lastDate)
  cutoff.setDate(cutoff.getDate() - days + 1)

  return entries.value.filter(
    e => new Date(e.date) >= cutoff
  )
})


const headacheDays = computed(() =>
  filteredEntries.value.filter(e => e.headache)
)

const normalDays = computed(() => {
  const n = filteredEntries.value.filter(e => !e.headache)

  // Fallback: nimm alle normalen Tage aus dem gesamten Datensatz
  if (n.length === 0) {
    return entries.value.filter(e => !e.headache)
  }

  return n
})

function avg(list, key) {
  if (list.length === 0) return 0
  return (
    list.reduce((sum, e) => sum + Number(e[key] || 0), 0) /
    list.length
  )
}

const triggerAnalysis = computed(() => {
  if (headacheDays.value.length === 0) return null

  return {
    sleep: {
      headache: avg(headacheDays.value, 'sleepHours'),
      normal: avg(normalDays.value, 'sleepHours'),
    },
    screen: {
      headache: avg(headacheDays.value, 'screenHours'),
      normal: avg(normalDays.value, 'screenHours'),
    },
    water: {
      headache: avg(headacheDays.value, 'waterLiters'),
      normal: avg(normalDays.value, 'waterLiters'),
    },
    stress: {
      headache: avg(headacheDays.value, 'stressLevel'),
      normal: avg(normalDays.value, 'stressLevel'),
    },
    caffeine: {
      headache:
        headacheDays.value.filter(e => e.caffeine).length /
        headacheDays.value.length,
      normal:
        normalDays.value.filter(e => e.caffeine).length /
        normalDays.value.length,
    },
  }
})

const triggerStrength = computed(() => {
  if (!triggerAnalysis.value) return null

  const t = triggerAnalysis.value

  return {
    lessSleep: Math.max(0, t.sleep.normal - t.sleep.headache),
    moreScreen: Math.max(0, t.screen.headache - t.screen.normal),
    dehydration: Math.max(0, t.water.normal - t.water.headache),
    stress: Math.max(0, t.stress.headache - t.stress.normal),
    caffeine: Math.max(0, t.caffeine.headache - t.caffeine.normal) * 100,
  }
})

const triggerPercentages = computed(() => {
  if (!triggerStrength.value) return null

  const t = triggerStrength.value

  const values = [
    { key: 'sleep', label: 'less sleep', value: t.lessSleep },
    { key: 'screen', label: 'screen time', value: t.moreScreen },
    { key: 'water', label: 'less water', value: t.dehydration },
    { key: 'stress', label: 'stress', value: t.stress },
    { key: 'caffeine', label: 'caffeine', value: t.caffeine },
  ].filter(v => v.value > 0)

  const total = values.reduce((s, v) => s + v.value, 0)

  return values.map(v => ({
    ...v,
    percent: (v.value / total) * 100
  }))
})


onMounted(async () => {
  const stored = JSON.parse(localStorage.getItem('headacheEntries') || '[]')

  let seed = []
  try {
    const res = await fetch('/headacheEntries.json')

    seed = await res.json()
  } catch (err) {
    console.error('Failed to load headacheEntries.json', err)
  }

  const merged = new Map()

  // Seed-Daten
  seed.forEach(e => {
    merged.set(e.date, e)
  })

  // User-Daten überschreiben Seed
  stored.forEach(e => {
    merged.set(e.date, e)
  })

  entries.value = Array.from(merged.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )
})

// Logik der Kreisberechnung
const radius = 45
const circumference = 2 * Math.PI * radius

function dashArray(percent) {
  return `${(percent / 100) * circumference} ${circumference}`
}

function dashOffset(index) {
  if (!triggerPercentages.value) return 0

  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += triggerPercentages.value[i].percent
  }
  return -((offset / 100) * circumference)
}


const colors = {
  sleep: '#f2d3c9',
  screen: '#c8b6e2',
  water: '#9ecad7',
  stress: '#e3a6a1',
  caffeine: '#d1b07c',
  weekdays: '#17bebb',
  weekends: '#735290',
}

const triggerWithAngles = computed(() => {
  if (!triggerPercentages.value) return []

  let currentAngle = 0

  return triggerPercentages.value.map(t => {
    const angle = (t.percent / 100) * 360
    const midAngle = currentAngle + angle / 2

    currentAngle += angle

    return {
      ...t,
      angle,
      midAngle,
    }
  })
})

// Headache per Day
const headacheHoursPerDay = computed(() => {
  if (filteredEntries.value.length === 0) return []

  const days = filteredEntries.value.slice(-7)

  return days.map(e => ({
    date: e.date,
    hours: e.headache
      ? Number(e.headacheDurationHours || 0)
      : 0,
  }))
})

// weekdays vs weekends
const weekdayVsWeekend = computed(() => {
  if (filteredEntries.value.length === 0) return null

  const weekdays = filteredEntries.value.filter(e => {
    const day = new Date(e.date).getDay()
    return day >= 1 && day <= 5
  })

  const weekends = filteredEntries.value.filter(e => {
    const day = new Date(e.date).getDay()
    return day === 0 || day === 6
  })

  function avgHours(list) {
    if (list.length === 0) return 0
    return (
      list.reduce(
        (sum, e) =>
          sum +
          (e.headache ? Number(e.headacheDurationHours || 0) : 0),
        0
      ) / list.length
    )
  }

  return {
    weekdays: avgHours(weekdays),
    weekends: avgHours(weekends),
  }
})

const weekdayWeekendPercentages = computed(() => {
  if (!weekdayVsWeekend.value) return null

  const w = weekdayVsWeekend.value.weekdays
  const we = weekdayVsWeekend.value.weekends

  const total = w + we
  if (total === 0) return null

  return [
    {
      key: 'weekdays',
      label: 'Weekdays',
      value: w,
      percent: (w / total) * 100,
    },
    {
      key: 'weekends',
      label: 'Weekends',
      value: we,
      percent: (we / total) * 100,
    },
  ]
})

function weekdayWeekendOffset(index) {
  if (!weekdayWeekendPercentages.value) return 0

  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += weekdayWeekendPercentages.value[i].percent
  }
  return -((offset / 100) * circumference)
}



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
</script>

<style scoped>
.report {
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

.report-inner {
  lex: 1;                    
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
/* ========= PAGE HEADER ========= */
.page-header {
  padding: 24px 24px 16px;
  text-align: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
}

/* ========= TRIGGER SECTION ========= */
.trigger-section {
  margin-top: 32px;
  text-align: center;
}

.trigger-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  opacity: 0.95;
}

/* Card */
.trigger-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Rows */
.trigger-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.trigger-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Labels */
.trigger-row span:first-child {
  opacity: 0.85;
}

/* Values */
.trigger-row span:last-child {
  font-weight: 600;
  color: #f2d3c9; /* Figma-nahes Rosé */
}


/* ========= SEGMENT CONTROL ========= */
.segment-control {
  display: inline-flex;
  gap: 8px;
  background: transparent;
}

.segment-btn {
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  background: #b58d93; /* inaktiv */
  color: #2f2a35;

  transition: all 0.2s ease;
}

.segment-btn.active {
  background: #ffffff;
  color: #2f2a35;
}

.segment-btn:not(.active):hover {
  opacity: 0.9;
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

/* ========= KREIS ========= */
/* Donut + Legende nebeneinander */
.donut-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

/* Donut links */
.donut {
  width: 160px;
  height: 160px;
  margin: 0;
  flex-shrink: 0;
}

/* Legende rechts */
.donut-labels {
  margin-top: 0;
  align-items: flex-start;
  text-align: left;
}

.label {
  display: flex;
  align-items: center;
  gap: 7px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

/* ========= HOURS SECTION ========= */
.hours-section {
  margin-top: 40px;
  text-align: center;
}

.hours-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.hours-chart-wrapper {
  display: flex;
  align-items: flex-end;
}

/* Y-Achse */
.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 130px;        
  margin-right: 8px;
  font-size: 0.7rem;
  opacity: 0.7;
  text-align: right;
}


/* Chart Container */
.hours-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 130px;
  flex: 1;
  padding: 0 8px;     
}

/* Einzelne Spalte */
.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Balken */
.bar {
  width: 10px;
  background: #b58d93;
  border-radius: 6px 6px 0 0;
  min-height: 2px;
  transition: height 0.5s cubic-bezier(.4,0,.2,1);
}

/* Wochentag */
.day {
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: 14px;   
}

/* ========= WEEKDAY VS WEEKEND ========= */
.weekday-weekend-section {
  margin-top: 40px;
  text-align: center;
}

.weekday-weekend-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.donut circle {
  transition:
    stroke-dasharray 0.8s ease,
    stroke-dashoffset 0.8s ease,
    stroke 0.4s ease;
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}


</style>