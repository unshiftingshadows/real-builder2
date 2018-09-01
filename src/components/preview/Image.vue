<template>
  <q-card>
    <q-card-media>
      <img :src="media.imageURL" style="width: 100%;" />
    </q-card-media>
  </q-card>
</template>

<script>
export default {
  props: ['id', 'data'],
  // name: 'ComponentName',
  data () {
    return {
      media: {
        imageURL: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$database.view(this.data.type, this.data.mediaid, (res) => {
        console.log('pull nq resource...')
        this.media = res.resource
      })
    }
  }
}
</script>

<style>
</style>
