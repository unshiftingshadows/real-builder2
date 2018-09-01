<template>
  <div>
    <h5>{{ series.title }}</h5>
    <p>{{ series.mainIdea }}</p>
    <hr/>
    <h5>Bible Refs</h5>
    <ul>
      <li v-for="ref in lessonRefs" :key="ref.ref">{{ ref.text }}<br/>{{ ref.ref }}</li>
    </ul>
    <hr/>
    <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  firebase () {
    return {
      series: {
        source: this.$firebase.ref('series', '', this.$route.params.seriesid),
        asObject: true
      },
      lesson: {
        source: this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          if (val.val().bibleRefs !== undefined && val.val().bibleRefs !== '') {
            val.val().bibleRefs.split(',').forEach((ref) => {
              console.log(ref)
              this.$database.bible(ref, 'esv', (res) => {
                this.lessonRefs.push({
                  ref: ref,
                  text: res.text
                })
              })
            })
          }
        }
      }
    }
  },
  data () {
    return {
      lessonRefs: []
    }
  }
}
</script>

<style>
</style>
