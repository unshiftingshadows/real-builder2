<template>
  <div>
    <q-spinner size="2rem" color="secondary" v-if="lessonLoading" />
    <div v-if="!lessonLoading">
      <h5>{{ lesson.title }}</h5>
      <p>{{ lesson.mainIdea }}</p>
    </div>
    <hr style="border-color: var(--q-color-primary);"/>
    <div v-if="!devoLoading">
      <q-input v-model="devo.notes" float-label="Devo Notes" type="textarea" :max-height="150" :min-rows="3" />
    </div>
    <hr style="border-color: var(--q-color-primary);"/>
    <!-- <resource-search /> -->
    <q-tabs align="justify">
      <q-tab default slot="title" name="research-tab" icon="fas fa-file" />
      <q-tab slot="title" name="search-tab" icon="fas fa-search" />
      <q-tab-pane name="research-tab">
        <q-select
          v-model="topicSelect"
          float-label="Topic"
          :options="topicOptions"
        />
        <q-spinner size="2rem" color="secondary" v-if="topicLoading && topicSelect !== 'none'" />
        <div v-if="!topicLoading && topicSelect !== 'none'">
          <br/>
          <p><strong style="text-decoration: underline;">Premise</strong><br/>{{ topic.premise }}</p>
          <p><strong style="text-decoration: underline;">Notes</strong><br/><span v-html="topic.notes"/></p>
          <p><strong style="text-decoration: underline;">Conclusion</strong><br/>{{ topic.premise }}</p>
          <hr/>
          <n-q-list v-if="topic.resources.length > 0" :items="topic.resources" :add-module="addModule" singlecolumn nofilter />
        </div>
        <div v-if="!lessonLoading && topicSelect === 'none' && resources.length > 0">
          <n-q-list :key="topicSelect" :items="resources" :add-module="addModule" singlecolumn nofilter />
        </div>
      </q-tab-pane>
      <q-tab-pane name="search-tab">
        <q-search v-model="searchTerm" placeholder="Search..." color="dark" inverted icon="fas fa-search">
          <q-autocomplete
            @search="search"
            @selected="selectedMedia"
            ref="searchModal"
            :max-results="5"
          />
        </q-search>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
import ResourceSearch from 'components/ResourceSearch'
import NQList from 'components/NQList'

export default {
  components: {
    ResourceSearch,
    NQList
  },
  name: 'DrawerDevo',
  fiery: true,
  data () {
    return {
      lessonLoading: true,
      devoLoading: false,
      lesson: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid), {
        onSuccess: async () => {
          const topics = (await Promise.all(this.lesson.topics.map(e => {
            return this.$firebase.nqFirestore.collection('topics').doc(e).get()
          })))
          console.log('topics', topics.map(e => { return e.data() }))
          this.topicOptions = this.topicOptions.concat(topics.map(e => { return { label: e.data().title, value: e.id } }))
          this.resources = (await this.$firebase.nqResources(this.lesson.resources)).data.resources
          // console.log('resources', resources)
          this.lessonLoading = false
        }
      }),
      devo: this.$fiery(this.$firebase.devoContentRef(this.$route.params.seriesid, this.$route.params.lessonid, this.$route.params.devoid), {
        onSuccess: () => {
          if (!this.devo.usedResources) {
            this.devo.usedResources = []
          }
          this.devoLoading = false
        }
      }),
      topicSelect: 'none',
      topicOptions: [
        {
          label: 'Choose a topic...',
          value: 'none'
        }
      ],
      topic: {},
      topicLoading: true,
      resources: [],
      searchTerm: ''
    }
  },
  watch: {
    'topicSelect': async function (newVal, oldVal) {
      if (newVal !== 'none' && newVal !== oldVal && newVal !== this.topic.id) {
        this.topicLoading = true
        this.topic = (await this.$firebase.nqTopics([newVal])).data.joined[0]
        this.topicLoading = false
      }
    }
  },
  mounted () {
    this.$root.$on('remove-module', (id) => {
      this.lesson.usedResources.splice(this.lesson.usedResources.findIndex(e => { return e.id === id }))
      this.devo.usedResources.splice(this.devo.usedResources.findIndex(e => { return e.id === id }))
      this.$fiery.update(this.lesson)
      this.$fiery.update(this.devo)
    })
  },
  methods: {
    // async pullTopics () {
    //   console.log('pull')
    //   this.topicOptions = [
    //     {
    //       label: 'Choose a topic...',
    //       value: 'none'
    //     }
    //   ]
    //   this.topicOptions.concat((await this.$firebase.nqFirestore.collection('topics').get()).docs.map(e => {
    //     console.log('done', e.data())
    //     const data = e.data()
    //     return {
    //       label: data.title,
    //       value: e.id
    //     }
    //   }))
    // }
    addModule (id, type) {
      var obj = {
        media: id,
        type: type,
        editing: false,
        slide: false,
        time: 0,
        wordcount: 0
      }
      this.$root.$emit('add-module', obj)
      this.lesson.usedResources.push({ id, type })
      this.devo.usedResources.push({ id, type })
      this.$fiery.update(this.lesson)
      this.$fiery.update(this.devo)
    },
    search (input, done) {
      const acceptableTypes = [ 'quote', 'outline', 'idea', 'illustration', 'video', 'image', 'composition', 'article', 'document' ]
      this.$firebase.nqSearch(input, (results) => {
        done(results.filter(e => { return acceptableTypes.includes(e.item.type) }))
      })
    },
    selectedMedia (item) {
      console.log('selected', item)
      this.addModule(item.id, item.item.type)
    }
  }
}
</script>

<style>
</style>
