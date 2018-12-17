<template>
  <div>
    <div v-if="!seriesLoading">
      <h5>{{ series.title }}</h5>
      <p>{{ series.mainIdea }}</p>
    </div>
    <hr/>
    <div v-if="!lessonLoading">
      <h5>Main Idea</h5>
      <p>{{ lesson.mainIdea }}</p>
      <h5>Bible Refs</h5>
      <ul>
        <li v-for="ref in lesson.bibleRefs" :key="ref">{{ $bible.text(ref) }}<br/>{{ $bible.readable(ref) }}</li>
      </ul>
      <hr/>
      <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawerLesson',
  fiery: true,
  data () {
    return {
      seriesLoading: true,
      lessonLoading: true,
      series: this.$fiery(this.$firebase.ref('series', '', this.$route.params.seriesid), {
        map: true,
        onSuccess: () => {
          this.seriesLoading = false
        }
      }),
      lesson: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid), {
        map: true,
        onSuccess: () => {
          this.lessonLoading = false
        }
      })
    }
  }
}
</script>

<style>
</style>
