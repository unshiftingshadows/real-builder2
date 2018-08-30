<template>
  <q-card>
    <q-card-media>
      <q-video :src="media.embedURL" />
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
        embedURL: ''
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

.q-video {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 25px;
  height: 0;
  width: 100%;
}
.q-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
