<template>
  <div>
    <div v-if="!lessonLoading">
      <h5>{{ lesson.title }}</h5>
      <p>{{ lesson.mainIdea }}</p>
    </div>
    <hr/>
    <div v-if="!devoLoading">
      <q-input v-model="devo.notes" float-label="Devo Notes" type="textarea" :max-height="150" :min-rows="3" />
    </div>
    <hr/>
    <resource-search />
  </div>
</template>

<script>
import ResourceSearch from 'components/ResourceSearch'

export default {
  components: {
    ResourceSearch
  },
  name: 'DrawerDevo',
  fiery: true,
  firebase () {
    return {
      lesson: {
        source: this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          console.log('ran!', val)
        }
      },
      devo: {
        source: this.$firebase.devoContentRef(this.$route.params.seriesid, this.$route.params.lessonid, this.$route.params.devoid),
        asObject: true
      }
    }
  },
  data () {
    return {
      lessonLoading: true,
      devoLoading: false,
      lesson: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid), {
        onSuccess: () => {
          this.lessonLoading = false
        }
      }),
      devo: this.$fiery(this.$firebase.devoContentRef(this.$route.params.seriesid, this.$route.params.lessonid, this.$route.params.devoid), {
        onSuccess: () => {
          this.devoLoading = false
        }
      })
    }
  }
}
</script>

<style>
</style>
