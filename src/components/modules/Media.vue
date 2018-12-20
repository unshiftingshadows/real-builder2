<template>
  <q-card>
    <q-spinner size="2rem" color="secondary" class="absolute-center" v-if="loading" />
    <div v-if="!loading" @click="clicked">
      <!-- Drag Handle -->
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title class="q-card-title-fix">
        <!-- Menu Options -->
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <!-- <q-item link v-close-overlay @click.native="modMethods.edit(id)">Edit</q-item> -->
              <q-item link @click.native="modMethods.remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <!-- Time Notice -->
        <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        <!-- Mod Icon -->
        <q-icon :name="typeInfo[data.type].icon" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
        <span v-if="titleType.includes(data.type)">{{ media.title }}</span><span v-if="titleType.includes(data.type) && data.type !== 'outline'"> | {{ media.author.join(', ') }}</span>
        <span v-if="textType.includes(data.type)">{{ media.text }}</span>
      </q-card-title>
      <q-card-main>
        <!-- Mod Info -->
        <span v-if="titleType.includes(data.type) && data.type !== 'outline' && data.type !== 'video' && data.type !== 'image'">{{ media.description }}</span>
        <div class="q-body-2" style="text-align: right;" v-if="textType.includes(data.type) || data.type === 'outline'">{{ meta.title }} | {{ meta.author.join(', ') }}</div>
        <q-video v-if="data.type === 'video'" :src="media.embedURL" />
        <img v-if="data.type === 'image'" :src="media.imageURL" style="width: 100%;" />
        <p v-if="data.notes && data.notes !== ''">Notes:<br/>{{ data.notes }}</p>
      </q-card-main>
    </div>
    <!-- <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          Title Field w/ Close Button
          <div class="col-12">
            <q-btn class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="modMethods.close" :disabled="loading" />
            <q-input
              v-model="data[typeInfo[data.type].ref]"
              :float-label="typeInfo[data.type].label"
              autofocus
              @keydown="keydown"
            />
          </div>
          Time Estimation
          <div class="col-12" v-if="data.type === 'activity' || data.type === 'question'">
            <q-input type="number" v-model="data.time" float-label="Estimated Time (in minutes)" />
          </div>
          Notes Textarea
          <div class="col-12" v-if="data.type === 'question'">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="100" :min-rows="1" />
          </div>
          Long Form Text Editor
          <div class="col-12" v-if="data.type === 'text' || data.type === 'activity'">
            <text-editor ref="editor" :text.sync="data.text" :auto-save="textSave" :save-close="saveClose" />
          </div>
          Bible Translation Selection
          <div class="col-12" v-if="data.type === 'bible'">
            <q-select
              v-model="translation"
              float-label="Bible Translation"
              :options="translationOptions"
              class="dark-label"
              dark
            />
          </div>
          Save/Delete Buttons
          <div class="col-12">
            <q-btn color="primary" @click.native="preSave" :disabled="loading">Save</q-btn>
            <q-btn outline color="negative" class="on-right" @click.native="modMethods.remove(id)" :disabled="loading">Delete</q-btn>
          </div>
        </div>
      </q-card-main>
    </div> -->
    <resource-preview ref="resourcePreview" v-if="!loading" :type="data.type" :resource="mediaFull" />
  </q-card>
</template>

<script>
import ResourcePreview from 'components/ResourcePreview'

