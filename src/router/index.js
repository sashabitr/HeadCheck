import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'start', component: StartView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/profile', name: 'profile', component: ProfileView },
  ],
})

export default router
