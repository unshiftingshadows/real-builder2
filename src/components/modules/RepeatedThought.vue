<template>
  <q-card>
    <div>
      <q-card-title>
        Repeated Thought
      </q-card-title>
      <q-card-main>
        <p>{{ lesson.mainIdea }}</p>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-repeated-thought',
  props: [ 'seriesid', 'lessonid' ],
  fiery: true,
  data () {
    return {
      lesson: this.$fiery(this.$firebase.lessonsRef(this.seriesid).doc(this.lessonid))
    }
  }
}
</script>

<style>
</style>
