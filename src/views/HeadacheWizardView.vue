<!-- src/views/HeadacheWizardView.vue -->
<template>
  <div class="wizard">
    <!-- Status bar -->
    <header class="status-bar">
      <span class="time">9:41</span>
      <span class="spacer"></span>
      <span class="status-icons">📶 🔋</span>
    </header>

    <!-- Title + Progress -->
    <section class="header">
      <div class="title-row">
        <button
          ref="closeWizardButtonRef"
          class="close-wizard-btn"
          type="button"
          @click.stop="openStopConfirm"
        >
          close
        </button>
        <span class="title">Headache Check</span>
        <button ref="tipButtonRef" class="tip-btn" aria-label="Info" @click.stop="openTip">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9.5 19h5v-1.2c0-1.1.5-1.8 1.2-2.7.8-1 1.8-2.4 1.8-4.6A6.5 6.5 0 0 0 12 4 6.5 6.5 0 0 0 6.5 10.5c0 2.2 1 3.6 1.8 4.6.7.9 1.2 1.6 1.2 2.7z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M10 20.2h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M12 2.8v1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path
              d="M5.6 6.2 6.7 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M18.4 6.2 17.3 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          <span v-if="showTip" class="sr-only">Tip open</span>
          <span v-else class="sr-only">Tip closed</span>
        </button>
      </div>
      <div class="progress-row">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
        </div>
        <span class="progress-label">questions {{ stepNumber }} of {{ totalSteps }}</span>
      </div>
    </section>

    <!-- Question card -->
    <section class="card">
      <div class="hero-panel" aria-hidden="true">
        <img class="hero-image" :src="heroPrimarySrc" alt="" @error="handleHeroError" />
      </div>
      <Transition name="step-blur" mode="out-in">
        <div :key="currentStep" class="step">
          <div class="step-badge">Step {{ stepNumber }} of {{ totalSteps }}</div>
          <div v-if="currentStep === 'headache'">
            <h2>Did you have a headache today?</h2>
            <YesNoChoice v-model="answers.headache" />

            <div class="field field-spaced">
              <label>How long?</label>
              <div class="input-with-suffix">
                <input v-model="answers.headacheDuration" type="number" min="0" placeholder="0" />
                <span>h</span>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 'sleep'">
            <h2>How many hours did you sleep?</h2>
            <div class="input-with-suffix field-inline">
              <input v-model="answers.sleepHours" type="number" min="0" placeholder="0" />
              <span>h</span>
            </div>

            <div class="field field-slider">
              <label>Rate your sleep:</label>
              <input v-model.number="answers.sleepQuality" type="range" min="1" max="5" />
              <div class="range-labels">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 'water'">
            <h2>How much water did you drink today?</h2>
            <div class="input-with-suffix field-inline">
              <input
                v-model="answers.waterLiters"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
              />
              <span>L</span>
            </div>
          </div>

          <div v-else-if="currentStep === 'caffeine'">
            <h2>Did you consume caffeine today?</h2>
            <YesNoChoice v-model="answers.caffeine" />

            <div class="field">
              <label>How many cups?</label>
              <div class="input-with-suffix">
                <input v-model="answers.caffeineCups" type="number" min="0" placeholder="0" />
                <span>cups</span>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 'work'">
            <h2>How long did you work/study today?</h2>
            <div class="input-with-suffix field-inline">
              <input v-model="answers.workHours" type="number" min="0" placeholder="0" />
              <span>h</span>
            </div>
          </div>

          <div v-else-if="currentStep === 'screen'">
            <h2>How long were you in front of a screen?</h2>
            <div class="input-with-suffix field-inline">
              <input v-model="answers.screenHours" type="number" min="0" placeholder="0" />
              <span>h</span>
            </div>
          </div>

          <div v-else-if="currentStep === 'stress'">
            <h2>Rate your stress level today:</h2>
            <div class="field field-slider">
              <input v-model.number="answers.stressLevel" type="range" min="1" max="5" />
              <div class="range-labels">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <Button class="next-btn" :disabled="!canProceed" type="button" @click="goNext">
        <span v-if="isLastStep">finish</span>
        <span v-else>next</span>
        <span class="arrow">→</span>
      </Button>
    </footer>

    <!-- Tip modal -->
    <AppModal :open="showTip" :title="currentTip.title" @close="closeTip">
      <p>{{ currentTip.body }}</p>
      <button class="close-btn" type="button" @click="closeTip">OK</button>
    </AppModal>

    <!-- Stop confirm modal -->
    <AppModal :open="showStopConfirm" title="Stop the check?" @close="closeStopConfirm">
      <p>you sure you want to stop ?</p>
      <template #actions>
        <button class="secondary-btn" type="button" @click="closeStopConfirm">Cancel</button>
        <button class="close-btn" type="button" @click="confirmStop">Stop</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, toRefs } from 'vue'
