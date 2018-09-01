import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { y: 0 }
    }
  },
  routes
})

Router.beforeEach((to, from, next) => {
  console.log('router before each')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        console.log('no user', user)
        next('/login')
      } else {
        // console.log(user)
        // Check if REAL page
        if (to.matched.some(record => record.meta.requiresREAL)) {
          firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).get().then((userDoc) => {
            console.log('is user real?', userDoc.data())
            if (userDoc.data().realUser) {
              next()
            } else {
              console.log('not real user')
              next('/redirect')
            }
          })
        } else next()
      }
    })
  } else next()
})

export default Router
