<template>
  <q-card>
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid" @click="clicked">
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title>
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="edit(id)">Design</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'lesson', params: { seriesid: $route.params.seriesid, lessonid: id } })">Devos</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'research', params: { seriesid: $route.params.seriesid, lessonid: id } })">Research</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'guide', params: { seriesid: $route.params.seriesid, lessonid: id } })">Guides</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'review', params: { seriesid: $route.params.seriesid, lessonid: id } })">Review</q-item>
              <q-item link @click.native="remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <span style="font-style: bold; font-size: 2rem; vertical-align: middle;">{{ num + 1 }}.&nbsp;&nbsp;</span>
        {{ data.title }}
      </q-card-title>
      <q-card-main>
        <p>{{ data.mainIdea }}</p>
        <p class="q-caption">{{ data.notes }}</p>
        <q-chip v-for="ref in readableRefs" :key="ref" color="secondary" small style="margin-right: 5px;">{{ ref }}</q-chip>
      </q-card-main>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-btn link class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="close" />
            <q-input v-model="data.title" float-label="Title" @keydown.enter.prevent="enterPressed" autofocus />
          </div>
          <div class="col-12">
            <q-input v-model="data.mainIdea" float-label="Main Idea" type="textarea" :max-height="150" :min-rows="3" @keydown.enter.prevent="enterPressed" />
          </div>
          <div class="col-12">
            <q-chips-input
              color="secondary"
              v-model="readableRefs"
              float-label="Bible References"
              @input="addRef"
              @keydown.enter.prevent="enterPressed"
            />
          </div>
          <div class="col-12">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="150" :min-rows="3" @keydown.enter.prevent="enterPressed" />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click.native="save(id, null)">Save</q-btn>
            <q-btn outline color="negative" @click.native="remove(id)">Delete</q-btn>
          </div>
        </div>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-lesson',
  props: [ 'id', 'data', 'edit', 'save', 'close', 'remove', 'num' ],
  data () {
    return {
      readableRefs: []
    }
  },
  watch: {
    'data': function (val) {
      if (val.bibleRefs !== undefined && val.bibleRefs !== '') {
        this.readableRefs = val.bibleRefs.map(e => { return this.$bible.readable(e) })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.data && this.data.bibleRefs !== undefined && this.data.bibleRefs !== '') {
        this.readableRefs = this.data.bibleRefs.map(e => { return this.$bible.readable(e) })
      }
    },
    addRef (newRef) {
      this.data.bibleRefs = newRef.map(e => { return this.$bible.parse(e) })
      this.readableRefs = newRef.map(e => { return this.$bible.readable(e) })
    },
    enterPressed (e) {
      if (e.shiftKey && e.metaKey) {
        // TODO: Save close and open next
        console.log('save, close, and open next')
        this.save(this.id, this.num + 1)
      } else if (e.metaKey) {
        console.log('just save and close')
        this.save(this.id, null)
      }
    },
    clicked (e) {
      if (e.srcElement.nodeName !== 'I' && e.srcElement.nodeName !== 'BUTTON') {
        this.edit(this.id)
      }
    }
  }
}
</script>

<style>
</style>
