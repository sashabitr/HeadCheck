<template>
  <div class="streak" @click="goReport">
    <div class="logo-wrap">
        <div class="circle">
        <div class="emoji">🔥</div>
        <div class="count">+1</div>
        </div>
    </div>

    <h1>{{ streak }} day streak</h1>

    <div class="bottom">
      <img src="/rsc/tap.png" class="tap-icon" alt="Tap icon" />
      <p>Tap to continue</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  streak: {
    type: Number,
    required: true
  }
})

const router = useRouter()

function goReport() {
  router.push('/headache-report')
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

.streak {
  height: 100%;
  background: linear-gradient(180deg,#5c516b,#8d7d93);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pop 0.6s ease-out;
}

.emoji {
  font-size: 3.5rem;
  animation: flame 1.6s infinite;
}

.count {
  font-size: 1.4rem;
  font-weight: 800;
  margin-top: 4px;
}

@keyframes pop {
  0% { transform: scale(0.6); opacity: 0 }
  100% { transform: scale(1); opacity: 1 }
}

@keyframes flame {
  0%,100% { transform: scale(1) }
  50% { transform: scale(1.1) }
}

</style>