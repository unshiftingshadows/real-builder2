<template>
  <q-modal ref="addContentModal" v-model="showAddContent" content-classes="add-content-modal">
    <q-btn
      color="primary"
      @click.native="showAddContent = false"
      icon="fas fa-times"
      class="float-right"
      size="sm"
    />
    <h4>Add {{ readableType }}</h4>
    <div class="row gutter-sm">
      <div class="col-12">
        <q-field
            :error="$v.title.$error"
            error-label="Title is required"
          >
          <q-input type="text" float-label="Title" v-model="title" @blur="$v.title.$touch" />
        </q-field>
      </div>
      <div class="col-12">
        <q-btn color="primary" class="float-right" @click.native="add('blank')">Add {{ readableType }}</q-btn>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { Notify, format } from 'quasar'
import { required } from 'vuelidate/lib/validators'
const { capitalize } = format

/**
 * A modal component for adding new content
 * 
 * ```html
 * <add-content :type="value" />
 * ```
 * 
 * @author jacob beck
 */
export default {
  props: {
    /**
     * The type of content to be added?
     */
    'type': { type: String, required: true }
  },
  name: 'AddContent',
  data () {
    return {
      /**
       * v-model for modal visibility
       * @type {boolean}
       */
      showAddContent: false,
      /**
       * new content title value
       * @type {string}
       */
      title: '',
      /**
       * types available for adding
       * @type {string[]}
       */
      types: ['series']
    }
  },
  validations: {
    title: {
      required
    }
  },
  watch: {
    /**
     * Resets title on open or close of the modal
     */
    'showAddContent': function () {
      this.$v.title.$reset()
    }
  },
  computed: {
    /**
     * Returns a capitalized type string for rendering
     * @return {string} capitalized type
     */
    readableType: function () {
      return capitalize(this.type)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    /**
     * Initialize the component
     * Sets the title to ''
     * @return {void} void
     */
    init () {
      this.title = ''
    },
    /**
     * Perform the add function
     * @param {object} template a template object to use to initialize the content
     * @return {void} void
     */
    add (template) {
      this.$v.title.$touch()
      if (this.$v.title.$error) {
        this.$q.notify('Please review fields again')
        return
      }
      if (this.types.includes(this.type)) {
        var obj = {
          title: this.title,
          mainIdea: '',
          roles: {
            [this.$firebase.auth.currentUser.uid]: 'admin'
          },
          lessonOrder: [],
          status: 'BUILD'
        }
        this.$firebase.seriesRef().add(obj).then((newRef) => {
          this.showAddContent = false
          Notify.create({
            message: this.readableType + ' created!',
            type: 'positive',
            position: 'bottom-left'
          })
          this.$router.push({ name: 'series', params: { seriesid: newRef.id } })
        })
      } else {
        console.error('Invalid add type')
      }
    },
    /**
     * Show AddContent modal
     * @return {void} void
     */
    show () {
      this.showAddContent = true
    }
  }
}
</script>

<style>
</style>
