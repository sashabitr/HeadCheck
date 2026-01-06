import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import HeadacheWizardView from '../views/HeadacheWizardView.vue'
import HeadacheIntroView from '../views/HeadacheIntroView.vue'
import HeadacheStreakView from '../views/HeadacheStreakView.vue'
import ReportView from '../views/ReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'start', component: StartView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/headache', name: 'wizard-intro', component: HeadacheIntroView },
    { path: '/headache-check', name: 'wizard', component: HeadacheWizardView },
    {
      path: '/headache-streak/:streak',
      name: 'streak',
      component: HeadacheStreakView,
      props: route => ({
        streak: Number(route.params.streak)
      })
    },
    { path: '/headache-report', name: 'report', component: ReportView },
  ],
})

export default router
