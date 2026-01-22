<template>
  <div class="profile">
    <div class="profile-inner">

      <!-- STATUSBAR -->
      <!-- Simulierte Statusleiste (Uhrzeit, Empfang, Akku) -->
      <header class="status-bar">
        <span class="time">9:41</span>
        <span class="status-spacer"></span>
        <span class="status-icons">📶 🔋</span>
      </header>

      <!-- PROFIL HEADER -->
      <!-- Avatar, Bearbeiten-Button und Name -->
      <section class="profile-header">

        <!-- Großer Avatar -->
        <div class="big-avatar">
          <img
            src="/rsc/profile1.png"
            alt="Profile"
            class="big-avatar-img"
          />
        </div>

        <!-- Platzhalter für Profil-Bearbeitung -->
        <button class="edit-btn">Edit</button>

        <!-- Anzeigename -->
        <h1 class="profile-name">
          Mustermann<br />
          Nachname
        </h1>
      </section>

      <!-- EINSTELLUNGEN  -->
      <section class="profile-options">

        <!-- ===== ACCOUNT ===== -->
        <div class="section-block">
          <div class="section-title">Account</div>

          <button class="option-row" type="button">
            <img src="/rsc/profile1.png" alt="" class="option-icon" />
            <span class="option-text">My Profile</span>
            <span class="option-chevron">&gt;</span>
          </button>

          <button class="option-row" type="button">
            <img src="/rsc/globe.png" alt="" class="option-icon" />
            <span class="option-text">Change Email</span>
            <span class="option-chevron">&gt;</span>
          </button>

          <button class="option-row" type="button">
            <img src="/rsc/lock.png" alt="" class="option-icon" />
            <span class="option-text">Change Password</span>
            <span class="option-chevron">&gt;</span>
          </button>

          <button class="option-row" type="button">
            <img src="/rsc/lock.png" alt="" class="option-icon" />
            <span class="option-text">Privacy Settings</span>
            <span class="option-chevron">&gt;</span>
          </button>
        </div>

        <!-- SUPPORT -->
        <div class="section-block">
          <div class="section-title">Support</div>

          <button class="option-row" type="button">
            <img src="/rsc/lamp.png" alt="" class="option-icon" />
            <span class="option-text">Help &amp; FAQ</span>
            <span class="option-chevron">&gt;</span>
          </button>

          <button class="option-row" type="button">
            <img src="/rsc/report1.png" alt="" class="option-icon" />
            <span class="option-text">Report a Problem</span>
            <span class="option-chevron">&gt;</span>
          </button>

          <button class="option-row" type="button">
            <img src="/rsc/tap.png" alt="" class="option-icon" />
            <span class="option-text">Feedback</span>
            <span class="option-chevron">&gt;</span>
          </button>
        </div>

        <!-- AKTIONEN  -->
        <div class="section-block actions-block">
          <button class="option-row" type="button">
            <img src="/rsc/close.png" alt="" class="option-icon" />
            <span class="option-text">Log out</span>
          </button>

          <button class="option-row danger" type="button">
            <img src="/rsc/report2.png" alt="" class="option-icon" />
            <span class="option-text">Delete Account</span>
          </button>
        </div>
      </section>
    </div>

    <!-- BOTTOM NAVIGATION  -->
    <!-- Feste Navigation am unteren Bildschirmrand -->
    <nav class="bottom-nav">
      <button class="nav-btn" @click="goHome">
        <img src="/rsc/home1.png" alt="Home" />
      </button>

      <button class="nav-btn" @click="goWizard">
        <img src="/rsc/plus1.png" alt="Add" />
      </button>

      <button class="nav-btn" @click="goReport">
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

/**
 * ProfileView
 *
 * Diese View stellt die Profil- und Einstellungsseite der App dar.
 * Sie enthält:
 * - Benutzerinformationen (Avatar, Name)
 * - Account- und Support-Optionen
 * - Eine Bottom-Navigation zur App-Navigation
 */

/**
 * Vue Router Instanz zur Navigation zwischen Views.
 */
const router = useRouter()

/**
 * Navigiert zur Home-Seite.
 *
 * Wird über die Bottom-Navigation ausgelöst.
 */
function goHome() {
  router.push('/home')
}

/**
 * Navigiert zur Intro-Seite des Daily-Wizards.
 *
 * Von dort startet der tägliche Kopfschmerz-Check.
 */
function goWizard() {
  router.push('/headache')
}

/**
 * Navigiert zur Report-Seite.
 *
 * Dort werden Auswertungen und Diagramme angezeigt.
 */
function goReport() {
  router.push('/headache-report')
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
  overflow-y: auto;
  scrollbar-width: thin;
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
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.55);
  padding-left: 6px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  cursor: pointer;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  appearance: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.1s ease;
}

.option-row:active {
  transform: translateY(1px);
}

.option-row:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.option-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
}

.option-text {
  font-size: 0.95rem;
  flex: 1;
}

.option-chevron {
  opacity: 0.55;
  font-size: 0.9rem;
}

.actions-block {
  margin-top: 6px;
  gap: 10px;
}

.option-row.danger {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #ffdadf;
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

.profile-inner::-webkit-scrollbar {
  width: 6px;
}

.profile-inner::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
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
