<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
import { Notify } from 'quasar'

export default {
  name: 'Login2',
  data () {
    return {}
  },
  mounted () {
    console.log('Login 2 Mounted')
    var authToken = this.$cookie.get('realToken')
    console.log('token', authToken)
    if (authToken) {
      this.$firebase.auth.setPersistence(this.$firebase.app.auth.Auth.Persistence.LOCAL)
        .then(() => {
          this.$firebase.auth.signInWithCustomToken(authToken)
            .then((user) => {
              this.$cookie.delete('realToken')
              this.$router.replace('/')
            })
            .catch((err) => {
              this.$cookie.delete('realToken')
              Notify.create(err.message)
            })
        })
    } else {
      var url = process.env.DEV ? 'http://localhost:8080/builder' : 'https://login.realchurch.app'
      window.open(url, '_self')
    }
  }
}
</script>

<style>
</style>
