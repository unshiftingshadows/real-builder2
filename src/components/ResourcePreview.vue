<template>
  <div class="resource-preview">
    <q-btn color="primary" class="float-right" @click.native="addClicked" v-if="addModule !== undefined">Add</q-btn>
    <div class="row gutter-sm">
      <div class="col-xs-12 col-md-4">
        <img v-if="type !== 'note' && type !== 'document'" :src="media.thumbURL" style="width: 100%;" />
      </div>
      <div class="col-xs-12 col-md-8">
        <h4>{{ media.title }}</h4>
        <p><span v-for="author in media.author" :key="author">{{ author }}</span></p>
        <div>
          <q-chip v-for="tag in media.allTags" :key="tag" color="primary">{{ tag }}</q-chip>
        </div>
      </div>
      <div v-if="snippetTypes.includes(type)" class="col-12">
          <div v-if="snippet.text">
            <h5>{{ type.charAt(0).toUpperCase() + type.slice(1) }} Text</h5>
            <p>{{ snippet.text }}</p>
          </div>
          <div v-if="snippet.points">
            <h5>{{ type.charAt(0).toUpperCase() + type.slice(1) }} Points</h5>
            <ul v-if="!snippet.numbered">
              <li v-for="point in snippet.points" :key="point">{{ point }}</li>
            </ul>
            <ol v-if="snippet.numbered">
              <li v-for="point in snippet.points" :key="point">{{ point }}</li>
            </ol>
          </div>
          <q-chip v-for="tag in snippet.tags" :key="tag" color="primary">{{ tag }}</q-chip>
          <div v-if="snippet.notes !== ''">
            <h5>{{ type.charAt(0).toUpperCase() + type.slice(1) }} Notes</h5>
            <p>{{ snippet.notes }}</p>
          </div>
        </div>
      <!-- <div class="col-12" v-if="type === 'book' || type === 'movie'">
        <quote-list :mediaid="media._id" :media="media" :media-type="type" modal></quote-list>
      </div> -->
    </div>
  </div>
</template>

<script>
// import QuoteList from 'components/QuoteList.vue'

export default {
  // components: {
  //   QuoteList
  // },
  // name: 'ComponentName',
  props: [ 'resource', 'type', 'addModule', 'close' ],
  data () {
    return {
      snippetTypes: [ 'quote', 'outline', 'idea', 'illustration' ],
      media: {
        _id: '',
        imageURL: '',
        title: ''
      },
      snippet: {
        _id: '',
        text: ''
      }
    }
  },
  watch: {
    'resource': function (value) {
      if (this.snippetTypes.includes(this.type)) {
        this.media = value.mediaid
        this.snippet = value
      } else {
        this.media = value
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.media = this.resource
    },
    addClicked () {
      this.addModule(this.resource._id, this.type)
      this.close()
    }
  }
}
</script>

<style>
.resource-preview {
  padding: 20px;
}
</style>
