<template>
  <div>
    <h5>Topics
      <q-btn icon="fas fa-plus" color="primary" class="on-right" size="sm" @click.native="showTopics()" />
      <q-spinner size="2rem" color="secondary" class="on-right" v-if="loadingTopics" />
    </h5>
    <div v-if="!loadingTopics && topics.length === 0" class="q-subheading">No current topics</div>
    <div v-masonry transition-duration="0.3s" item-selection=".topic-card" v-if="!loadingTopics && topics.length > 0">
      <q-card v-masonry-tile v-for="topic in topics" :key="topic.id" class="topic-card cursor-pointer" inline @click.native="openTopic(topic)">
        <q-card-title>{{ topic.title }}</q-card-title>
        <q-card-main>{{ topic.premise }}</q-card-main>
      </q-card>
    </div>
    <h5>Resources
      <q-btn icon="fas fa-plus" color="primary" class="on-right" size="sm" @click.native="addResourceModal = true" />
      <q-spinner size="2rem" color="secondary" class="on-right" v-if="loadingResources" />
    </h5>
    <div v-if="!loadingResources && resources.length === 0" class="q-subheading">No current resources</div>
    <n-q-list v-if="!loadingResources && resources.length > 0" :items="resources" :remove-resource="removeResource" />
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
          <!-- <q-btn-toggle
            v-model="searchType"
            class="float-right"
            color="light"
            text-color="dark"
            toggle-text-color="white"
            toggle-color="tertiary"
            :options="[
              {label: 'Media', value: 'media'},
              {label: 'Snippet', value: 'snippet'},
              {label: 'Add New', value: 'add'}
            ]"
          /> -->
          <q-tabs align="justify">
            <q-tab default slot="title" name="search-tab" label="Search" />
            <!-- <q-tab slot="title" name="snippet-tab" label="Snippet" /> -->
            <q-tab slot="title" name="add-tab" label="Add" />
            <q-tab-pane name="search-tab">
              <q-search v-model="researchSearch" placeholder="Search..." class="on-left gt-sm" style="margin-top: 60px;" color="dark" inverted icon="fas fa-search">
                <q-autocomplete
                  @search="$firebase.nqSearch"
                  @selected="selectedMedia"
                  ref="searchModal"
                  :max-results="6"
                />
                <q-spinner size="2rem" color="secondary" v-if="searching" />
              </q-search>
            </q-tab-pane>
            <!-- <q-tab-pane name="snippet-tab">
              <q-search v-model="snippetSearch" placeholder="Search..." class="on-left gt-sm" style="margin-top: 60px;" color="dark" inverted icon="fas fa-search">
                <q-autocomplete
                  @search="searchSnippet"
                  @selected="selectedSnippet"
                  ref="searchSnippetModal"
                  :max-results="4"
                />
                <q-spinner size="2rem" color="secondary" v-if="searching" />
              </q-search>
            </q-tab-pane> -->
            <q-tab-pane name="add-tab">Add Media Tab</q-tab-pane>
          </q-tabs>
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
      loadingTopics: true,
      loadingResources: true,
      topics: [],
      resources: [],
      allTopics: [],
      selectedTopic: {},
      addTopicModal: false,
      addResourceModal: false,
      searchType: '',
      researchSearch: '',
      researchResults: [],
      snippetSearch: '',
      snippetResults: [],
      searching: false,
      topicOpen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.loadingTopics = true
      this.loadingResources = true
      this.topics = (await this.$firebase.nqTopics(this.lesson.topics)).data.joined
      this.loadingTopics = false
      this.resources = (await this.$firebase.nqResources(this.lesson.resources)).data.resources.concat([].concat.apply([], this.topics.map(e => {
        return e.resources
      })))
      this.loadingResources = false
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
    searchMedia (searchInput, done) {
      this.searching = true
      this.$firebase.nqSearch(searchInput, 'media', (results) => {
        this.searching = false
        this.researchResults = results
        done(results)
      })
    },
    selectedMedia (item) {
      this.addResearch(item['.key'], item.type)
      this.$refs.addResourceModal.hide()
      this.init()
    },
    searchSnippet (searchInput, done) {
      this.searching = true
      this.$firebase.nqSearch(searchInput, 'snippet', (results) => {
        this.searching = false
        this.researchResults = results
        done(results)
      })
    },
    selectedSnippet (item) {
      this.addResearch(item['.key'], item.type)
      this.$refs.addResourceModal.hide()
      this.init()
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
