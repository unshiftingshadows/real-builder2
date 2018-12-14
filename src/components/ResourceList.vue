<template>
  <div>
    <h5 v-if="!resources || resources === undefined || resources.length === 0">No current resources</h5>
    <n-q-list v-if="!resources || resources === undefined || resources.length > 0" :items="resources" />
  </div>
</template>

<script>
import NQList from 'components/NQList.vue'

export default {
  components: {
    NQList
  },
  name: 'ResourceList',
  props: ['id', 'type', 'lesson'],
  data () {
    return {
      topics: [],
      resources: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      // this.$database.resources(this.type, this.id, 'list', {}, (res) => {
      //   console.log('current resources', res)
      //   if (res.selection.resources) {
      //     this.resources = res.selection.resources
      //   }
      // })
      this.topics = (await this.$firebase.nqTopics(this.lesson.topics)).data
      this.resources = (await this.$firebase.nqResources(this.lesson.resources)).data
      // if (this.topics.length > 0) {
      //   this.topics.forEach(topic => {
      //     this.$firebase.nqTopicResources(topic.id)
      //   })
      // }
    }
  }
}
</script>

<style>
</style>
