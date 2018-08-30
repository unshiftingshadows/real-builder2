<template>
  <div>
    <h5 v-show="resources.length === 0">No current resources</h5>
    <n-q-list v-if="resources.length > 0" :items="resources" />
  </div>
</template>

<script>
import NQList from 'components/NQList.vue'

export default {
  components: {
    NQList
  },
  // name: 'ComponentName',
  props: ['id', 'type'],
  data () {
    return {
      resources: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$database.resources(this.type, this.id, 'list', {}, (res) => {
        console.log('current resources', res)
        if (res.selection.resources) {
          this.resources = res.selection.resources
        }
      })
    }
  }
}
</script>

<style>
</style>
