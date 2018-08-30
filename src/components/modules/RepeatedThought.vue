<template>
  <q-card>
    <div>
      <q-card-title>
        Repeated Thought
      </q-card-title>
      <q-card-main>
        <p>{{ mainIdea['.value'] }}</p>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-repeated-thought',
  props: [ 'seriesid', 'lessonid' ],
  data () {
    return {
      mainIdea: {
        '.value': ''
      }
    }
  },
  firebase () {
    return {
      mainIdea: {
        source: this.$firebase.lessonsRef(this.seriesid).child(this.lessonid).child('mainIdea'),
        asObject: true
      }
    }
  }
}
</script>

<style>
</style>
