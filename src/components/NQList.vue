<template>
  <div>
    <div class="row gutter-sm">
      <!-- <div class="col-12">
        <q-btn label="Pack" color="primary" @click.native="pack" />
      </div> -->
      <div class="col-12" v-if="nofilter !== ''">
        <q-select
          multiple
          v-model="selectedTypes"
          :options="types"
          dark
        />
      </div>
      <div class="col-12">
        <div v-masonry transition-duration="0.3s" item-selection=".media-cardl">
          <q-card v-masonry-tile v-for="item in showItems" :key="item._id" color="primary" v-bind:class="singlecolumn === '' ? ' one-column' : ''" class="media-cardl" @click.native="openItem(item.media, item.id, item.type)">
            <q-btn v-if="addButton === ''" icon="fas fa-plus" color="positive" class="float-right cursor-pointer" style="margin-bottom: 5px; margin-left: 5px;" dense size="sm" />
            <q-card-media v-if="item.type == 'book' || item.type == 'movie' || item.type == 'video' || item.type == 'article' || item.type == 'image'">
              <img :src="item.media.thumbURL" />
            </q-card-media>
            <q-card-title class="q-card-title-fix" v-if="item.type == 'book' || item.type == 'movie' || item.type == 'video' || item.type == 'article' || item.type == 'discourse' || item.type == 'note'">
              {{ item.media.title }}
              <span v-if="item.type == 'book' || item.type == 'movie' || item.type == 'video' || item.type == 'article' || item.type == 'discourse'" v-for="author in item.media.author" :key="author" slot="subtitle">{{ author }}</span>
              <span v-if="item.type == 'note'" slot="subtitle">{{ item.media.text }}</span>
            </q-card-title>
            <q-card-main v-if="item.type == 'quote' || item.type === 'outline' || item.type === 'idea' || item.type === 'illustration'">
              <p v-if="item.type !== 'outline'">{{ item.media.text }}</p>
              <ol v-if="item.type === 'outline' && item.media.numbered">
                <li v-for="point in item.media.points" :key="point">
                  {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
                </li>
              </ol>
              <ol v-if="item.type === 'outline' && !item.media.numbered">
                <li v-for="point in item.media.points" :key="point">
                  {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
                </li>
              </ol>
              <p class="q-body-2">{{ item.media.media.author.join(', ') }} | {{ item.media.media.title }}</p>
            </q-card-main>
          </q-card>
        </div>
      </div>
    </div>
    <resource-preview ref="resourcePreview" :type="resourceType" :resource="resource" :addModule="addModule" />
  </div>
</template>

<script>
import ResourcePreview from 'components/ResourcePreview.vue'

export default {
  components: {
    ResourcePreview
  },
  name: 'NQList',
  props: ['items', 'width', 'addModule', 'addButton', 'removeResource', 'singlecolumn', 'nofilter'],
  data () {
    return {
      showItems: [],
      isImage: this.type === 'images',
      resourceType: '',
      resource: '',
      selectedTypes: [
        'all'
      ],
      types: [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Book',
          value: 'book'
        },
        {
          label: 'Movie',
          value: 'movie'
        },
        {
          label: 'Image',
          value: 'image'
        },
        {
          label: 'Video',
          value: 'video'
        },
        {
          label: 'Article',
          value: 'article'
        },
        {
          label: 'Note',
          value: 'note'
        },
        {
          label: 'Document',
          value: 'document'
        },
        {
          label: 'Discourse',
          value: 'discourse'
        },
        {
          label: 'Composition',
          value: 'composition'
        },
        {
          label: 'Quote',
          value: 'quote'
        },
        {
          label: 'Outline',
          value: 'outline'
        },
        {
          label: 'Idea',
          value: 'idea'
        },
        {
          label: 'Illustration',
          value: 'illustration'
        }
      ]
    }
  },
  watch: {
    'selectedTypes': function (newVal, oldVal) {
      if (newVal.includes('all')) {
        if (newVal.length > 1) {
          if (oldVal.includes('all')) {
            this.selectedTypes.splice(0, 1)
          } else {
            this.selectedTypes = ['all']
            this.showItems = this.items
          }
        }
      }
      this.showItems = this.items.filter(this.checkType)
    },
    'items': function (value) {
      if (this.selectedTypes[0] === 'all') {
        this.showItems = value
      } else {
        this.showItems = value.filter(this.checkType)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.showItems = this.items
    },
    openItem (item, id, type) {
      console.log(item)
      console.log(id)
      console.log(type)
      if (this.types.map(function (e) { return e.value }).includes(type)) {
        this.resource = {...item, id}
        this.resourceType = type
        this.$refs.resourcePreview.show()
      } else {
        console.error('Incorrect item type for routing...')
      }
    },
    checkType (item) {
      return this.selectedTypes.includes('all') ? true : this.selectedTypes.includes(item.type)
    },
    remove (id) {
      this.resourceOpen = false
      this.removeResource(id)
    }
  }
}
</script>

<style>
.one-column.media-cardl {
  width: 95% !important;
}

.media-cardl {
  margin: 5px;
  width: 95%;
  cursor: pointer;
}
.image-cardl {
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}
.image-cardl:hover {
  opacity: 1;
}
@media screen and (min-width: 800px) {
  .media-cardl {
    width: 31%;
  }
}
@media screen and (min-width: 1200px) {
  .media-cardl {
    width: 45%;
  }
}
.q-card-title-fix .q-card-title {
  height: auto !important;
}
</style>
