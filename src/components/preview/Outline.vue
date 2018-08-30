<template>
  <q-card>
    <q-card-title>
      <q-icon name="fas fa-quote-left" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
      <ol v-if="media.numbered">
        <li v-for="point in media.points" :key="point">{{ point.split('%%')[0] }}</li>
      </ol>
      <ul v-if="!media.numbered">
        <li v-for="point in media.points" :key="point">{{ point.split('%%')[0] }}</li>
      </ul>
    </q-card-title>
    <q-card-main>
      <p>{{ media.mediaid.title }} | {{ media.mediaid.author }}</p>
      <p class="text-faded">{{ media.notes }}</p>
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
        notes: '',
        mediaid: {
          title: '',
          author: ''
        }
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
