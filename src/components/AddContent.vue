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

export default {
  props: ['type'],
  name: 'AddContent',
  data () {
    return {
      showAddContent: false,
      title: '',
      types: ['series'],
      bibleRef: ''
    }
  },
  validations: {
    title: {
      required
    }
  },
  watch: {
    'showAddContent': function () {
      this.$v.title.$reset()
    }
  },
  computed: {
    readableType: function () {
      return capitalize(this.type)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.title = ''
    },
    add (template) {
      this.$v.title.$touch()
      if (this.$v.title.$error) {
        this.$q.notify('Please review fields again')
        return
      }
      if (this.types.includes(this.type)) {
        // var obj = {
        //   title: this.title,
        //   template: template,
        //   prefs: this.$root.$children[0].user.prefs[this.type + 'Structure']
        // }
        var obj = {
          title: this.title,
          mainIdea: '',
          roles: {
            [this.$firebase.auth.currentUser.uid]: 'admin'
          },
          lessonOrder: []
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
        // this.$database.add(this.type, obj, (res) => {
        //   this.showAddContent = false
        //   Notify.create({
        //     message: this.readableType + ' created!',
        //     type: 'positive',
        //     position: 'bottom-left'
        //   })
        //   console.log('add content', res, this.type)
        //   if (this.type === 'series') {
        //     this.$router.push({ name: this.type, params: { seriesid: res._id } })
        //   } else {
        //     this.$router.push({ name: this.type, params: { id: res._id } })
        //   }
        // })
      } else {
        console.error('Invalid add type')
      }
    },
    show () {
      this.showAddContent = true
    }
  }
}
</script>

<style>
</style>
