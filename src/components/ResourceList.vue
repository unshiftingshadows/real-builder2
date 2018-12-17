<template>
  <div>
    <h5>Topics<q-btn icon="fas fa-plus" color="primary" class="on-right" size="sm" @click.native="showTopics()" /></h5>
    <div v-if="!topics || topics === undefined || topics.length === 0" class="q-subheading">No current topics</div>
    <div v-masonry transition-duration="0.3s" item-selection=".topic-card">
      <q-card v-masonry-tile v-for="topic in topics" :key="topic.id" class="topic-card cursor-pointer" inline @click.native="openTopic(topic)">
        <q-card-title>{{ topic.title }}</q-card-title>
        <q-card-main>{{ topic.premise }}</q-card-main>
      </q-card>
    </div>
    <h5>Resources<q-btn icon="fas fa-plus" color="primary" class="on-right" size="sm" @click.native="addResourceModal = true" /></h5>
    <div v-if="!resources || resources === undefined || resources.length === 0" class="q-subheading">No current resources</div>
    <n-q-list v-if="resources && resources !== undefined && resources.length > 0" :items="resources" :remove-resource="removeResource" />
    <q-modal v-model="addTopicModal" ref="addTopicModal" content-classes="topic-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="addTopicModal = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Add Topic</h4>
        </div>
        <div class="col-12">
          <q-spinner size="3rem" color="secondary" class="absolute-center" v-if="allTopics.length === 0" />
          <q-list highlight v-if="allTopics.length > 0">
            <q-item v-for="topic in allTopics" :key="topic.id" class="cursor-pointer" @click.native="addTopic(topic.id)">
              <q-item-main>{{ topic.title }}</q-item-main>
            </q-item>
          </q-list>
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="update">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="addResourceModal" ref="addResourceModal" content-classes="topic-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="addResourceModal = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Add Resource</h4>
        </div>
        <div class="col-12">
          <!-- <q-input type="text" v-model="researchSearch" float-label="Search for resources" clearable @keyup.enter="search" /> -->
          <q-search v-model="researchSearch" placeholder="Search..." class="on-left gt-sm" color="dark" inverted icon="fas fa-search">
            <q-autocomplete
              @search="search"
              @selected="selected"
              ref="searchModal"
            />
          </q-search>
          <q-spinner size="3rem" color="secondary" v-if="searching" />
          <!-- <n-q-list v-if="researchResults.length > 0" :items="researchResults" /> -->
        </div>
      </div>
    </q-modal>
    <topic-preview :data="selectedTopic" :remove-topic="removeTopic" ref="topicModal" />
  </div>
</template>

<script>
import NQList from 'components/NQList.vue'
import TopicPreview from 'components/TopicPreview.vue'

export default {
  components: {
    NQList,
    TopicPreview
  },
  name: 'ResourceList',
  props: ['id', 'type', 'lesson', 'addResearch', 'removeResearch'],
  data () {
    return {
      topics: [],
      resources: [],
      allTopics: [],
      selectedTopic: {},
      addTopicModal: false,
      addResourceModal: false,
      researchSearch: '',
      researchResults: [],
      searching: false,
      topicOpen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.topics = (await this.$firebase.nqTopics(this.lesson.topics)).data.joined
      this.resources = (await this.$firebase.nqResources(this.lesson.resources)).data.resources.concat([].concat.apply([], this.topics.map(e => {
        return e.resources
      })))
    },
    async showTopics () {
      this.addTopicModal = true
      this.allTopics = (await this.$firebase.nqList('topic')).docs.filter(e => {
        return this.topics.map(f => { return f.id }).indexOf(e.id) === -1
      }).map(e => { return { id: e.id, ...e.data() } })
    },
    addTopic (id) {
      this.addResearch(id, 'topic')
      this.addTopicModal = false
      this.init()
    },
    removeTopic (id) {
      this.removeResearch(id, 'topic')
      this.$refs.topicModal.hide()
      this.init()
    },
    removeResource (id) {
      this.removeResearch(id, 'other')
      this.init()
    },
    search (searchInput, done) {
      this.searching = true
      this.$firebase.nqSearch(searchInput, (results) => {
        this.searching = false
        this.researchResults = results
        done(results)
      })
    },
    selected (item) {
      console.log('selected', item)
    },
    openTopic (topic) {
      this.selectedTopic = topic
      this.$refs.topicModal.show()
    }
  }
}
</script>

<style>

.topic-card {
  margin: 5px;
  width: 95%;
  cursor: pointer;
}
.topic-modal {
  width: 100%;
  padding: 30px;
}
@media screen and (min-width: 800px) {
  .topic-card {
    width: 31%;
  }
}
@media screen and (min-width: 1200px) {
  .topic-card {
    width: 48%;
  }
  .topic-modal {
    min-width: 650px;
    width: 650px;
  }
}

</style>
