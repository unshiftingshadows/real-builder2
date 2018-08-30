<template>
  <div class="col-12 relative-position" style="height: 30px; margin-bottom: 20px;">
    <q-btn round :color="color" icon="fas fa-plus" class="absolute-center" @click.native="showAdd" />
    <add-media :type="type" ref="addMedia" :add-new="addNewMedia" />
    <!-- TODO: Add a new component here like add-media but that uses the NQ database -->
  </div>
</template>

<script>
import AddMedia from 'components/AddMedia.vue'

export default {
  components: {
    AddMedia
  },
  // name: 'ComponentName',
  props: [ 'nextModOrder', 'sectionid', 'close', 'edit', 'contentType', 'dark' ],
  data () {
    return {
      moduleTypes: ['activity', 'bible', 'question', 'text'],
      omediaTypes: ['quote', 'image', 'illustration', 'lyric', 'video'],
      nqmediaTypes: ['book', 'movie', 'video', 'image', 'article', 'composition', 'document', 'discourse', 'note', 'quote', 'illustration', 'outline', 'idea'],
      showAddMedia: false,
      type: '',
      color: 'primary'
    }
  },
  watch: {
    'dark': function (val) {
      if (val === '') {
        this.color = 'dark'
      } else {
        this.color = 'primary'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.dark === '') {
        this.color = 'dark'
      } else {
        this.color = 'primary'
      }
    },
    showAdd () {
      var actions = [
        // {
        //   label: 'Section',
        //   color: 'primary',
        //   icon: 'fa-list-ol',
        //   handler: () => {
        //     console.log('section!')
        //     this.addModule('section')
        //   }
        // },
        {
          label: 'Text',
          color: 'primary',
          icon: 'fa-align-left',
          handler: () => {
            console.log('text!')
            this.addModule('text')
          }
        },
        {
          label: 'Bible',
          color: 'primary',
          icon: 'fa-book',
          handler: () => {
            console.log('bible!')
            this.addModule('bible')
          }
        }
      ]
      if (this.contentType === 'olesson' || this.contentType === 'devo' || this.contentType === 'guide') {
        actions.push({
          label: 'Activity',
          color: 'primary',
          icon: 'fa-trophy',
          handler: () => {
            console.log('activity!')
            this.addModule('activity')
          }
        })
        actions.push({
          label: 'Question',
          color: 'primary',
          icon: 'fa-question',
          handler: () => {
            console.log('question!')
            this.addModule('question')
          }
        })
      }
      if (this.contentType.charAt(0) !== 'r' && !this.$root.$children[0].user.nqUser) {
        console.log('running', this.contentType.charAt(0))
        if (this.$root.$children[0].user.prefs.mediaType.quote) {
          actions.push({
            label: 'Quote',
            color: 'primary',
            icon: 'fa-quote-left',
            handler: () => {
              console.log('quote!')
              this.type = 'quote'
              this.$refs.addMedia.show()
            }
          })
        }
        if (this.$root.$children[0].user.prefs.mediaType.image) {
          actions.push({
            label: 'Image',
            color: 'primary',
            icon: 'fa-image',
            handler: () => {
              console.log('image!')
              this.type = 'image'
              this.$refs.addMedia.show()
            }
          })
        }
        if (this.$root.$children[0].user.prefs.mediaType.illustration) {
          actions.push({
            label: 'Illustration',
            color: 'primary',
            icon: 'fa-paint-brush',
            handler: () => {
              console.log('illustration!')
              this.type = 'illustration'
              this.$refs.addMedia.show()
            }
          })
        }
        if (this.$root.$children[0].user.prefs.mediaType.lyric) {
          actions.push({
            label: 'Lyric',
            color: 'primary',
            icon: 'fa-music',
            handler: () => {
              console.log('lyric!')
              this.type = 'lyric'
              this.$refs.addMedia.show()
            }
          })
        }
        if (this.$root.$children[0].user.prefs.mediaType.video) {
          actions.push({
            label: 'Video',
            color: 'primary',
            icon: 'fa-play',
            handler: () => {
              console.log('video!')
              this.type = 'video'
              this.$refs.addMedia.show()
            }
          })
        }
      }
      this.$q.actionSheet({
        title: 'Add Module',
        grid: true,
        dismissLabel: 'Cancel',
        actions: actions
      })
    },
    addModule (type, id) {
      console.log('add module')
      this.close()
      // var newRef = this.$firebase.ref(this.$parent.type, 'modules', this.$parent.id).push()
      if (this.moduleTypes.includes(type) || this.omediaTypes.includes(type) || this.nqmediaTypes.includes(type)) {
        var obj = {
          type: type,
          editing: false,
          slide: false,
          order: this.nextModOrder,
          time: 0,
          wordcount: 0
        }
        if (type === 'text' || type === 'activity') {
          obj.title = ''
          obj.text = ''
        }
        if (type === 'question') {
          obj.text = ''
          obj.notes = ''
        }
        if (type === 'bible') {
          obj.text = ''
          obj.bibleRef = ''
          obj.translation = this.$root.$children[0].user.prefs.bibleTranslation
        }
        // if (this.omediaTypes.includes(type) || this.nqmediaTypes.includes(type)) {
        //   this.edit('')
        // } else {
        //   this.edit(newRef.key, this.sectionid)
        // }
        this.$root.$children[0].user.$emit('add-module', obj, this.sectionid)
      } else {
        console.error('Invalid new module type')
      }
    },
    addNewMedia (media) {
      this.showAddMedia = false
      this.addModule(this.type, media._id)
      this.type = ''
    }
  }
}
</script>

<style>

.add-media-modal {
  padding: 30px;
  width: 100%;
}
@media screen and (min-width: 1200px) {
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
