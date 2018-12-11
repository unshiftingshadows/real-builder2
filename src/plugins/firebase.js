import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
// import $getFiery from 'fiery-data'
import FieryVue from 'fiery-vue'

/**
 * Settings for dev firebase instance
 * @const {object}
 */
const devSettings = {
  apiKey: 'AIzaSyAjXGlux1zLL4QfEi4an2-KkIT4F6HxtMc',
  authDomain: 'real-dev-7b60c.firebaseapp.com',
  databaseURL: 'https://real-dev-7b60c.firebaseio.com',
  projectId: 'real-dev-7b60c',
  storageBucket: 'real-dev-7b60c.appspot.com',
  messagingSenderId: '945338183181'
}

/**
 * Settings for production firebase instance
 * @const {object}
 */
const prodSettings = {
  apiKey: 'AIzaSyCAsGVxjcBRsSNlQsymRnzWQAAYqphmmVU',
  authDomain: 'real-45953.firebaseapp.com',
  databaseURL: 'https://real-45953.firebaseio.com',
  projectId: 'real-45953',
  storageBucket: 'real-45953.appspot.com',
  messagingSenderId: '231971009763'
}

/**
 * Main firebase instance
 * @const {firebase.app.App}
 */
const fbapp = firebase.initializeApp(process.env.DEV ? devSettings : prodSettings)

/**
 * Main firestore instance
 * @const {firebase.firestore.Firestore}
 */
const firestore = fbapp.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

// const $fiery = $getFiery

// function update (val) {
//   switch (val) {
//     case 'user':
//       return $fiery.update(userData)
//     case 'series':
//       return $fiery.update(seriesDoc)
//     case 'lesson':
//       return $fiery.update(lessonDoc)
//     case 'review':
//       return $fiery.update(reviewDoc)
//     case 'guide':
//       return $fiery.update(guideDoc)
//     case 'devo':
//       return $fiery.update(devoDoc)
//     case 'doc':
//       return Promise.all([$fiery.update(docStructure), $fiery.update(docSections), $fiery.update(docModules)])
//   }
// }

// var userData, userLogged = false

// fbapp.auth().onAuthStateChanged((user) => {
//   if (user) {
//     console.log('user logged', user)
//     userLogged = true
//     userData = $fiery(firestore.collection('user').doc(user.uid))
//   } else {
//     userLogged = false
//     $fiery.free(userData)
//   }
// })

// function getUserData () {
//   console.log('user logged?', userLogged)
//   if (userLogged) {
//     return userData
//   } else {
//     return {
//       name: '',
//       email: '',
//       churchid: '',
//       churchRoles: {},
//       newUser: true,
//       nqUser: false,
//       app: {
//         prefs: {
//           theme: 'light'
//         },
//         lastPage: {
//           host: '',
//           path: ''
//         }
//       },
//       supportRestore: '',
//       realUser: false,
//       realRoles: {}
//     }
//   }
// }

// var seriesDoc, lessonDoc, guideDoc, reviewDoc, devoDoc, lessonList, devoList
// var docStructure, docSections, docModules
// var currentSeries, currentLesson, currentDevo, currentGuide
// var seriesFlag = false,
//   lessonFlag = false,
//   guideFlag = false,
//   reviewFlag = false,
//   devoFlag = false,
//   docFlag = false,
//   docType = false

// const checkType = {
//   'guide': guideFlag,
//   'review': reviewFlag,
//   'devo': devoFlag
// }

// const typeToDoc = {
//   'guide': guideDoc,
//   'review': reviewDoc,
//   'devo': devoDoc
// }

// function setSeries (id) {
//   seriesFlag = true
//   currentSeries = id
//   seriesDoc = $fiery(firestore.collection('curriculumEdit').doc(id))
//   lessonList = $fiery(firestore.collection('curriculumEdit').doc(id).collection('lessons'), { map: true })
//   return true
// }

