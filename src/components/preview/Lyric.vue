<template>
  <q-card>
    <q-card-title>
      <q-icon name="fas fa-music" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
      {{ media.title }} | {{ media.author }}
    </q-card-title>
    <q-card-main>
      <p>{{ media.text }}</p>
    </q-card-main>
  </q-card>
</template>

<script>
export default {
  props: ['id', 'data'],
  // name: 'ComponentName',
  data () {
    return {
      media: {
        text: '',
        author: '',
        title: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$database.view(this.data.type, this.data.mediaid, (res) => {
        this.media = res.resource
      })
    }
  }
}
</script>

<style>
</style>