import { useFocus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppModal from '@/components/AppModal.vue'
import Button from 'primevue/button'
import YesNoChoice from '@/components/YesNoChoice.vue'
import { useLocalDate } from '@/composables/useLocalDate'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useDailyStore } from '@/state/dailyState'

const DAILY_SURVEY_STORAGE_KEY = 'dailySurveyResult'

const router = useRouter()
const dailyStore = useDailyStore()
const { didDailySurveyToday } = storeToRefs(dailyStore)
const { toLocalIsoDate } = useLocalDate()

const closeWizardButtonRef = ref(null)
const tipButtonRef = ref(null)
const { focused: closeWizardFocused } = useFocus(closeWizardButtonRef)
const { focused: tipButtonFocused } = useFocus(tipButtonRef)

const steps = ['headache', 'sleep', 'water', 'caffeine', 'work', 'screen', 'stress']
const stepIndex = ref(0)
const totalSteps = steps.length

const answers = reactive({
  headache: '',
  headacheDuration: '',
  sleepHours: '',
  sleepQuality: 3,
  waterLiters: '',
  caffeine: '',
  caffeineCups: '',
  workHours: '',
  screenHours: '',
  stressLevel: 3,
})

const formSchema = toTypedSchema(
  z.object({
    headache: z.string().optional(),
    headacheDuration: z.union([z.string(), z.number()]).optional(),
    sleepHours: z.union([z.string(), z.number()]).optional(),
    sleepQuality: z.number().optional(),
    waterLiters: z.union([z.string(), z.number()]).optional(),
    caffeine: z.string().optional(),
    caffeineCups: z.union([z.string(), z.number()]).optional(),
    workHours: z.union([z.string(), z.number()]).optional(),
    screenHours: z.union([z.string(), z.number()]).optional(),
    stressLevel: z.number().optional(),
  }),
)

const { setValues, validate } = useForm({
  validationSchema: formSchema,
  initialValues: { ...answers },
})

const stepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() => steps[stepIndex.value])
const isLastStep = computed(() => stepNumber.value === totalSteps)
const progressWidth = computed(() => `${(stepNumber.value / totalSteps) * 100}%`)
const heroPrimarySrc = '/rsc/Headcheck-Hero.png'
const heroFallbackSrc = '/rsc/human-brain.png'

const tips = {
  headache: {
    title: 'Quick note',
    body: 'Logging headaches daily helps spot patterns faster.',
  },
  sleep: {
    title: "Don't forget",
    body: 'Your body needs at least 8 hours of sleep to fully recharge. 🛏️',
  },
  water: {
    title: 'Remember to stay hydrated!',
    body: 'Many people need around 2–3 liters (8–12 cups) of water per day. 💧',
  },
  caffeine: {
    title: 'Coffee guide',
    body: 'Many people stay under 3–4 cups of coffee a day. ☕️',
  },
  work: {
    title: 'Productivity',
    body: 'Take short breaks from work or study from time to time. 🧑‍💻',
  },
  screen: {
    title: 'Screen time',
    body: 'Long screen sessions can trigger headaches. 🖥️',
  },
  stress: {
    title: 'Your stress level',
    body: 'Your body needs a break from stress sometimes. 🧠',
  },
}

const currentTip = computed(
  () => tips[currentStep.value] ?? { title: 'Tip', body: 'Keep your entries consistent each day.' },
)

const uiState = reactive({
  showTip: false,
  showStopConfirm: false,
})

const { showTip, showStopConfirm } = toRefs(uiState)

const hasValue = (v) => v !== null && v !== undefined && v !== ''

const canProceed = computed(() => {
  const v = answers
  switch (currentStep.value) {
    case 'headache':
      return hasValue(v.headache) && (v.headache === 'no' || hasValue(v.headacheDuration))
    case 'sleep':
      return hasValue(v.sleepHours) && hasValue(v.sleepQuality)
    case 'water':
      return hasValue(v.waterLiters)
    case 'caffeine':
      if (!hasValue(v.caffeine)) return false
      return v.caffeine === 'no' ? true : hasValue(v.caffeineCups)
    case 'work':
      return true
    case 'screen':
      return hasValue(v.screenHours)
    case 'stress':
      return hasValue(v.stressLevel)
    default:
      return false
  }
})

function openTip() {
  showTip.value = true
}

function handleHeroError(event) {
  const target = event?.target
  if (target?.src && !target.src.endsWith(heroFallbackSrc)) {
    target.src = heroFallbackSrc
  }
}

function closeTip() {
  showTip.value = false
  nextTick(() => {
    tipButtonFocused.value = true
  })
}

