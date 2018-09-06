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
  newUser: true,
  nqUser: false,
  realUser: false,
  supportRestore: '',
  theme: '',
  name: {
    first: '',
    last: ''
  },
  email: '',
  prefs: {
    bibleTranslation: 'esv',
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
    contentType: {
      sermon: true,
      lesson: true,
      scratch: true
    },
    mediaType: {
      quote: true,
      image: true,
      illustration: true,
      lyric: true,
      video: true
    }
  },
  stats: {
    lastPagePath: '',
    numSermon: 0,
    numLesson: 0,
    numScratch: 0,
    numArchive: 0,
    numQuote: 0,
    numImage: 0,
    numVideo: 0,
    numLyric: 0,
    numIllustration: 0
  }
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
    'user.prefs.theme': function (val) {
      if (val === undefined) return
      switch (val) {
        case 'dark':
          document.documentElement.style.setProperty('--background-color', '#333333')
          document.documentElement.style.setProperty('--card-color', '#444444')
          document.documentElement.style.setProperty('--color', '#ffffff')
          document.documentElement.style.setProperty('--drawer-background', '#444444')
          document.documentElement.style.setProperty('--drawer-icons', '#ffffff')
          break
        case 'light':
          document.documentElement.style.setProperty('--background-color', '#ffffff')
          document.documentElement.style.setProperty('--card-color', '#dddddd')
          document.documentElement.style.setProperty('--color', '#333333')
          document.documentElement.style.setProperty('--drawer-background', '#dddddd')
          document.documentElement.style.setProperty('--drawer-icons', '#444444')
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
      if (this.$firebase.user()) {
        this.$firebase.user().update({
          'stats.lastPage.host': 'builder',
          'stats.lastPage.path': val.path
        })
      }
    }
  },
  methods: {
    init () {
      this.newPassword = ''
      this.newPasswordCheck = ''
      this.$firebase.auth.onAuthStateChanged((user) => {
        console.log('auth state changed')
        if (!user) {
          console.log('no user')
          this.user.theme = 'light'
        } else {
          console.log('currentuser', user)
          // this.$binding('user', this.$firebase.user()).then((userSnap) => {
          //   console.log('logged user', userSnap)
          // })
          this.user = this.$fiery(this.$firebase.user())
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
.bg-primary .q-input-area, .bg-primary .q-input-target {
  color: #ffffff;
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

</style>
