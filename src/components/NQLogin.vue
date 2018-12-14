<template>
  <q-modal ref="modal" content-classes="edit-settings-modal">
    <h4>Notes and Quotes Login</h4>
    <div class="row gutter-sm">
      <div class="col-12">
        <q-field
          :error="$v.form.email.$error"
          error-label="Please enter a valid email address"
        >
          <q-input
            float-label="Email"
            type="email"
            v-model="form.email"
            @blur="$v.form.email.$touch"
            @keyup.enter="login"
          />
        </q-field>
      </div>
      <div class="col-12">
        <q-field
          :error="$v.form.pswd.$error"
          error-label="Passwords must be at least 8 characters"
        >
          <q-input
            float-label="Password"
            type="password"
            v-model="form.pswd"
            @blur="$v.form.pswd.$touch"
            @keyup.enter="login"
          />
        </q-field>
      </div>
    </div>
    <br/>
    <q-btn color="primary" @click="login" label="Login" class="full-width" />
  </q-modal>
</template>

<script>
import { Notify } from 'quasar'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'NQLogin',
  data () {
    return {
      form: {
        email: '',
        pswd: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      pswd: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    login () {
      console.log('login')
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Notify.create('Please review fields again.')
        return
      }
      this.$firebase.nqAuth.signInWithEmailAndPassword(this.form.email, this.form.pswd)
        .then((user) => {
          console.log('logged in...', user)
          this.$firebase.user().update({
            nqUser: {
              uid: user.user.uid,
              email: this.form.email
            }
          }).then(() => {
            this.$refs.modal.hide()
            this.form = {
              email: '',
              pswd: ''
            }
            Notify.create({
              type: 'positive',
              message: 'Notes and Quotes Authenticated!',
              position: 'bottom-left'
            })
          })
        })
        .catch((err) => {
          Notify.create(err.message)
        })
    }
  }
}
</script>

<style>

.nq-login-modal {
  padding: 30px;
}

</style>