function openStopConfirm() {
  showStopConfirm.value = true
}

function closeStopConfirm() {
  showStopConfirm.value = false
  nextTick(() => {
    closeWizardFocused.value = true
  })
}

async function confirmStop() {
  showStopConfirm.value = false
  try {
    await router.push({ name: 'home' })
  } catch {
    try {
      await router.push('/')
    } catch {
      router.back()
    }
  }
}

function persistTodaySurveyToLocalStorage() {
  const today = toLocalIsoDate(new Date())

  const headacheYesNo = answers.headache
  if (headacheYesNo !== 'yes' && headacheYesNo !== 'no') return

  const payload = {
    date: today,
    headacheAnswered: true,
    headache: headacheYesNo === 'yes',
    headacheDuration: Number(answers.headacheDuration || 0),
    sleepHours: Number(answers.sleepHours || 0),
    sleepQuality: Number(answers.sleepQuality || 0),
    waterLiters: Number(answers.waterLiters || 0),
    caffeine: answers.caffeine === 'yes',
    caffeineCups: Number(answers.caffeineCups || 0),
    workHours: Number(answers.workHours || 0),
    screenHours: Number(answers.screenHours || 0),
    stressLevel: Number(answers.stressLevel || 0),
    updatedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(DAILY_SURVEY_STORAGE_KEY, JSON.stringify(payload))
  } catch {}
}

function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0

  const dates = entries.map((e) => e.date).sort((a, b) => new Date(b) - new Date(a))

  let streak = 0
  const expected = new Date()
  expected.setHours(0, 0, 0, 0)
  expected.setDate(expected.getDate() - 1)

  for (const d of dates) {
    const current = new Date(d)
    current.setHours(0, 0, 0, 0)

    if (current.getTime() === expected.getTime()) {
      streak++
      expected.setDate(expected.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

async function calculateFinalStreakFromJson() {
  const res = await fetch('/headacheEntries.json')
  const data = await res.json()

  const today = toLocalIsoDate(new Date())

  const answeredBeforeToday = (data || [])
    .map((e) => ({
      ...e,
      headacheAnswered:
        typeof e?.headacheAnswered === 'boolean'
          ? e.headacheAnswered
          : typeof e?.headache === 'boolean',
    }))
    .filter((e) => e.headacheAnswered === true && e.date < today)

  const base = calculateStreak(answeredBeforeToday)
  return base + 1
}

async function goNext() {
  setValues({ ...answers }, false)
  await validate()

  if (isLastStep.value) {
    persistTodaySurveyToLocalStorage()
    didDailySurveyToday.value = true

    const finalStreak = await calculateFinalStreakFromJson()
    router.push({ name: 'streak', params: { streak: finalStreak } })
    return
  }

  if (currentStep.value === 'work' && !hasValue(answers.workHours)) {
    answers.workHours = 0
  }
  stepIndex.value++
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.wizard {
  --bg-top: #2f263f;
  --bg-bottom: #4a3761;
  --card-surface: rgba(36, 27, 54, 0.78);
  --card-border: rgba(255, 255, 255, 0.12);
  --accent: #c6a3ff;
  --accent-strong: #b486ff;
  --accent-warm: #f2a3c4;
  --text-main: #f5f0f9;
  --text-soft: rgba(245, 240, 249, 0.7);
  height: 100%;
  width: 100%;
  background:
    radial-gradient(1200px 480px at 20% -10%, rgba(198, 163, 255, 0.35), transparent 60%),
    radial-gradient(900px 540px at 90% 20%, rgba(242, 163, 196, 0.22), transparent 60%),
    linear-gradient(180deg, var(--bg-top), var(--bg-bottom));
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  padding: 32px 22px 32px;
  box-sizing: border-box;
  font-family: 'Sora', 'SF Pro Display', 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.wizard::before,
.wizard::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(0);
  opacity: 0.55;
  z-index: 0;
  pointer-events: none;
}

.wizard::before {
  width: 260px;
  height: 260px;
  left: -80px;
  top: 140px;
  background: radial-gradient(circle, rgba(198, 163, 255, 0.5), transparent 65%);
}

.wizard::after {
  width: 220px;
  height: 220px;
  right: -60px;
  bottom: 120px;
  background: radial-gradient(circle, rgba(242, 163, 196, 0.4), transparent 70%);
}

.status-bar {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 18px;
  z-index: 2;
}

.spacer {
  flex: 1;
}

.status-icons {
  letter-spacing: 0.18em;
}

.header {
  margin: 12px 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
}

.title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.tip-btn,
.close-wizard-btn {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-main);
  border-radius: 12px;
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.tip-btn {
  right: 0;
}

.close-wizard-btn {
  left: 0;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: lowercase;
}

.tip-btn:hover,
.close-wizard-btn:hover {
  background: rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.28);
}

.tip-btn:active,
.close-wizard-btn:active {
  transform: translateY(1px);
}

.tip-btn svg {
  width: 22px;
  height: 22px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress-track::before {
  content: '';
  position: absolute;
  inset: -6px 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.45) 0 2px, transparent 3px);
  background-size: 26px 8px;
  background-position: 4px center;
  opacity: 0.55;
  pointer-events: none;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-warm), var(--accent));
  width: 0;
  border-radius: 999px;
  transition: width 0.3s ease;
  box-shadow: 0 0 12px rgba(198, 163, 255, 0.5);
  position: relative;
  z-index: 1;
}