// function getSeries () {
//   if (seriesFlag) {
//     return seriesDoc
//   } else {
//     return false
//   }
// }

// function getLessonList () {
//   if (seriesFlag) {
//     return lessonList
//   } else {
//     return false
//   }
// }

// function setLesson (id) {
//   if (seriesFlag) {
//     lessonFlag = true
//     currentLesson = id
//     lessonDoc = $fiery(firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(id), { map: true })
//     devoList = $fiery(firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(id).collection('devos'), { map: true })
//     return true
//   } else {
//     lessonFlag = false
//     currentLesson = null
//     return false
//   }
// }

// function getLesson () {
//   if (lessonFlag) {
//     return lessonDoc
//   } else {
//     return false
//   }
// }

// function setGuide (id) {
//   if (lessonFlag) {
//     guideFlag = true
//     currentGuide = id
//     guideDoc = $fiery(firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(currentLesson).collection('guides').doc(id))
//   } else {
//     guideFlag = false
//     currentGuide = null
//     return false
//   }
// }

// function getGuide () {
//   if (guideFlag) {
//     return guideDoc
//   } else {
//     return false
//   }
// }

// function setReview () {
//   if (lessonFlag) {
//     reviewFlag = true
//     reviewDoc = $fiery(firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(currentLesson).collection('review').doc('review'))
//     return true
//   } else {
//     reviewFlag = false
//     return false
//   }
// }

// function getReview () {
//   if (reviewFlag) {
//     return reviewDoc
//   } else {
//     return false
//   }
// }

// function getDevoList () {
//   if (lessonFlag) {
//     return devoList
//   } else {
//     return false
//   }
// }

// function setDevo (id) {
//   if (lessonFlag) {
//     devoFlag = true
//     currentDevo = id
//     devoDoc = $fiery(firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(currentLesson).collection('devos').doc(id))
//     return true
//   } else {
//     devoFlag = false
//     currentDevo = null
//     return false
//   }
// }

// function getDevo () {
//   if (devoFlag) {
//     return devoDoc
//   } else {
//     return false
//   }
// }

// function setDoc (type) {
//   if (checkType[type]) {
//     const initRef = firestore.collection('curriculumEdit').doc(currentSeries).collection('lessons').doc(currentLesson)
//     var finalRef
//     switch (type) {
//       case 'guide':
//         finalRef = initRef.collection('guides').doc(currentGuide)
//         break
//       case 'review':
//         finalRef = initRef.collection('review').doc('review')
//         break
//       case 'devo':
//         finalRef = initRef.collection('devos').doc(currentDevo)
//         break
//       default:
//         return false
//     }
//     docFlag = true
//     docType = type
//     docStructure = $fiery(finalRef.collection('structure'), { map: true })
//     docSections = $fiery(finalRef.collection('sections'), { map: true })
//     docModules = $fiery(finalRef.collection('modules'), { map: true })
//     return true
//   } else {
//     return false
//   }
// }

// function getDoc () {
//   if (docFlag) {
//     return {
//       type: docType,
//       structure: docStructure,
//       sections: docSections,
//       modules: docModules
//     }
//   } else {
//     return false
//   }
// }

// function addSection (data) {
//   if (docFlag) {
//     return $fiery.sources.docSections.add(data).then((newRef) => {
//       typeToDoc[docType].sectionOrder.push(newRef.id)
//       return $fiery.update(typeToDoc[docType])
//     })
//   } else {
//     return false
//   }
// }

// function addModule (data, sectionid) {
//   if (docFlag) {
//     return $fiery.sources.docModules.add(data).then((newRef) => {
//       docSections[sectionid].moduleOrder.push(newRef.id)
//       return $fiery.update(docSections[sectionid])
//     })
//   } else {
//     return false
//   }
// }

// function initSeries (seriesid) {
//   if (setSeries(seriesid)) {
//     return true
//   } else {
//     return false
//   }
// }

