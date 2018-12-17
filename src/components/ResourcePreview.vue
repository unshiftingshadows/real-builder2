<template>
  <div class="resource-preview">
    <!-- <q-btn color="negative" class="float-right" icon="fas fa-trash" @click.native="remove(resource.id)" v-if="remove !== undefined" /> -->
    <q-btn color="primary" class="float-right" @click.native="addClicked" v-if="addModule !== undefined">Add</q-btn>
    <div class="row gutter-sm items-center">
      <div class="col-xs-2">
        <img v-if="type !== 'note' && type !== 'document'" :src="media.thumbURL" style="width: 100%;" />
      </div>
      <div class="col-xs-10">
        <h4>{{ media.title }}</h4>
        <p><span v-for="author in media.author" :key="author">{{ author }}</span></p>
        <div v-if="!snippetTypes.includes(type)">
          <q-chip v-for="tag in media.allTags" :key="tag" color="primary">{{ tag }}</q-chip>
        </div>
        <div v-if="snippetTypes.includes(type)" class="col-12">
          <div v-if="snippet.text">
            <!-- <h5>{{ type.charAt(0).toUpperCase() + type.slice(1) }} Text</h5> -->
            <blockquote>{{ snippet.text }}</blockquote>
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
          <br/>
          <q-chip v-for="tag in snippet.tags" :key="tag" color="primary">{{ tag }}</q-chip>
          <div v-if="snippet.notes !== ''">
            <h5>{{ type.charAt(0).toUpperCase() + type.slice(1) }} Notes</h5>
            <p>{{ snippet.notes }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row gutter-sm justify-center" v-if="type === 'article'">
      <div class="col-xs-10">
        <span v-html="media.html"></span>
      </div>
    </div>
  </div>
</template>

<script>
// import QuoteList from 'components/QuoteList.vue'

export default {
  // components: {
  //   QuoteList
  // },
  name: 'PreviewResource',
  props: [ 'resource', 'type', 'addModule', 'close', 'remove' ],
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
        this.media = value.media
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