export default {
  components: {
    ResourcePreview
  },
  name: 'mod-media',
  props: [ 'id', 'data', 'modMethods', 'modOptions' ],
  fiery: true,
  data () {
    return {
      media: this.$fiery(this.$firebase.nqFirestore.collection(this.data.type + 's').doc(this.data.media), {
        onSuccess: async () => {
          if (this.data.time === 0) {
            if (this.textType.includes(this.data.type)) {
              this.data.wordcount = this.getWordCount(this.media.text)
              this.data.time = this.getEstTime(this.data.wordcount)
            } else if (this.data.type === 'article') {
              this.data.wordcount = this.media.wordCount
              this.data.time = this.getEstTime(this.data.wordcount)
            } else if (this.data.type === 'video') {
              this.data.time = this.media.duration
            } else {
              this.data.time = 1
            }
            this.modMethods.save(this.id, this.data)
          }
          if (this.snippetType.includes(this.data.type)) {
            this.meta = (await this.$firebase.nqFirestore.collection(this.media.mediaType + 's').doc(this.media.mediaid).get()).data()
            this.loading = false
          } else {
            this.loading = false
          }
        }
      }),
      meta: {},
      resourceOpen: false,
      loading: true,
      types: [ 'quote', 'outline', 'idea', 'illustration', 'video', 'image', 'composition', 'article', 'document' ],
      snippetType: [ 'quote', 'idea', 'illustration', 'outline' ],
      titleType: [ 'video', 'image', 'composition', 'article', 'document', 'outline' ],
      textType: [ 'quote', 'idea', 'illustration' ],
      typeInfo: {
        quote: {
          label: 'Quote',
          ref: 'quote',
          icon: 'fas fa-quote-left'
        },
        outline: {
          label: 'Outline',
          ref: 'outline',
          icon: 'fas fa-list-ul'
        },
        idea: {
          label: 'Idea',
          ref: 'idea',
          icon: 'fas fa-lightbulb'
        },
        illustration: {
          label: 'Illustration',
          ref: 'illustration',
          icon: 'fas fa-paint-brush'
        },
        video: {
          label: 'Video',
          ref: 'video',
          icon: 'fas fa-video'
        },
        image: {
          label: 'Image',
          ref: 'image',
          icon: 'fas fa-image'
        },
        composition: {
          label: 'Composition',
          ref: 'composition',
          icon: 'fas fa-pen-alt'
        },
        article: {
          label: 'Article',
          ref: 'article',
          icon: 'fas fa-newspaper'
        },
        document: {
          label: 'Document',
          ref: 'document',
          icon: 'fas fa-file'
        }
      }
    }
  },
  computed: {
    mediaFull: function () {
      return {...this.media, media: this.meta}
    }
  },
  methods: {
    getWordCount (string) {
      if (string !== undefined) {
        return string.split(' ').length
      } else {
        return 0
      }
    },
    getEstTime (wordcount) {
      return Math.ceil(wordcount / 120)
    },
    // keydown (e) {
    //   switch (e.keyCode) {
    //     case 9:
    //       if (this.data.type === 'text' || this.data.type === 'activity') {
    //         this.focusEditor()
    //         e.preventDefault()
    //       }
    //       break
    //     case 13:
    //       if (this.data.type === 'bible' || e.metaKey) {
    //         this.preSave()
    //         e.preventDefault()
    //       }
    //       break
    //     default:
    //   }
    // },
    // preSave () {
    //   if (this.data.type === 'bible') {
    //     this.loading = true
    //     this.$database.bible(this.data.bibleRef, this.translation, (data) => {
    //       console.log(data)
    //       // NOTE: This needs to be moved to the server side -- not all versions will
    //       //       follow this same format
    //       this.data.text = data.text
    //       this.data.translation = this.translation
    //       this.data.bibleRef = this.$bible.readable(this.data.bibleRef)
    //       this.loading = false
    //       this.modMethods.save(this.id, this.data)
    //     })
    //   } else {
    //     this.modMethods.save(this.id, this.data)
    //   }
    // },
    // textSave (text) {
    //   this.modMethods.autosave(this.id, text, this.data.title)
    // },
    // focusEditor () {
    //   this.$refs.editor.focus()
    // },
    // saveClose () {
    //   this.preSave(this.id, this.data)
    // },
    clicked (e) {
      console.log('clicked!', e)
      if (e.srcElement.nodeName !== 'I' && e.srcElement.nodeName !== 'BUTTON') {
        this.$refs.resourcePreview.show()
      }
    }
  }
}
</script>

<style>

.q-card-title-fix .q-card-title {
  height: auto !important;
}

</style>
