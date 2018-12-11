// import Vue from 'vue'
// import Vuex from 'vuex'
// import FieryVuex, { fieryBindings, fieryActions, fieryMutations, fieryMapMutations, fieryState } from 'fiery-vuex'

// import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/firestore'

// /**
//  * Settings for dev firebase instance
//  * @const {object}
//  */
// const devSettings = {
//   apiKey: 'AIzaSyAjXGlux1zLL4QfEi4an2-KkIT4F6HxtMc',
//   authDomain: 'real-dev-7b60c.firebaseapp.com',
//   databaseURL: 'https://real-dev-7b60c.firebaseio.com',
//   projectId: 'real-dev-7b60c',
//   storageBucket: 'real-dev-7b60c.appspot.com',
//   messagingSenderId: '945338183181'
// }

// /**
//  * Settings for production firebase instance
//  * @const {object}
//  */
// const prodSettings = {
//   apiKey: 'AIzaSyCAsGVxjcBRsSNlQsymRnzWQAAYqphmmVU',
//   authDomain: 'real-45953.firebaseapp.com',
//   databaseURL: 'https://real-45953.firebaseio.com',
//   projectId: 'real-45953',
//   storageBucket: 'real-45953.appspot.com',
//   messagingSenderId: '231971009763'
// }

// /**
//  * Main firebase instance
//  * @const {firebase.app.App}
//  */
// const fbapp = firebase.initializeApp(process.env.DEV ? devSettings : prodSettings)

// /**
//  * Main firestore instance
//  * @const {firebase.firestore.Firestore}
//  */
// const firestore = fbapp.firestore()
// const settings = {
//   timestampsInSnapshots: true
// }
// firestore.settings(settings)

// import user from './modules/user'

// const userMod = user(fbapp, { fieryBindings, fieryActions, fieryMutations, fieryMapMutations, fieryState })

// Vue.use(Vuex)
// Vue.use(FieryVuex)

// /*
//  * If not building with SSR mode, you can
//  * directly export the Store instantiation
//  */

// export default function (/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       user: userMod
//     }
//   })

//   return Store
// }