// function initLesson (seriesid, lessonid) {
//   if (seriesFlag) {
//     return setLesson(lessonid)
//   } else {
//     if (initSeries(seriesid)) {
//       return initLesson(seriesid, lessonid)
//     } else {
//       return false
//     }
//   }
// }

// function initGuide (seriesid, lessonid, guideid) {
//   if (lessonFlag) {
//     return setGuide(guideid) && setDoc('guide')
//   } else {
//     if (initLesson(seriesid, lessonid)) {
//       return initGuide(seriesid, lessonid, guideid)
//     } else {
//       return false
//     }
//   }
// }

// function initReview (seriesid, lessonid) {
//   if (lessonFlag) {
//     return setReview() && setDoc('review')
//   } else {
//     if (initLesson(seriesid, lessonid)) {
//       return initReview(seriesid, lessonid)
//     } else {
//       return false
//     }
//   }
// }

// function initDevo (seriesid, lessonid, devoid) {
//   if (devoFlag) {
//     return setDevo(devoid) && setDoc('devo')
//   } else {
//     if (initLesson(seriesid, lessonid)) {
//       return initDevo(seriesid, lessonid, devoid)
//     } else {
//       return false
//     }
//   }
// }

/**
 * This is a function to find a specific reference in firestore
 * note: only lesson requires a selection
 * @param {String} type [devo, guide, review, series, lesson]
 * @param {String} selection
 * @param {String} id
 * @param {String} seriesid
 * @param {String} lessonid
 * @return {(firebase.firestore.DocumentReference | firebase.firestore.CollectionReference)}
 */
function dbref (type, selection, id, seriesid, lessonid) {
  console.log('run dbref', type, section, id)
  var ref = null
  if (type === 'devo') {
    ref = devo(seriesid, lessonid, id)
  } else if (type === 'guide') {
    ref = guide(seriesid, lessonid, id)
  } else if (type === 'review') {
    ref = review(seriesid, lessonid)
  } else if (type === 'series') {
    ref = firestore.collection('curriculumEdit').doc(id)
  } else if (type === 'lesson') {
    ref = lesson(seriesid, selection)
  } else {
    console.log('incorrect ref type?')
  }

  if (selection !== '') {
    ref = ref.collection(selection)
  }

  return ref
}

/**
 * Find and return the series collection
 * @return {firebase.firestore.CollectionReference}
 */
function series () {
  return firestore.collection('curriculumEdit')
}

/**
 * Find and return the lessons collection for a specific series
 * @param {String} seriesid
 * @return {firebase.firestore.CollectionReference}
 */
function lessons (seriesid) {
  // return fbapp.database().ref('builder/lessons/' + seriesid)
  return firestore.collection('curriculumEdit').doc(seriesid).collection('lessons')
}

/**
 * Find and return a specific lesson reference
 * @param {String} seriesid
 * @param {String} lessonid
 * @return {firebase.firestore.DocumentReference}
 */
function lesson (seriesid, lessonid) {
  return lessons(seriesid).doc(lessonid)
}

/**
 * Find and return the devo collection for a lesson
 * @param {string} seriesid
 * @param {string} lessonid
 * @return {firebase.firestore.CollectionReference}
 */
function devos (seriesid, lessonid) {
  // return fbapp.database().ref('builder/devos/' + seriesid + '/' + lessonid)
  return lessons(seriesid).doc(lessonid).collection('devos')
}

/**
 * Find and return a specific devo document
 * @param {string} seriesid
 * @param {string} lessonid
 * @param {string} devoid
 * @return {firebase.firestore.DocumentReference}
 */
function devo (seriesid, lessonid, devoid) {
  // return fbapp.database().ref('builder/devoContent/' + seriesid + '/' + lessonid + '/' + devoid)
  return devos(seriesid, lessonid).doc(devoid)
}

