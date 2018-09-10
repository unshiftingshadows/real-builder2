import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'

axios.defaults.baseURL = 'https://database.unshiftingshadows.com/builder'
axios.defaults.headers.post['Content-Type'] = 'application/json'

/**
 * POST an 'add' request to database
 * Adds a specific document of [type] with object [data]
 * @param {string} type
 * @param {object} data
 * @param {function} callback
 */
function add (type, data, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/add', {
      type: type,
      data: data,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

/**
 * POST a 'list' request to database
 * Returns a list of documents of [type]
 * @param {string} type
 * @param {function} callback
 */
function list (type, callback) {
  console.log('list', type)
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/list', {
      type: type,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

/**
 * POST a 'view' request to database
 * Returns a document of [type] with id [id]
 * @param {string} type
 * @param {string} id document id
 * @param {function} callback
 */
function view (type, id, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/view', {
      type: type,
      id: id,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

/**
 * POST an 'update' request to database
 * Sets a document of [id] and [type] with new [data]
 * @param {string} type
 * @param {string} id document id
 * @param {object} data
 * @param {function} callback
 */
function update (type, id, data, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/update', {
      type: type,
      id: id,
      data: data,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

/**
 * POST a 'search' request to database
 * Returns a list of matching results
 * @param {string} type
 * @param {string} terms
 * @param {object} options
 * @param {function} callback
 */
function search (type, terms, options, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/search', {
      type: type,
      terms: terms,
      options: options,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

/**
 * POST a 'bible' request to database
 * Returns an object of [ref] text of [version]
 * @param {string} ref
 * @param {string} version
 * @param {function} callback
 */
function bible (ref, version, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/bible', {
      ref: ref,
      version: version,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
        callback()
      })
  })
}

/**
 * POST a 'resources' request to database
 * Performs function of [action] for [resource] on [id]
 * @param {string} type
 * @param {string} id document id
 * @param {string} action [add, remove, list]
 * @param {string} resource resource id
 * @param {function} callback
 */
function resources (type, id, action, resource, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/resources', {
      type: type,
      id: id,
      action: action,
      resource: resource,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
        callback()
      })
  })
}

/**
 * POST a 'research' request to database
 * Performs [action] on [researchid] for document [id]
 * @param {string} action
 * @param {string} type
 * @param {string} id document id
 * @param {string} researchtype
 * @param {string} researchid research document id
 * @param {function} callback
 */
function research (action, type, id, researchtype, researchid, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/research', {
      action: action,
      type: type,
      id: id,
      researchid: researchid,
      researchtype: researchtype,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
        callback()
      })
  })
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$database = {
    add: add,
    list: list,
    view: view,
    update: update,
    search: search,
    bible: bible,
    resources: resources,
    research: research
  }
}
