<template>
  <div id="q-app">
    <div id="transparent-layer" v-if="dim"></div>
    <router-view />
    <q-modal v-model="showNewUser" ref="newUserModal" content-classes="new-user-modal" no-route-dismiss no-esc-dismiss no-backdrop-dismiss>
      <div class="row gutter-md">
        <div class="col-12">
          <h4>New User</h4>
          <p>Welcome! Please provide a new password for your account.</p>
        </div>
        <div class="col-12">
          <q-field
            :error="$v.newPassword.$error"
            error-label="Passwords must be at least 8 characters"
          >
            <q-input v-model="newPassword" type="password" float-label="New Password" @blur="$v.newPassword.$touch" @keyup.enter="setPassword" />
          </q-field>
        </div>
        <div class="col-12">
          <q-field
            :error="$v.newPasswordCheck.$error"
            error-label="Passwords must be identical"
          >
            <q-input v-model="newPasswordCheck" type="password" float-label="Retype New Password" @blur="$v.newPasswordCheck.$touch" @keyup.enter="setPassword" />
          </q-field>
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="setPassword">Update</q-btn>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
// IMPORTANT!! Used to ensure that quill editors work properly
//             in PWAs
import FastClick from 'fastclick'
FastClick.notNeeded = true

import { required, minLength, sameAs } from 'vuelidate/lib/validators'

var initUser = {
  name: '',
  email: '',
  churchid: '',
  churchRoles: {},
  newUser: true,
  nqUser: false,
  app: {
    prefs: {
      theme: 'light'
    },
    lastPage: {
      host: '',
      path: ''
    },
    message: {
      prefs: {
        contentType: {
          lesson: true,
          scratch: true,
          sermon: true
        },
        mediaType: {
          illustration: true,
          image: true,
          lyric: false,
          quote: true,
          video: true
        },
        osermonStructure: {
          hook: true,
          application: true,
          prayer: true
        },
        olessonStructure: {
          hook: true,
          application: true,
          prayer: true
        },
        structureNames: {
          application: 'Application',
          hook: 'Hook',
          prayer: 'Prayer'
        },
        speakingSpeed: 120
      },
      stats: {
        numsermon: 0,
        numlesson: 0,
        numscratch: 0,
        numarchive: 0,
        numquote: 0,
        numimage: 0,
        numvideo: 0,
        numlyric: 0,
        numillustration: 0
      }
    }
  },
  supportRestore: '',
  realUser: false,
  realRoles: {}
}

