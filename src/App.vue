<!-- src/App.vue -->
<template>
  <div class="app-root">
    <div class="phone-frame">
      <RouterView v-slot="{ Component, route }">
        <Transition v-if="shouldBlur" name="route-blur" mode="out-in" appear>
          <component :is="Component" :key="route.fullPath" />
        </Transition>
        <component v-else :is="Component" :key="route.fullPath" />
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Warum: wir brauchen from→to, um gezielt nur Start⇄Home zu animieren
const fromName = ref(route.name ?? null)
const toName = ref(route.name ?? null)

watch(
  () => route.name,
  (to, from) => {
    fromName.value = from ?? null
    toName.value = to ?? null
  },
  { immediate: true },
)

const normalize = (n) => (n ?? '').toString().toLowerCase()
const isStart = (n) => {
  const s = normalize(n)
  return s === 'start' || s === 'startview'
}
const isHome = (n) => {
  const s = normalize(n)
  return s === 'home' || s === 'homeview'
}

const shouldBlur = computed(() => {
  const f = fromName.value
  const t = toName.value
  return (isStart(f) && isHome(t)) || (isHome(f) && isStart(t))
})
</script>

<style>
/* Grundlayout */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* App-Hintergrund */
.app-root {
  height: 100%;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* „Handy“-Rahmen */
.phone-frame {
  width: 100%;
  max-width: 430px;
  height: 100vh;
  max-height: 930px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
  background: #49435b;
}

/* -------------------- Transition: Start ⇄ Home -------------------- */
/* ENTER (neue Route weich rein) */
.route-blur-enter-active {
  transition:
    opacity 0.6s ease,
    filter 0.6s ease,
    transform 0.6s ease;
}
.route-blur-enter-from {
  opacity: 0;
  filter: blur(16px);
  transform: scale(1.03);
}
.route-blur-enter-to {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

/* LEAVE (alte Route weich raus) */
.route-blur-leave-active {
  transition:
    opacity 0.45s ease,
    filter 0.45s ease,
    transform 0.45s ease;
}
.route-blur-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
.route-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.98);
}
</style>
