<template>
  <q-card>
    <div v-if="!data.editing">
      <q-card-title>
        <q-btn class="float-right cursor-sectioner" icon="fas fa-edit" color="primary" size="sm" @click.native="edit(id)" />
        <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        Prayer
        <span slot="subtitle" v-if="data.title !== ''">{{ data.title }}</span>
      </q-card-title>
      <q-card-main>
        <p><span v-html="data.text" /></p>
      </q-card-main>
    </div>
    <div v-if="data.editing">
      <q-card-title>
        <q-btn link class="float-right cursor-sectioner" icon="fas fa-times" color="primary" size="sm" @click.native="close" />
        Prayer
      </q-card-title>
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="data.title" float-label="Subtitle" />
          </div>
          <div class="col-12">
            <text-editor :text.sync="data.text" :save="textSave" />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click.native="save(id, undefined, data)">Save</q-btn>
          </div>
        </div>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
import TextEditor from 'components/TextEditor.vue'

export default {
  components: {
    TextEditor
  },
  name: 'mod-prayer',
  props: [ 'id', 'data', 'edit', 'save', 'close', 'remove', 'autosave' ],
  data () {
    return {}
  },
  methods: {
    textSave (text) {
      this.autosave(this.id, text, this.data.title)
    }
  }
}
</script>

<style>
</style>
