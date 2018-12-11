<template>
  <div v-if="!loading">
    <h5>Lesson Outline</h5>
    <ol>
      <li v-for="lesson in series.lessonOrder" :key="lesson">{{ lessons[lesson].title }}</li>
    </ol>
    <h5>User Roles</h5>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} -- {{ user.role }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DrawerSeries',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.seriesid,
      users: [],
      series: this.$fiery(this.$firebase.ref('series', '', this.$route.params.seriesid), {
        map: true,
        onSuccess: (val) => {
          console.log('success', this.users)
          for (var user in val.roles) {
            this.$firebase.user(user).get().then((userInfo) => {
              console.log(userInfo.data())
              // this.users.push({
              //   id: user,
              //   name: userInfo.data().name.first + ' ' + userInfo.data().name.last,
              //   role: this.series.roles[user]
              // })
            }).catch((err) => {
              console.log('oops...', err)
            })
          }
        }
      }),
      lessons: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid), {
        map: true,
        onSuccess: () => {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style>
</style>