.progress-label {
  font-size: 0.8rem;
  opacity: 0.75;
  text-transform: lowercase;
  color: var(--text-soft);
}

.card {
  flex: 1;
  background: var(--card-surface);
  border-radius: 20px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 24px 45px rgba(18, 12, 32, 0.35);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(18px);
  animation: card-rise 0.6s ease;
}

.hero-panel {
  height: 190px;
  border-radius: 18px;
  background:
    linear-gradient(160deg, rgba(20, 12, 34, 0.65), rgba(56, 40, 86, 0.55));
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
  pointer-events: none;
}

.hero-panel::before,
.hero-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.hero-panel::before {
  z-index: 1;
  background: linear-gradient(180deg, rgba(26, 17, 42, 0.1), rgba(26, 17, 42, 0.45));
}

.hero-panel::after {
  z-index: 2;
  background: radial-gradient(circle at 55% 35%, rgba(255, 255, 255, 0.25), transparent 55%);
  mix-blend-mode: screen;
  opacity: 0.55;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  filter: saturate(1.15) brightness(1.05);
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-badge {
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-soft);
}

.step h2 {
  font-size: 1.1rem;
  margin: 0 0 12px;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-spaced {
  margin-top: 8px;
}

.field label {
  font-size: 0.9rem;
  opacity: 0.85;
  color: var(--text-soft);
}

.field-inline {
  max-width: 200px;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  background: rgba(12, 8, 24, 0.25);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.input-with-suffix input {
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 1rem;
  width: 100%;
  outline: none;
}

.input-with-suffix input::placeholder {
  color: rgba(245, 240, 249, 0.45);
}

.input-with-suffix span {
  opacity: 0.8;
  font-size: 0.9rem;
}

.field-slider input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
  background: transparent;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 4px;
}

.footer {
  margin-top: 24px;
  z-index: 2;
}

.next-btn {
  width: 100%;
  background: linear-gradient(120deg, var(--accent-warm), var(--accent-strong));
  border: none;
  color: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background 0.2s ease;
  box-shadow:
    0 10px 20px rgba(180, 134, 255, 0.35),
    0 2px 6px rgba(21, 10, 40, 0.4);
}

.next-btn:active {
  transform: translateY(1px);
}

.next-btn:disabled {
  opacity: 0.4;
  transform: none;
  cursor: not-allowed;
  background: linear-gradient(120deg, var(--accent-warm), var(--accent-strong));
}

.arrow {
  font-weight: 700;
}

:deep(.choice-group) {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

:deep(.choice) {
  background: rgba(12, 8, 24, 0.25);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 14px 16px;
  color: var(--text-main);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

:deep(.choice input) {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

:deep(.choice.is-selected) {
  background: linear-gradient(140deg, rgba(198, 163, 255, 0.2), rgba(242, 163, 196, 0.2));
  border-color: rgba(198, 163, 255, 0.6);
  box-shadow: 0 10px 18px rgba(57, 32, 94, 0.35);
}

:deep(.choice input:checked) {
  background: var(--accent);
  border-color: var(--accent);
}

:deep(.choice span) {
  text-transform: none;
  letter-spacing: 0.02em;
}

.step-blur-enter-active {
  transition:
    opacity 0.45s ease,
    filter 0.45s ease,
    transform 0.45s ease;
}
.step-blur-leave-active {
  transition:
    opacity 0.35s ease,
    filter 0.35s ease,
    transform 0.35s ease;
}
.step-blur-enter-from {
  opacity: 0;
  filter: blur(12px);
  transform: translateY(6px) scale(1.01);
}
.step-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-6px) scale(0.99);
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none;
  }
  .step-blur-enter-active,
  .step-blur-leave-active {
    transition: none;
  }
}

@media (max-width: 420px) {
  .wizard {
    padding: 24px 18px 26px;
  }

  .card {
    padding: 20px;
  }

  .hero-panel {
    height: 160px;
  }
}
</style>
