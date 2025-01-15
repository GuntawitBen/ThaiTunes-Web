import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Songs from '../views/Songs.vue';
import Artistpage from '../views/Artistpage.vue';
import ArtistList from '../views/Artistlist.vue';
import temp from '../views/temp.vue';

import {getAuth, onAuthStateChanged} from 'firebase/auth'

const routerHistory = createWebHistory()

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path:'/temp',
    name:'temp',
    component: temp,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/artist/:artistName',
    name: 'artist',
    component: Artistpage,
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/artist',
    name: 'artistlist',
    component: ArtistList,
    meta: {
      requiresAuth: true
  }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const getCurrentUser = () =>{
  return new Promise((resolve, reject)=> {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user)=>{
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth) {
    if(await getCurrentUser()){
      console.log("You are authorized to access this area.");
      next()
    } else {
      console.log("You are not authorized to access this area.")
      next('signin')
    }
  } else {
    next()
  }
})

export default router;