export default {
  name: 'App',
  fiery: true,
  data () {
    return {
      user: initUser,
      dim: false,
      showNewUser: false,
      newPassword: '',
      newPasswordCheck: ''
    }
  },
  validations: {
    newPassword: {
      required,
      minLength: minLength(8)
    },
    newPasswordCheck: {
      sameAsPassword: sameAs('newPassword')
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    'user': function (val) {
      console.log('user changed!', val, this.$firebase.auth.currentUser)
    },
    'user.app.prefs.theme': function (val) {
      if (val === undefined) return
      switch (val) {
        case 'dark':
          document.documentElement.style.setProperty('--background-color', '#333333')
          document.documentElement.style.setProperty('--card-color', '#454545')
          document.documentElement.style.setProperty('--color', '#ffffff')
          document.documentElement.style.setProperty('--drawer-background', '#454545')
          document.documentElement.style.setProperty('--drawer-icons', '#ffffff')
          break
        case 'light':
          document.documentElement.style.setProperty('--background-color', '#ffffff')
          document.documentElement.style.setProperty('--card-color', '#dddddd')
          document.documentElement.style.setProperty('--color', '#333333')
          document.documentElement.style.setProperty('--drawer-background', '#dddddd')
          document.documentElement.style.setProperty('--drawer-icons', '#454545')
          break
        default:
          console.error('invalid theme')
      }
    },
    'user.newUser': function (val) {
      if (val === undefined || val === false) return
      if (val === true) {
        this.showNewUser = true
      }
    },
    '$route': function (val) {
      if (this.$firebase.currentUser) {
        // this.$firebase.user().update({
        //   'stats.lastPage.host': 'builder',
        //   'stats.lastPage.path': val.path
        // })
        this.user.stats.lastPage = {
          host: 'builder',
          path: val.path
        }
        this.$fiery.update(this.user)
      }
    }
  },
  methods: {
    init () {
      this.newPassword = ''
      this.newPasswordCheck = ''
      console.log(this.theme)
      // console.log('store', this.$store)
      // this.$store.dispatch('user/watchUser')
      // console.log('user', this.$store.state.user)
      this.$firebase.auth.onAuthStateChanged((user) => {
        console.log('auth state changed')
        if (!user) {
          console.log('no user')
          this.user.theme = 'light'
        } else {
          console.log('currentuser', user)
          // this.$store.user.commit('setuid', user.uid)
          this.user = this.$fiery(this.$firebase.user(), {
            onSuccess: () => {
              if (this.$firebase.nqLogin(this.user.nqUser ? this.user.nqUser.uid : 'MlQv4xZaqBNGNFIYhPnSyTcq3MJ2')) {
                console.log('nq user authenticated')
              } else {
                console.log('nq user error...')
              }
            }
          })
        }
      })
    },
    setPassword () {
      this.$v.newPassword.$touch()
      this.$v.newPasswordCheck.$touch()
      if (this.$v.newPassword.$error || this.$v.newPasswordCheck.$error) {
        this.$q.notify.create('Please review password fields')
      }
      this.$firebase.auth.currentUser.updatePassword(this.newPassword).then(() => {
        this.$firebase.user().update({
          newUser: false
        })
        this.$q.notify({
          type: 'positive',
          message: 'New password set!',
          position: 'bottom-left'
        })
        this.showNewUser = false
        this.newPassword = ''
        this.newPasswordCheck = ''
      }).catch((error) => {
        console.error(error)
        this.$q.notify(error.message)
      })
    }
  }
}
</script>

<style>

/* .q-layout-page {
  color: #ffffff;
  background-color: #333333;
}

.modal-content {
  color: #ffffff;
  background-color: #333333;
}

.q-popover {
  color: #ffffff;
  background-color: #333333;
} */

/* Style content and background */
.q-layout-page, .modal-content, .q-popover {
  color: var(--color);
  background-color: var(--background-color);
}

/* Style text input */
.q-input-area, .q-input-target {
  color: var(--color);
}

/* Always white text */
.bg-primary .q-input-area, .bg-primary .q-input-target, .main-idea-tab {
  color: #ffffff;
}

/* Always dark background */
.main-idea-tab {
  background-color: #777;
}

/* Style all cards */
.q-card {
  color: var(--color);
  background-color: var(--card-color);
}

/* Style drawer background color */
.sm-drawer, .md-drawer, .lg-drawer {
  background-color: var(--drawer-background);
  color: var(--color);
}

/* Style drawer icon color */
.sm-drawer i, .md-drawer i, .lg-drawer i {
  color: var(--drawer-icons);
}

/* Set up drawer widths */
.sm-drawer {
  width: 75px;
}

.md-drawer {
  width: 100%;
}

.lg-drawer {
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .md-drawer {
    width: 25%;
  }
  .lg-drawer {
    width: 35%;
  }
}

#transparent-layer {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.5;
  z-index: 1;
}

.active-card {
  z-index: 2;
  position: relative;
}

.new-user-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .new-user-modal {
    min-width: 500px;
    width: 500px;
  }
}

.q-popover {
  max-width: 100%;
}

@media screen and (min-width: 768px) {
  .q-popover {
    max-width: 400px;
  }
}

@media screen and (min-width: 1200px) {
  .q-popover {
    max-width: 800px;
  }
}

</style>
