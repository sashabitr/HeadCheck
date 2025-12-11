<template>
  <div class="splash" @click="goNext">
    <div class="hero">
      <img src="/rsc/human-brain.png" class="logo" alt="Brain Logo" />

      <div class="title">
        <span class="line1">Head</span>
        <span class="line2">Check</span>
      </div>
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

function goNext() {
  const splash = document.querySelector('.splash')
  if (!splash) {
    router.push('/home')
    return
  }

  // ⭐ langsame Blur-Out Animation starten
  splash.classList.add('blur-out')

  // Navigation nach Animation (0.8s)
  setTimeout(() => {
    router.push('/home')
  }, 800)
}
</script>

<style scoped>
.splash {
  height: 100%;
  width: 100%;
  background: linear-gradient(
    to bottom,
    #6f5f7f 0%,
    #8a7a93d8 20%,
    #d8bdcce2 45%,
    #85748fd4 70%,
    #4a3d56 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  opacity: 1;
  filter: blur(0px);
}

/* Bild + Text übereinander */
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Kopf-Logo */
.logo {
  width: 350px;
  height: auto;
  opacity: 0.8;
  transform: scaleX(-1);
  filter: invert(80%) grayscale(1) brightness(0.4) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.3));
}

/* Titel */
.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  line-height: 1.1;
  text-align: left;
}

.line1 {
  display: block;
  font-size: clamp(4.5rem, 5vw, 3rem);
  margin-left: -10px;
}

.line2 {
  display: block;
  font-size: clamp(4.5rem, 5vw, 3rem);
  margin-left: 60px;
}

/* Tap-Bereich unten */
.bottom {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tap-icon {
  width: 50px;
  height: 50px;
  animation: pulse 1.6s infinite ease-in-out;
}

/* Puls Animation für Tap-Icon */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* ⭐ LANGSAME Blur-Out Transition */
.blur-out {
  animation: blurOut 0.8s ease forwards;
}

@keyframes blurOut {
  0% {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: scale(1.03);
  }
}
</style>
