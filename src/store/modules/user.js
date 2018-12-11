// import { fieryBindings } from "fiery-vuex";

// function init (firebase, fv) {
//   const state = {
//     uid: '',
//     data: {}
//   }

//   const getters = {}

//   const mutations = {
//     ...fv.fieryMutations({
//       setuid: (state, uid, $fiery) => {
//         state.uid = uid
//         state.data = $fiery(firebase.firestore().collection('user').doc(uid))
//       },
//       updatePage: (state, { host, path }, $fiery) => {
//         state.lastPage.host = host
//         state.lastPage.path = path
//       }
//     })
//   }

//   const actions = {
//     watchUser: ({ dispatch, commit }) => {
//       return new Promise((resolve, reject) => {
//         firebase.auth().onAuthStateChanged((user) => {
//           if (user) {
//             commit('setuid', user.uid)
//             resolve(true)
//           } else {
//             resolve(false)
//           }
//         })
//       })
//     },
//     ...fieryBindings({}
//   }

//   return {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
//   }
// }

// export default init
