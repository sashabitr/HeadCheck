<template>
  <div class="intro" @click="startWizard">
    <div class="logo-wrap">
      <img src="/rsc/human-brain.png" alt="Head icon" class="logo" />
      <h1 class="title">
        <span>Time for your daily</span>
        <span>headache questions</span>
      </h1>
    </div>

    <div class="bottom">
      <img src="/rsc/tap.png" class="tap-icon" alt="Tap icon" />
      <p>Tap to continue</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function startWizard() {
  router.push('/headache-check')
}
</script>

<style scoped>
.intro {
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, #6b6074 0%, #8d7d93 32%, #b8a1af 55%, #7b6a7f 78%, #53445a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: #f5f0f7;
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  cursor: pointer;
}

.logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 360px;
  max-width: 80vw;
  opacity: 0.25;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25));
  transform: scaleX(-1);
}

.title {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.2rem);
  line-height: 1.12;
  font-weight: 850;
  text-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  text-align: center;
  letter-spacing: -0.01em;
}

.title span {
  display: block;
  max-width: 90vw;
}

.bottom {
  position: absolute;
  bottom: 34px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.9;
}

.tap-icon {
  width: 52px;
  height: 52px;
  animation: pulse 1.6s infinite ease-in-out;
}

.bottom p {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.02em;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}
</style>
