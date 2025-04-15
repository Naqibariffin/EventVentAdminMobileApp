import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { auth } from '../firebase'; 
import { onAuthStateChanged } from "firebase/auth";

/** Lazy-loaded views */
const Home = () => import('../views/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const Register = () => import('../views/Register.vue');
const Profile = () => import('../views/MyProfile.vue');
const ManageEvent = () => import('../views/ManageEvent.vue');
const EditEvent = () => import('../views/EditEvent.vue');
const ManageUser = () => import('../views/ManageUser.vue');
const Support = () => import('../views/Support.vue');
const AddUser = () => import ('../views/AddUser.vue');

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  { path: '/support', name: 'Support', component: Support },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/my-profile', 
    name: 'Profile', 
    component: Profile, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/manage-event', 
    name: 'Manage Event', 
    component: ManageEvent, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/edit-event/:eventId', 
    name: 'Edit Event', 
    component: EditEvent, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/manage-user', 
    name: 'Manage User', 
    component: ManageUser, 
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/** Authentication Guard */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // We move onAuthStateChanged outside the navigation guard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        next(); // Allow navigation
      } else {
        next('/home'); // Redirect to home if no user
      }
      unsubscribe(); // Unsubscribe to avoid multiple calls
    });
  } else {
    next(); // Allow navigation if no authentication is required
  }
});

export default router;
