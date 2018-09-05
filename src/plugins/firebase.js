import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
// import VueFire from 'vuefire'
// import VueFirestore from 'vue-firestore'
import FieryVue from 'fiery-vue'

const fbapp = firebase.initializeApp({
  apiKey: 'AIzaSyCAsGVxjcBRsSNlQsymRnzWQAAYqphmmVU',
  authDomain: 'real-45953.firebaseapp.com',
  databaseURL: 'https://real-45953.firebaseio.com',
  projectId: 'real-45953',
  storageBucket: 'real-45953.appspot.com',
  messagingSenderId: '231971009763'
})

const firestore = fbapp.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

function dbref (type, selection, id, seriesid, lessonid) {
  console.log('run dbref')
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

function lessons (seriesid) {
  // return fbapp.database().ref('builder/lessons/' + seriesid)
  return firestore.collection('curriculumEdit').doc(seriesid).collection('lessons')
}

function lesson (seriesid, lessonid) {
  return lessons(seriesid).doc(lessonid)
}

function devos (seriesid, lessonid) {
  // return fbapp.database().ref('builder/devos/' + seriesid + '/' + lessonid)
  return lessons(seriesid).doc(lessonid).collection('devos')
}

function devo (seriesid, lessonid, devoid) {
  // return fbapp.database().ref('builder/devoContent/' + seriesid + '/' + lessonid + '/' + devoid)
  return devos(seriesid, lessonid).doc(devoid)
}

function guide (seriesid, lessonid, guideType) {
  // return fbapp.database().ref('builder/guides/' + seriesid + '/' + lessonid + '/' + guideType)
  return lesson(seriesid, lessonid).collection('guides').doc(guideType)
}

function review (seriesid, lessonid) {
  // return fbapp.database().ref('builder/review/' + seriesid + '/' + lessonid)
  return lesson(seriesid, lessonid).collection('review').doc('review')
}

function section (type, id, sectionid, seriesid, lessonid) {
  if (type === 'devo') {
    return devo(seriesid, lessonid, id).collection('sections').doc(sectionid)
  } else if (type === 'guide') {
    return guide(seriesid, lessonid, id).collection('sections').doc(sectionid)
  } else if (type === 'review') {
    return review(seriesid, lessonid).collection('sections').doc(sectionid)
  } else {
    console.log('incorrect section type?')
  }
}

function sectionModules (type, id, sectionid, seriesid, lessonid) {
  if (type === 'devo') {
    return devo(seriesid, lessonid, id).collection('sections').doc(sectionid).collection('modules')
  } else if (type === 'guide') {
    return guide(seriesid, lessonid, id).collection('sections').doc(sectionid).collection('modules')
  } else if (type === 'review') {
    return review(seriesid, lessonid).collection('sections').doc(sectionid).collection('modules')
  } else {
    console.log('incorrect section type?')
  }
}

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
  // Vue.use(VueFire)
  // Vue.use(VueFirestore)
  Vue.use(FieryVue)
  Vue.prototype.$firebase = {
    emailCred: firebase.auth.EmailAuthProvider.credential,
    auth: fbapp.auth(),
    db: fbapp.database(),
    store: firestore,
    ref: dbref,
    user: user,
    // imagesRef: fbapp.storage().ref('images'),
    lessonsRef: lessons,
    devosRef: devos,
    devoContentRef: devo,
    guideRef: guide,
    reviewRef: review,
    sectionRef: section,
    sectionModules: sectionModules
  }
}
