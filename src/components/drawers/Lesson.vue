<template>
  <div>
    <div v-if="!seriesLoading">
      <h5>{{ series.title }}</h5>
      <p>{{ series.mainIdea }}</p>
    </div>
    <hr style="border-color: var(--q-color-primary);"/>
    <div v-if="!lessonLoading">
      <h6>{{ lesson.title }}</h6>
      <p>{{ lesson.mainIdea }}</p>
      <q-list no-border separator>
        <q-item v-for="(ref, index) in bibleRefs" :key="ref">
          <q-item-main>
            <q-item-tile label>{{ ref }}</q-item-tile>
            <q-item-tile sublabel>{{ $bible.readable(lesson.bibleRefs[index]) }}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <hr style="border-color: var(--q-color-primary);"/>
      <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" @blur="updateNotes()" />
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
        onSuccess: async () => {
          this.bibleRefs = await this.$bible.texts(this.lesson.bibleRefs)
          this.lessonLoading = false
        }
      }),
      bibleRefs: []
    }
  },
  methods: {
    updateNotes () {
      this.$fiery.update(this.lesson, ['notes'])
    }
  }
}
</script>

<style>
</style>
