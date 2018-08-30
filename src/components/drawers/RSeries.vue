<template>
  <div>
    <h5>Lesson Outline</h5>
    <ol>
      <li v-for="lesson in lessons" :key="lesson._id">{{ lesson.title }}</li>
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
  firebase () {
    return {
      series: {
        source: this.$firebase.ref('series', '', this.$route.params.seriesid),
        asObject: true,
        readyCallback: function (val) {
          for (var user in this.series.roles) {
            this.$firebase.user(user).get().then((userInfo) => {
              console.log(userInfo.data())
              this.users.push({
                id: user,
                name: userInfo.data().name.first + ' ' + userInfo.data().name.last,
                role: this.series.roles[user]
              })
            }).catch((err) => {
              console.log('oops...', err)
            })
          }
        }
      },
      lessons: {
        source: this.$firebase.lessonsRef(this.id).orderByChild('order')
      }
    }
  },
  data () {
    return {
      id: this.$route.params.seriesid,
      users: []
    }
  }
}
</script>

<style>
</style>
