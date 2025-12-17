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
        <span class="title">Headache Check</span>
        <button class="tip-btn" aria-label="Info" @click.stop="openTip">
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
            <path d="M5.6 6.2 6.7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M18.4 6.2 17.3 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
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
      <Transition name="step-blur" mode="out-in">
        <div :key="currentStep" class="step">
          <div v-if="currentStep === 'headache'">
            <h2>Did you have a headache today?</h2>
            <div class="choice-group">
              <label class="choice" :class="{ 'is-selected': answers.headache === 'yes' }">
                <input v-model="answers.headache" type="radio" value="yes" />
                <span>yes</span>
              </label>
              <label class="choice" :class="{ 'is-selected': answers.headache === 'no' }">
                <input v-model="answers.headache" type="radio" value="no" />
                <span>no</span>
              </label>
            </div>

            <div class="field">
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
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 'water'">
            <h2>How much water did you drink today?</h2>
            <div class="input-with-suffix field-inline">
              <input v-model="answers.waterLiters" type="number" min="0" step="0.1" placeholder="0" />
              <span>L</span>
            </div>
          </div>

          <div v-else-if="currentStep === 'caffeine'">
            <h2>Did you consume caffeine today?</h2>
            <div class="choice-group">
              <label class="choice" :class="{ 'is-selected': answers.caffeine === 'yes' }">
                <input v-model="answers.caffeine" type="radio" value="yes" />
                <span>yes</span>
              </label>
              <label class="choice" :class="{ 'is-selected': answers.caffeine === 'no' }">
                <input v-model="answers.caffeine" type="radio" value="no" />
                <span>no</span>
              </label>
            </div>

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
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <button class="next-btn" :disabled="!canProceed" @click="goNext">
        <span>{{ isLastStep ? 'finish' : 'next' }}</span>
        <span class="arrow">→</span>
      </button>
    </footer>

    <Transition name="modal-fade">
      <div v-if="showTip" class="modal-backdrop" @click.self="closeTip">
        <div class="modal">
          <h3>{{ currentTip.title }}</h3>
          <p>{{ currentTip.body }}</p>
          <button class="close-btn" @click="closeTip">OK</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = ['headache', 'sleep', 'water', 'caffeine', 'work', 'screen', 'stress']
const stepIndex = ref(0)
const totalSteps = steps.length

const answers = ref({
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

const stepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() => steps[stepIndex.value])
const isLastStep = computed(() => stepNumber.value === totalSteps)
const progressWidth = computed(() => `${(stepNumber.value / totalSteps) * 100}%`)
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
    body: 'Many people stay under 3–4 cups of coffee a day. ☕',
  },
  work: {
    title: 'Productivity',
    body: 'Take short breaks from work or study from time to time. ☕🧘',
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
const currentTip = computed(() => tips[currentStep.value] ?? { title: 'Tip', body: 'Keep your entries consistent each day.' })

const showTip = ref(false)
function openTip() {
  showTip.value = true
}
function closeTip() {
  showTip.value = false
}

const hasValue = (v) => v !== null && v !== undefined && v !== ''
const canProceed = computed(() => {
  const v = answers.value
  switch (currentStep.value) {
    case 'headache':
      return hasValue(v.headache) && hasValue(v.headacheDuration)
    case 'sleep':
      return hasValue(v.sleepHours) && hasValue(v.sleepQuality)
    case 'water':
      return hasValue(v.waterLiters)
    case 'caffeine':
      if (!hasValue(v.caffeine)) return false
      return v.caffeine === 'no' ? true : hasValue(v.caffeineCups)
    case 'work':
      return hasValue(v.workHours)
    case 'screen':
      return hasValue(v.screenHours)
    case 'stress':
      return hasValue(v.stressLevel)
    default:
      return false
  }
})

function goNext() {
  if (isLastStep.value) {
    router.push('/home')
    return
  }
  stepIndex.value++
}
</script>

<style scoped>
.wizard {
  height: 100%;
  width: 100%;
  background: #49435b;
  color: #f1e9f0;
  display: flex;
  flex-direction: column;
  padding: 28px 20px 28px;
  box-sizing: border-box;
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.status-bar {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 14px;
}

.spacer {
  flex: 1;
}

.status-icons {
  letter-spacing: 0.18em;
}

.header {
  margin: 8px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
}

.title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.tip-btn {
  position: absolute;
  right: 0;
  background: rgba(0, 0, 0, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #f1e9f0;
  border-radius: 10px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.tip-btn:hover {
  background: rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.28);
}

.tip-btn:active {
  transform: translateY(1px);
}

.tip-btn svg {
  width: 22px;
  height: 22px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #b18385;
  width: 0;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.8rem;
  opacity: 0.8;
  text-transform: lowercase;
}

.card {
  flex: 1;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.step h2 {
  font-size: 1rem;
  margin: 0 0 12px;
  font-weight: 600;
}

.choice-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.choice {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.choice input {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  position: relative;
}

.choice input:checked {
  background: #b18385;
  border-color: #b18385;
}

.choice.is-selected {
  background: rgba(255, 255, 255, 0.1);
  border-color: #b18385;
}

.choice span {
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: 0.9rem;
  opacity: 0.85;
}

.field-inline {
  max-width: 200px;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.input-with-suffix input {
  background: transparent;
  border: none;
  color: #f1e9f0;
  font-size: 1rem;
  width: 100%;
  outline: none;
}

.input-with-suffix span {
  opacity: 0.8;
  font-size: 0.9rem;
}

.field-slider input[type='range'] {
  width: 100%;
  accent-color: #b18385;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 4px;
}

.footer {
  margin-top: 18px;
}

.next-btn {
  width: 100%;
  background: #b18385;
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 14px 18px;
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
}

.next-btn:active {
  transform: translateY(1px);
}

.next-btn:disabled {
  opacity: 0.4;
  transform: none;
  cursor: not-allowed;
  background: #b18385;
}

.arrow {
  font-weight: 700;
}

/* Step blur/fade, same feel wie Start→Home */
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

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.modal {
  background: #4b455a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px 20px 18px;
  color: #f1e9f0;
  width: min(360px, 92vw);
  max-height: 70vh;
  overflow: auto;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
  text-align: center;
}

.modal h3 {
  margin: 0 0 10px;
  font-size: 1.08rem;
  color: #ffffff;
  font-weight: 800;
}

.modal p {
  margin: 0 0 16px;
  line-height: 1.5;
  opacity: 0.95;
  color: #fdf9ff;
}

.close-btn {
  width: 100%;
  background: #7d5c9f;
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background 0.2s ease;
}

.close-btn:active {
  transform: translateY(1px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
