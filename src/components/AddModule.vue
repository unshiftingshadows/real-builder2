<template>
  <div class="col-12 relative-position" style="height: 30px; margin-bottom: 20px;">
    <q-btn round :color="color" icon="fas fa-plus" class="absolute-center" @click.native="showAdd" />
    <!-- TODO: Add a new component here like add-media but that uses the NQ database -->
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: [ 'nextModOrder', 'sectionid', 'close', 'edit', 'contentType', 'dark' ],
  data () {
    return {
      moduleTypes: ['activity', 'bible', 'question', 'text'],
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
          icon: 'fas fa-align-left',
          handler: () => {
            console.log('text!')
            this.addModule('text')
          }
        },
        {
          label: 'Bible',
          color: 'primary',
          icon: 'fas fa-book',
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
          icon: 'fas fa-trophy',
          handler: () => {
            console.log('activity!')
            this.addModule('activity')
          }
        })
        actions.push({
          label: 'Question',
          color: 'primary',
          icon: 'fas fa-question',
          handler: () => {
            console.log('question!')
            this.addModule('question')
          }
        })
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
      if (this.moduleTypes.includes(type) || this.nqmediaTypes.includes(type)) {
        var obj = {
          type: type,
          editing: false,
          slide: false,
          // order: this.nextModOrder,
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
          obj.translation = 'esv'
        }
        // if (this.omediaTypes.includes(type) || this.nqmediaTypes.includes(type)) {
        //   this.edit('')
        // } else {
        //   this.edit(newRef.key, this.sectionid)
        // }
        this.$root.$emit('add-module', obj, this.sectionid)
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
