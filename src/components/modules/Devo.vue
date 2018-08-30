<template>
  <q-card>
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid">
      <q-card-title>
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="edit(id)">Design</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'devo', params: { seriesid: $route.params.seriesid, lessonid: $route.params.lessonid, devoid: id } })">Write</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <span style="font-style: bold; font-size: 1.5rem; vertical-align: middle;">Day {{ id }}:&nbsp;&nbsp;</span>
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
            <q-input v-model="data.title" float-label="Title" />
          </div>
          <div class="col-12">
            <q-input v-model="data.mainIdea" float-label="Main Idea" type="textarea" :max-height="150" :min-rows="3" />
          </div>
          <div class="col-12">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="150" :min-rows="3" />
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
            <q-btn color="primary" @click.native="save(id, data)">Save</q-btn>
          </div>
        </div>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-devo',
  props: [ 'id', 'data', 'edit', 'save', 'close' ],
  data () {
    return {
      readableRefs: []
    }
  },
  watch: {
    'data': function (val) {
      if (val.bibleRefs !== undefined && val.bibleRefs !== '') {
        this.readableRefs = val.bibleRefs.split(',').map(e => { return this.$bible.readable(e) })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.data.bibleRefs !== undefined && this.data.bibleRefs !== '') {
        this.readableRefs = this.data.bibleRefs.split(',').map(e => { return this.$bible.readable(e) })
      }
    },
    addRef (newRef) {
      this.data.bibleRefs = newRef.map(e => { return this.$bible.parse(e) }).join(',')
      this.readableRefs = newRef.map(e => { return this.$bible.readable(e) })
    }
  }
}
</script>

<style>
</style>
