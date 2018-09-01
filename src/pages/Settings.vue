<template>
  <q-page padding>
    <div class="row gutter-md">
      <div class="col-12">
        <h3>Settings</h3>
      </div>
      <div class="col-12">
        <q-select
          v-model="$root.$children[0].user.prefs.theme"
          float-label="Theme"
          :options="themeOptions"
          @input="themeChange"
        />
      </div>
      <div class="col-12" v-if="$root.$children[0].user.name">
        <q-card>
          <q-card-title>
            <q-btn color="secondary" class="float-right" style="margin-left: 10px;" @click.native="authenticate = true">Password</q-btn>
            <q-btn color="primary" class="float-right" @click.native="openEditUser">Edit</q-btn>
            User Info
          </q-card-title>
          <q-card-main>
            <p><b>Name:</b> <span>{{ $root.$children[0].user.name.first }} {{ $root.$children[0].user.name.last }}</span></p>
            <p><b>Email:</b> <span>{{ $root.$children[0].user.email }}</span></p>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-12" v-if="$root.$children[0].user">
        <q-card>
          <q-card-title>Notes and Quotes</q-card-title>
          <q-card-main>
            <q-btn color="primary" v-if="!$root.$children[0].user.nqUser">Connect</q-btn>
            <div v-if="$root.$children[0].user.nqUser">
              <p>User: {{ $root.$children[0].user.nqUser.email }}</p>
              <p>ID: {{ $root.$children[0].user.nqUser.uid }}</p>
              <q-btn color="primary" v-if="!$root.$children[0].user.nqUser">Disconnect</q-btn>
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-12" v-if="$root.$children[0].user.realUser">
        <q-card>
          <q-card-title>REAL Curriculum Author</q-card-title>
          <q-card-main>
            <p>You are a REAL Curriculum author.</p>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-12" v-if="$root.$children[0].user.prefs">
        <q-card>
          <q-card-title>Other Settings</q-card-title>
          <q-card-main>
            <q-select
              v-model="$root.$children[0].user.prefs.bibleTranslation"
              float-label="Default Translation"
              :options="translationOptions"
              @input="prefChange"
            />
            <div class="row" v-if="!$root.$children[0].user.nqUser">
              <div class="col-xs-12 col-md-6">
                <h6>Sermon Structure</h6>
                <q-checkbox v-model="$root.$children[0].user.prefs.osermonStructure.hook" label="Hook" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.osermonStructure.application" label="Application" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.osermonStructure.prayer" label="Prayer" @input="prefChange" />
              </div>
              <div class="col-xs-12 col-md-6">
                <h6>Lesson Structure</h6>
                <q-checkbox v-model="$root.$children[0].user.prefs.olessonStructure.hook" label="Hook" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.olessonStructure.application" label="Application" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.olessonStructure.prayer" label="Prayer" @input="prefChange" />
              </div>
              <div class="col-xs-12 col-md-6">
                <h6>Content Types</h6>
                <q-checkbox v-model="$root.$children[0].user.prefs.contentType.sermon" label="Sermons" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.contentType.lesson" label="Lessons" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.contentType.scratch" label="Scratch Pads" @input="prefChange" />
              </div>
              <div class="col-xs-12 col-md-6">
                <h6>Media Types</h6>
                <q-checkbox v-model="$root.$children[0].user.prefs.mediaType.quote" label="Quotes" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.mediaType.image" label="Images" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.mediaType.illustration" label="Illustrations" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.mediaType.lyric" label="Lyrics" @input="prefChange" /><br/>
                <q-checkbox v-model="$root.$children[0].user.prefs.mediaType.video" label="Videos" @input="prefChange" />
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-modal v-model="editUser" ref="editUserModal" content-classes="edit-settings-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="editUser = false; emailEdited = false;"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Edit User</h4>
        </div>
        <div class="col-12">
          <q-field
            :error="$v.email.$error"
            error-label="Must enter a valid email address"
          >
            <q-input v-model="email" type="email" float-label="Email" @blur="$v.email.$touch" @input="emailEdited = true" />
          </q-field>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input v-model="name.first" float-label="First" />
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input v-model="name.last" float-label="Last" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="updateUser">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="authenticate" ref="authenticateModal" content-classes="edit-settings-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="authenticate = false; emailEdited = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Re-Authenticate</h4>
        </div>
        <div class="col-12">
          <q-input v-model="password" type="password" float-label="Password" @keyup.enter="reauthenticate" />
        </div>
        <div class="col-12" v-if="!emailEdited">
          <q-field
            :error="$v.newPassword.$error"
            error-label="Passwords must be at least 8 characters"
          >
            <q-input v-model="newPassword" type="password" float-label="New Password" @blur="$v.newPassword.$touch" />
          </q-field>
        </div>
        <div class="col-12" v-if="!emailEdited">
          <q-field
            :error="$v.newPasswordCheck.$error"
            error-label="Passwords must be identical"
          >
            <q-input v-model="newPasswordCheck" type="password" float-label="Retype New Password" @blur="$v.newPasswordCheck.$touch" />
          </q-field>
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="reauthenticate">Authenticate</q-btn>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  // name: 'PageName',
  data () {
    return {
      name: {
        first: '',
        last: ''
      },
      email: '',
      password: '',
      newPassword: '',
      newPasswordCheck: '',
      editUser: false,
      emailEdited: false,
      authenticate: false,
      themeOptions: [
        {
          label: 'Light',
          value: 'light'
        },
        {
          label: 'Dark',
          value: 'dark'
        }
      ],
      translationOptions: [
        {
          label: 'English Standard Version - ESV',
          value: 'esv'
        },
        {
          label: 'New American Standard Bible - NASB',
          value: 'nas'
        },
        {
          label: 'New International Version - NIV',
          value: 'niv'
        },
        {
          label: 'New King James Version - NKJV',
          value: 'nkj'
        },
        {
          label: 'New English Translation - NET',
          value: 'net'
        },
        {
          label: 'Lexham English Bible - LEB',
          value: 'leb'
        },
        {
          label: 'King James Version - KVJ',
          value: 'kjv'
        },
        {
          label: 'American Standard Version - ASV',
          value: 'asv'
        },
        {
          label: 'World English Bible - WEB',
          value: 'web'
        }
      ]
    }
  },
  validations: {
    email: {
      required,
      email
    },
    newPassword: {
      required,
      minLength: minLength(8)
    },
    newPasswordCheck: {
      sameAsPassword: sameAs('newPassword')
    }
  },
  methods: {
    reauthenticate () {
      if (!this.emailEdited) {
        this.$v.newPassword.$touch()
        this.$v.newPasswordCheck.$touch()
        if (this.$v.newPassword.$error || this.$v.newPasswordCheck.$error) {
          this.$q.notify('Please review fields again')
          return
        }
      }
      const credential = this.$firebase.emailCred(
        this.$firebase.auth.currentUser.email,
        this.password
      )
      this.$firebase.auth.currentUser.reauthenticateWithCredential(credential).then(() => {
        if (this.emailEdited) {
          this.$firebase.auth.currentUser.updateEmail(this.$root.$children[0].user.email)
          this.$firebase.user().update({
            email: this.$root.$children[0].user.email
          })
          this.emailEdited = false
          Notify.create({
            type: 'positive',
            message: 'Email Updated!',
            position: 'bottom-left'
          })
        } else {
          this.$firebase.auth.currentUser.updatePassword(this.newPassword).then(() => {
            Notify.create({
              type: 'positive',
              message: 'Password Updated!',
              position: 'bottom-left'
            })
          }).catch((error) => {
            Notify.create({
              type: 'negative',
              message: error.message,
              position: 'bottom-left'
            })
          })
        }
        this.authenticate = false
      })
    },
    openEditUser () {
      this.email = this.$root.$children[0].user.email
      this.name = {
        first: this.$root.$children[0].user.name.first,
        last: this.$root.$children[0].user.name.last
      }
      this.editUser = true
    },
    updateUser () {
      this.$v.email.$touch()
      if (this.$v.email.$error) {
        this.$q.notify('Please review fields again')
        return
      }
      if (this.emailEdited) {
        this.editUser = false
        this.authenticate = true
      }
      this.$firebase.user().update({
        name: this.$root.$children[0].user.name
      }).then(() => {
        this.editUser = false
      })
    },
    themeChange (val) {
      console.log('change...', val)
      this.$firebase.user().update({
        theme: this.$root.$children[0].user.prefs.theme
      })
    },
    prefChange (val) {
      this.$firebase.user().update({
        prefs: this.$root.$children[0].user.prefs
      })
    }
  }
}
</script>

<style>

.edit-settings-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .edit-settings-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
