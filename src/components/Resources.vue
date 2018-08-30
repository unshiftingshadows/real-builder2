<template>
  <div>
    <!-- <q-btn color="primary" label="Refresh" @click.native="init" /> -->
    <div v-if="$root.$children[0].user && $root.$children[0].user.nqUser">
      <add-research :currentResearch="research" :id="id" :type="type" :reinit="init" v-if="add === ''" />
      <n-q-list :items="resources" :addModule="addModule" />
    </div>
    <div v-if="$root.$children[0].user && !$root.$children[0].user.nqUser">
      <media-search :width="size.width/2" :addModule="addModule" v-if="$root.$children[0].user && !$root.$children[0].user.nqUser && $root.$children[0].user.prefs" />
    </div>
  </div>
</template>

<script>
import MediaSearch from 'components/MediaSearch.vue'
import NQList from 'components/NQList.vue'
import AddResearch from 'components/AddResearch.vue'

var mediaTypes = ['quote', 'image', 'illustration', 'lyric', 'video']

export default {
  components: {
    MediaSearch,
    NQList,
    AddResearch
  },
  // name: 'ComponentName',
  props: ['add'],
  data () {
    return {
      type: this.$route.name,
      id: this.$route.params.id,
      resources: [],
      research: []
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route.name': function (val) {
      this.type = val
      this.init()
    }
  },
  methods: {
    init () {
      console.log(this.type)
      // Check if NQ user to determine what resources to get ---
      //    NQ user --> get from $database.resources
      //    Non-NQ user --> get from $database.list?
      if (!this.$root.$children[0].user.nqUser) {
      } else {
        this.resources = []
        this.$database.resources(this.type, this.id, 'list', {}, (res) => {
          console.log('resources response', res)
          this.research = res.research
          res.research.forEach((research) => {
            this.resources = this.resources.concat(research.media.resources)
          })
          // Once media is also implemented
          // this.resources.push(res.media)
        })
      }
    },
    resType (type) {
      var items = []
      this.resources.forEach(item => {
        if (item.type === type) {
          items.push(item.media)
        }
      })
      return items
    },
    addModule (id, type) {
      if (mediaTypes.includes(type)) {
        var newRef = this.$firebase.ref(this.type, 'modules', this.id).push()
        var obj = {
          mediaid: id,
          editing: false,
          slide: false,
          order: 'new',
          time: 0,
          wordcount: 0
        }
        obj.type = type
        newRef.set(obj)
      } else {
        console.error('Incorrect media type for module add')
      }
    }
  }
}
</script>

<style>
</style>
