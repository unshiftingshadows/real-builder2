<template>
  <q-modal v-model="value" ref="modal">
    <div class="resource-modal" v-if="resource">
      <!-- <q-btn color="negative" class="float-right" icon="fas fa-trash" @click.native="remove(resource.id)" v-if="remove !== undefined" /> -->
      <div class="row gutter-sm items-center">
        <div class="col-xs-3">
          <img v-if="type !== 'note' && type !== 'document'" :src="media.thumbURL" style="width: 100%;" />
        </div>
        <div class="col-xs-9">
          <q-btn
            color="primary"
            @click.native="$refs.modal.hide()"
            icon="fas fa-times"
            class="float-right on-right"
            size="sm"
          />
          <q-btn color="tertiary" class="float-right" @click.native="addClicked" v-if="addModule !== undefined && acceptableModules.includes(type)">Add</q-btn>
          <h4>{{ media.title }}</h4>
          <p v-if="media.author">{{ media.author.join(', ') }}</p>
          <p></p>
          <div v-if="!snippetTypes.includes(type)">
            <q-chip v-for="tag in media.allTags" :key="tag" color="primary">{{ tag }}</q-chip>
          </div>
        </div>
        <div class="col-xs-12">
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
          <span v-html="media.html" class="article-text"></span>
        </div>
      </div>
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'PreviewResource',
  props: [ 'value', 'resource', 'type', 'addModule', 'close', 'remove' ],
  data () {
    return {
      snippetTypes: [ 'quote', 'outline', 'idea', 'illustration' ],
      acceptableModules: [ 'quote', 'outline', 'idea', 'illustration', 'video', 'image', 'composition', 'article', 'document' ],
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
      if (this.snippetTypes.includes(this.type)) {
        this.media = this.resource.media
        this.snippet = this.resource
      } else {
        this.media = this.resource
      }
    },
    addClicked () {
      this.addModule(this.resource.id, this.type)
      this.hide()
    },
    show () {
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    }
  }
}
</script>

<style>
.article-text img:first-of-type {
  display: none !important;
}
.resource-modal {
  padding: 10px;
  width: 100%;
  height: 100%;
}
@media screen and (min-width: 1200px) {
  .resource-modal {
    padding: 30px;
    min-width: 650px;
    width: 650px;
  }
}
</style>
