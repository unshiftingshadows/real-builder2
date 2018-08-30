<template>
  <q-item>
    <q-item-main>
      {{ text }}
      <q-item-tile sublabel>{{ title }}</q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: [ 'passage' ],
  data () {
    return {
      text: '',
      title: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$database.bible(this.passage, (data) => {
        console.log(data)
        this.text = data.passages[0]
        this.title = data.canonical
      })
    }
  }
}
</script>

<style>
</style>
