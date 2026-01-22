<!-- src/views/SplashView.vue -->
<template>
  <!-- ================= SPLASH SCREEN ================= -->
  <!-- Start-/Begrüßungsansicht der App -->
  <div class="splash" @click="goNext">

    <!-- Zentrales Hero-Element (Logo + Titel) -->
    <div class="hero">

      <!-- Gehirn-Icon als visuelles Hauptmotiv -->
      <img
        src="/rsc/human-brain.png"
        class="logo"
        alt="Brain Logo"
      />

      <!-- App-Titel, zweizeilig gestaltet -->
      <div class="title">
        <span class="line1">Head</span>
        <span class="line2">Check</span>
      </div>
    </div>

    <!-- Hinweisbereich am unteren Bildschirmrand -->
    <div class="bottom">
      <img
        src="/rsc/tap.png"
        class="tap-icon"
        alt="Tap icon"
      />
      <p>Tap to continue</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

/**
 * Router-Instanz für die Navigation
 */
const router = useRouter()

/**
 * Wird beim Klick auf den Splash-Screen ausgeführt.
 * Startet eine Blur-Out-Animation und navigiert
 * nach deren Ende zur Home-Ansicht.
 */
function goNext() {
  // Splash-Element aus dem DOM holen
  const splash = document.querySelector('.splash')

  // Fallback: Falls Element nicht existiert, direkt navigieren
  if (!splash) {
    router.push('/home')
    return
  }

  // ⭐ Blur-Out-Animation per CSS-Klasse starten
  splash.classList.add('blur-out')

  // Navigation nach Ende der Animation (0.8 Sekunden)
  setTimeout(() => {
    router.push('/home')
  }, 800)
}
</script>

<style scoped>
/* ================= SPLASH CONTAINER ================= */
/* Vollflächiger Startscreen mit Farbverlauf */
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

/* ================= HERO BEREICH ================= */
/* Logo und Titel liegen übereinander */
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Gehirn-Logo */
.logo {
  width: 350px;
  height: auto;
  opacity: 0.8;
  transform: scaleX(-1);
  filter: invert(80%)
    grayscale(1)
    brightness(0.4)
    drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.3));
}

/* Titel-Container */
.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  line-height: 1.1;
  text-align: left;
}

/* Erste Titelzeile */
.line1 {
  display: block;
  font-size: clamp(4.5rem, 5vw, 3rem);
  margin-left: -10px;
}

/* Zweite Titelzeile (versetzt) */
.line2 {
  display: block;
  font-size: clamp(4.5rem, 5vw, 3rem);
  margin-left: 60px;
}

/* ================= UNTERER HINWEIS ================= */
/* Tap-Hinweis am unteren Bildschirmrand */
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

/* Tap-Icon mit Pulsanimation */
.tap-icon {
  width: 50px;
  height: 50px;
  animation: pulse 1.6s infinite ease-in-out;
}

/* Puls-Animation für das Tap-Icon */
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

/* ================= BLUR-OUT ANIMATION ================= */
/* Wird beim Klick aktiviert */
.blur-out {
  animation: blurOut 0.8s ease forwards;
}

/* Übergangsanimation beim Verlassen des Splash-Screens */
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
