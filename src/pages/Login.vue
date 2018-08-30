<template>
  <q-page padding>
    <q-card class="absolute-center login-card">
      <q-card-title align="center">
        <h4>Login</h4>
      </q-card-title>
      <q-card-main>
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
        <q-btn color="negative" outline @click="forgot" label="Forgot Password" class="full-width" style="margin-top: 10px;" />
      </q-card-main>
    </q-card>
    <q-modal v-model="forgotPassword" ref="forgotPasswordModal" content-classes="forgot-password-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="forgotPassword = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Forgot Password</h4>
        </div>
        <div class="col-12">
          <q-field
            :error="$v.form.email.$error"
            error-label="Please enter a valid email address"
          >
            <q-input v-model="form.email" float-label="Email" />
          </q-field>
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="resetPassword">Send Email</q-btn>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { Notify, QCard, QCardTitle, QCardMain } from 'quasar'
export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  data () {
    return {
      form: {
        email: '',
        pswd: ''
      },
      forgotPassword: false
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
      this.$firebase.auth.signInWithEmailAndPassword(this.form.email, this.form.pswd)
        .then((user) => {
          this.$router.replace('/')
        })
        .catch((err) => {
          Notify.create(err.message)
        })
    },
    forgot () {
      this.$v.form.email.$touch()
      if (this.$v.form.email.$error) {
        this.forgotPassword = true
      } else {
        this.resetPassword()
      }
    },
    resetPassword () {
      this.$firebase.auth.sendPasswordResetEmail(this.form.email, {
        url: 'https://builder.real-curriculum.com/login'
      }).then(() => {
        this.forgotPassword = false
        Notify.create({
          type: 'positive',
          message: 'Check your email for a link to reset your password',
          position: 'bottom-left'
        })
      }).catch((err) => {
        Notify.create(err.message)
      })
    }
  }
}
</script>

<style>

.login-card {
  width: 100%;
}

@media screen and (min-width: 600px) {
  .login-card {
    width: 550px;
    padding: 30px;
  }
}

.forgot-password-modal {
  padding: 30px;
  width: 100%;
  background-color: white;
}

@media screen and (min-width: 1200px) {
  .forgot-password-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
