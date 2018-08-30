import firebase from 'firebase'
require('firebase/firestore')
import VueFire from 'vuefire'
import VueFirestore from 'vue-firestore'

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
  if (type === 'devo') {
    return devoContent(seriesid, lessonid, id).child(selection)
  } else if (type === 'guide') {
    return guides(seriesid, lessonid, id).child(selection)
  } else if (type === 'review') {
    return review(seriesid, lessonid).child(selection)
  } else if (type === 'series') {
    return fbapp.database().ref('builder/series/' + id)
  } else if (type === 'lesson') {
    return fbapp.database().ref('builder/lessons/' + id + '/' + selection)
  } else {
    console.log('incorrect ref type?')
  }
}

function lessons (seriesid) {
  return fbapp.database().ref('builder/lessons/' + seriesid)
}

function devos (seriesid, lessonid) {
  return fbapp.database().ref('builder/devos/' + seriesid + '/' + lessonid)
}

function devoContent (seriesid, lessonid, devoid) {
  return fbapp.database().ref('builder/devoContent/' + seriesid + '/' + lessonid + '/' + devoid)
}

function guides (seriesid, lessonid, guideType) {
  return fbapp.database().ref('builder/guides/' + seriesid + '/' + lessonid + '/' + guideType)
}

function review (seriesid, lessonid) {
  return fbapp.database().ref('builder/review/' + seriesid + '/' + lessonid)
}

function sectionModules (type, id, sectionid, seriesid, lessonid) {
  if (type === 'devo') {
    return devoContent(seriesid, lessonid, id).child('sectionModules').child(sectionid)
  } else if (type === 'guide') {
    return guides(seriesid, lessonid, id).child('sectionModules').child(sectionid)
  } else if (type === 'review') {
    return review(seriesid, lessonid).child('sectionModules').child(sectionid)
  } else {
    console.log('incorrect section type?')
  }
}

function user (uid) {
  if (uid) {
    console.log('valid uid', uid)
    return fbapp.firestore().collection('users').doc(uid)
  } else {
    if (fbapp.auth().currentUser) {
      return fbapp.firestore().collection('users').doc(fbapp.auth().currentUser.uid)
    } else {
      return false
    }
  }
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueFire)
  Vue.use(VueFirestore)
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
    devoContentRef: devoContent,
    guides: guides,
    review: review,
    sectionModules: sectionModules
  }
}
