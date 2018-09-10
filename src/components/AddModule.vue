<template>
  <div class="col-12 relative-position" style="height: 30px; margin-bottom: 20px;">
    <q-btn round :color="color" icon="fas fa-plus" class="absolute-center" @click.native="showAdd" />
    <!-- // TODO: Add a new component here like add-media but that uses the NQ database -->
  </div>
</template>

<script>
/**
 * A modal component for adding a new module to a section
 * 
 * ```html
 * <add-module :sectionid="value" :close="value" :edit="value" :contentType="value" :dark="value" />
 * ```
 * 
 * @author jacob beck
 */
export default {
  name: 'AddModule',
  props: {
    /**
     * id of section to add module to
     */
    sectionid: { type: String },
    /**
     * Function to close all other open modules
     */
    close: { type: Function },
    /**
     * Function to open new module for editing
     */
    edit: { type: Function },
    /**
     * type of module being added
     */
    contentType: { type: String },
    /**
     * dark or light theme
     */
    dark: { type: Boolean }
  },
  data () {
    return {
      /**
       * Acceptable module types
       * @type {string[]}
       */
      moduleTypes: ['activity', 'bible', 'question', 'text'],
      /**
       * Acceptable NQ module types
       * @type {string[]}
       */
      nqmediaTypes: ['book', 'movie', 'video', 'image', 'article', 'composition', 'document', 'discourse', 'note', 'quote', 'illustration', 'outline', 'idea'],
      /**
       * v-model for modal visibility
       * @type {boolean}
       */
      showAddMedia: false,
      /**
       * type of new module
       */
      type: '',
      /**
       * color for q-btn element
       * @type {string}
       */
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
    /**
     * Initialize the component
     * Sets initial color value based on dark prop
     * @return {void} void
     */
    init () {
      if (this.dark === '') {
        this.color = 'dark'
      } else {
        this.color = 'primary'
      }
    },
    /**
     * Show the add module action sheet at the bottom of the screen
     * @return {void} void
     */
    showAdd () {
      var actions = [
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
      if (this.contentType === 'devo' || this.contentType === 'guide') {
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
    /**
     * Function to add module of a specific type
     * @param {string} type type of the new module
     * @return {void} void
     */
    addModule (type) {
      console.log('add module')
      this.close()
      if (this.moduleTypes.includes(type)) {
        var obj = {
          type: type,
          editing: false,
          slide: false,
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
        /**
         * Emits an add-module event
         * @param {object} data the new module object
         * @param {string} sectionid the section to which the new module should be added
         * @see {ContentEditor} ContentEditor has the $on function listening for this event
         */
        this.$root.$emit('add-module', obj, this.sectionid)
      } else {
        console.error('Invalid new module type')
      }
    },
    // TODO: Rebuild for NQ modules in the future
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
