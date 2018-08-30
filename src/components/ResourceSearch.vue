<template>
  <div>
    <q-input v-model="searchTerms" @keyup.enter="search" />
    <n-q-list :items="resources" :addModule="addModule" />
  </div>
</template>

<script>
import NQList from 'components/NQList.vue'

export default {
  components: {
    NQList
  },
  // name: 'ComponentName',
  data () {
    return {
      searchTerms: '',
      resources: []
    }
  },
  methods: {
    addModule (id, type) {
      var newRef = this.$firebase.ref(this.type, 'modules', this.id).push()
      switch (type) {
        case 'quote':
          newRef.set({
            type: 'quote',
            mediaid: id,
            editing: false,
            slide: false,
            order: 'new',
            time: 0,
            wordcount: 0
          })
          break
        case 'image':
          newRef.set({
            type: 'image',
            mediaid: id,
            editing: false,
            slide: false,
            order: 'new',
            time: 0,
            wordcount: 0
          })
          break
        case 'video':
          newRef.set({
            type: 'video',
            mediaid: id,
            editing: false,
            slide: false,
            order: 'new',
            time: 0,
            wordcount: 0
          })
          break
        case 'lyric':
          newRef.set({
            type: 'lyric',
            mediaid: id,
            editing: false,
            slide: false,
            order: 'new',
            time: 0,
            wordcount: 0
          })
          break
        case 'illustration':
          newRef.set({
            type: 'illustration',
            mediaid: id,
            editing: false,
            slide: false,
            order: 'new',
            time: 0,
            wordcount: 0
          })
          break
        default:
          console.error('incorrect new module type')
          return false
      }
    },
    search () {
      this.$database.search('nqmedia', this.searchTerms, {}, (res) => {
        this.resources = res
      })
    }
  }
}
</script>

<style>
</style>
