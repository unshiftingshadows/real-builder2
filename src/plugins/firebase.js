import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
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

const nqSettings = {
  apiKey: 'AIzaSyBRyXtYfwhda49puaaFlC0yThP1bpELPgI',
  authDomain: 'notes-and-quotes-977a3.firebaseapp.com',
  databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com',
  projectId: 'notes-and-quotes-977a3',
  storageBucket: 'notes-and-quotes-977a3.appspot.com',
  messagingSenderId: '333897842731'
}

/**
 * Main firebase instance
 * @const {firebase.app.App}
 */
const fbapp = firebase.initializeApp(process.env.DEV ? devSettings : prodSettings)
const nqapp = firebase.initializeApp(nqSettings, 'nq')

/**
 * Main firestore instance
 * @const {firebase.firestore.Firestore}
 */
const firestore = fbapp.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

const functions = fbapp.functions()

const nqFirestore = nqapp.firestore()
nqFirestore.settings(settings)

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

async function customNQLogin (uid) {
  var loginFunction = functions.httpsCallable('nq-login')
  const loginToken = await loginFunction({ uid })
  try {
    await nqapp.auth().signInWithCustomToken(loginToken)
    return true
  } catch (error) {
    return false
  }
}

async function resourceSearch (term, types) {
  console.log('search called')
  var searchFunction = nqapp.functions().httpsCallable('search-all')
  const result = await searchFunction({ searchTerms: term, searchTypes: types })
  console.log('search result', result)
  return result
}

function nqTopics (topics) {
  const topicFunction = functions.httpsCallable('nq-topic')
  return topicFunction({ topics: topics })
  // return Promise.all(topics.map(e => { return nqFirestore.collection('topics').doc(e).get() }))
}

function nqResources (resources) {
  return true
  // return Promise.all(resources.map(e => { return nqFirestore.collection(e.type).doc(e.id).get() }))
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
    sectionModules: sectionModules,
    resourceSearch: resourceSearch,
    nqAuth: nqapp.auth(),
    nqLogin: customNQLogin,
    nqTopics: nqTopics,
    nqResources: nqResources
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