/**
 * Find and return a specific guide document
 * @param {string} seriesid
 * @param {string} lessonid
 * @param {string} guideType [lecture, discussion, question, answer, exposition]
 * @return {firebase.firestore.DocumentReference}
 */
function guide (seriesid, lessonid, guideType) {
  // return fbapp.database().ref('builder/guides/' + seriesid + '/' + lessonid + '/' + guideType)
  return lesson(seriesid, lessonid).collection('guides').doc(guideType)
}

/**
 * Find and return a lesson's review document
 * @param {string} seriesid
 * @param {string} lessonid
 * @return {firebase.firestore.DocumentReference}
 */
function review (seriesid, lessonid) {
  return lesson(seriesid, lessonid).collection('review').doc('review')
}

/**
 * Find and return a specific section from a specific document
 * -- document based on type
 * @param {string} type [devo, guide, review]
 * @param {string} id
 * @param {string} sectionid
 * @param {string} seriesid
 * @param {string} lessonid
 * @return {firebase.firestore.DocumentReference}
 */
function section (type, id, sectionid, seriesid, lessonid) {
  if (type === 'devo') {
    return devo(seriesid, lessonid, id).collection('sections').doc(sectionid)
  } else if (type === 'guide') {
    return guide(seriesid, lessonid, id).collection('sections').doc(sectionid)
  } else if (type === 'review') {
    return review(seriesid, lessonid).collection('sections').doc(sectionid)
  } else {
    console.error('incorrect section type')
    return false
  }
}

/**
 * Find and return all sections from a specific document
 * -- document based on type
 * @param {string} type [devo, guide, review]
 * @param {string} id
 * @param {string} sectionid
 * @param {string} seriesid
 * @param {string} lessonid
 * @return {firebase.firestore.CollectionReference}
 */
function sectionModules (type, id, sectionid, seriesid, lessonid) {
  if (type === 'devo') {
    return devo(seriesid, lessonid, id).collection('sections').doc(sectionid).collection('modules')
  } else if (type === 'guide') {
    return guide(seriesid, lessonid, id).collection('sections').doc(sectionid).collection('modules')
  } else if (type === 'review') {
    return review(seriesid, lessonid).collection('sections').doc(sectionid).collection('modules')
  } else {
    console.error('incorrect section type?')
    return false
  }
}

/**
 * Return user data ref for current user or for any uid for admin purposes
 * @param {string} uid User's id
 * @return {firebase.firestore.DocumentReference}
 */
function user (uid) {
  if (uid) {
    console.log('valid uid', uid)
    return fbapp.firestore().collection('user').doc(uid)
  } else {
    if (fbapp.auth().currentUser) {
      return fbapp.firestore().collection('user').doc(fbapp.auth().currentUser.uid)
    } else {
      return false
    }
  }
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(FieryVue)

  Vue.prototype.$firebase = {
    app: fbapp.firebase_,
    emailCred: firebase.auth.EmailAuthProvider.credential,
    auth: fbapp.auth(),
    db: fbapp.database(),
    store: firestore,
    ref: dbref,
    user: user,
    // imagesRef: fbapp.storage().ref('images'),
    seriesRef: series,
    lessonsRef: lessons,
    devosRef: devos,
    devoContentRef: devo,
    guideRef: guide,
    reviewRef: review,
    sectionRef: section,
    sectionModules: sectionModules
    // New system
    // currentUser: fbapp.auth().currentUser,
    // userData: getUserData(),
    // initSeries: initSeries,
    // initLesson: initLesson,
    // initGuide: initGuide,
    // initReview: initReview,
    // initDevo: initDevo,
    // series: getSeries(),
    // lessonList: getLessonList(),
    // lesson: getLesson(),
    // devoList: getDevoList(),
    // guide: getGuide(),
    // review: getReview(),
    // devo: getDevo(),
    // doc: getDoc(),
    // addSection: addSection,
    // addModule: addModule,
    // update: update
  }
}
