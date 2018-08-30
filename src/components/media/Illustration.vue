<template>
  <div v-if="open">
    <div class="row gutter-sm" v-if="!editing">
      <div class="col-12">
        <q-btn icon="fas fa-times" size="xs" color="primary" @click.native="close" class="float-right" />
        <h5>{{ illustration.title }}</h5>
      </div>
      <div class="col-12">
        <p>{{ illustration.text }}</p>
      </div>
      <div class="col-12" v-if="illustration.tags.length > 0 || illustration.bibleRefs.length > 0">
        <q-chip v-if="illustration.tags.length > 0" v-for="tag in illustration.tags" :key="tag" color="primary">{{ tag }}</q-chip>
        |
        <q-chip v-if="readableRefs.length > 0" v-for="ref in readableRefs" :key="ref" color="secondary">{{ ref }}</q-chip>
      </div>
      <div class="col-12">
        <q-btn color="primary" @click.native="editing = true">Edit</q-btn>
        <q-btn color="primary" v-if="addModule !== undefined" @click.native="add">Add</q-btn>
      </div>
    </div>
    <div class="row gutter-sm" v-if="editing">
      <div class="col-12">
        <q-input v-model="illustration.title" float-label="Title" type="text" />
      </div>
      <div class="col-12">
        <q-input v-model="illustration.text" float-label="Illustration" type="textarea" :max-height="100" :min-rows="1" />
      </div>
      <div class="col-12">
        <q-chips-input v-model="illustration.tags" float-label="Tags" />
      </div>
      <div class="col-12">
        <q-chips-input
          color="secondary"
          v-model="readableRefs"
          float-label="Bible References"
          @input="addRef"
        />
      </div>
      <div class="col-12">
        <q-btn color="primary" @click.native="save">Save</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'

export default {
  props: ['data', 'open', 'close', 'addModule'],
  name: 'media-illustration',
  data () {
    return {
      editing: false,
      illustration: {
        tags: [],
        bibleRefs: [],
        author: '',
        text: '',
        mediaTitle: ''
      },
      readableRefs: []
    }
  },
  watch: {
    'data': function (val) {
      console.log('val', val)
      if (val !== {}) {
        this.editing = false
        this.illustration = val
        this.readableRefs = val.bibleRefs.map(e => { return this.$bible.readable(e) })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.illustration = this.data
    },
    addRef (newRef) {
      this.illustration.bibleRefs = newRef.map(e => { return this.$bible.parse(e) })
      this.readableRefs = newRef.map(e => { return this.$bible.readable(e) })
    },
    save () {
      this.$database.update('illustration', this.illustration._id, this.illustration, (res) => {
        Notify.create({
          type: 'positive',
          message: 'Illustration saved!',
          position: 'bottom-left'
        })
        this.editing = false
      })
    },
    add () {
      this.addModule(this.illustration._id, 'illustration', this.illustration)
      this.close()
    }
  }
}
</script>

<style>
</style>
