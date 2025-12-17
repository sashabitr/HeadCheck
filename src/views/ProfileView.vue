<template>
  <div class="profile">
    <div class="profile-inner">
      <!-- Statusbar -->
      <header class="status-bar">
        <span class="time">9:41</span>
        <span class="status-spacer"></span>
        <span class="status-icons">📶 🔋</span>
      </header>

      <!-- Großer Avatar -->
      <section class="profile-header">
        <div class="big-avatar">
          <!-- großes Profil-Icon  -->
          <img src="/rsc/profile1.png" alt="Profile" class="big-avatar-img" />
        </div>
        <button class="edit-btn">Edit</button>

        <h1 class="profile-name">
          Mustermann<br />
          Nachname
        </h1>
      </section>

      <!-- Einstellungs-Optionen -->
      <section class="profile-options">
        <div class="option-row">
          <img src="/rsc/profile1.png" alt="My Profile" class="option-icon" />
          <span class="option-text">My Profile</span>
        </div>

        <div class="option-row">
          <img src="/rsc/lock.png" alt="Change Password" class="option-icon" />
          <span class="option-text">Change Password</span>
        </div>

        <div class="option-row">
          <img src="/rsc/globe.png" alt="Change Language" class="option-icon" />
          <span class="option-text">Change Language</span>
        </div>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <button class="nav-btn" @click="goHome">
        <img src="/rsc/home1.png" alt="Home" />
      </button>
      <button class="nav-btn" @click="goWizard">
        <img src="/rsc/plus1.png" alt="Add" />
      </button>
      <button class="nav-btn">
        <img src="/rsc/report1.png" alt="Reports" />
      </button>
      <button class="nav-btn is-active">
        <img src="/rsc/profile2.png" alt="Profile" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/home')
}

function goWizard() {
  router.push('/headache')
}
</script>

<style scoped>
.profile {
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

.profile-inner {
  width: 100%;
  max-width: 430px;
  flex: 1;
  padding: 24px 20px 16px;
  box-sizing: border-box;
}

/* Statusbar (gleich wie auf Home) */
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

/* Großer Avatar-Bereich */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 32px;
}

.big-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.big-avatar-img {
  width: 70%;
  height: auto;
  object-fit: contain;
}

.edit-btn {
  margin-top: 4px;
  margin-bottom: 12px;
  border: none;
  background: transparent;
  color: #ffffffb0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Name unter dem Avatar */
.profile-name {
  margin: 0;
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.4;
}

/* Optionen-Liste */
.profile-options {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.option-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.option-text {
  font-size: 0.95rem;
}

/* Bottom Navigation (gleich wie Home) */
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
