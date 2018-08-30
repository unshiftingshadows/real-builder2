<template>
  <div v-if="open">
    <div class="row gutter-sm" v-if="!editing">
      <div class="col-12">
        <q-btn icon="fas fa-times" size="xs" color="primary" @click.native="close" class="float-right" />
        <img :src="image.imageURL" width="100%" />
      </div>
      <div class="col-12" v-if="image.tags.length > 0 || image.bibleRefs.length > 0">
        <q-chip v-if="image.tags.length > 0" v-for="tag in image.tags" :key="tag" color="primary">{{ tag }}</q-chip>
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
        <img :src="image.imageURL" width="100%" />
      </div>
      <div class="col-12">
        <p><b>Location:</b> {{ image.service }}</p>
      </div>
      <div class="col-12">
        <q-chips-input v-model="image.tags" float-label="Tags" />
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
  name: 'media-image',
  data () {
    return {
      editing: false,
      image: {
        tags: [],
        bibleRefs: []
      },
      readableRefs: []
    }
  },
  watch: {
    'data': function (val) {
      console.log('val', val)
      if (val !== {}) {
        this.editing = false
        this.image = val
        this.readableRefs = val.bibleRefs.map(e => { return this.$bible.readable(e) })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.image = this.data
    },
    addRef (newRef) {
      this.image.bibleRefs = newRef.map(e => { return this.$bible.parse(e) })
      this.readableRefs = newRef.map(e => { return this.$bible.readable(e) })
    },
    save () {
      this.$database.update('image', this.image._id, this.image, (res) => {
        Notify.create({
          type: 'positive',
          message: 'Image saved!',
          position: 'bottom-left'
        })
        this.editing = false
      })
    },
    add () {
      this.addModule(this.image._id, 'image', this.image)
      this.close()
    }
  }
}
</script>

<style>
</style>
