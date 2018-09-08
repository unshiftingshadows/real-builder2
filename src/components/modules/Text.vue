<template>
  <q-card>
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid">
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title>
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="modMethods.edit(id)">Edit</q-item>
              <q-item link @click.native="modMethods.remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        <q-icon name="fas fa-align-left" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
        {{ data.title }}
      </q-card-title>
      <q-card-main>
        <p><span v-html="data.text" /></p>
      </q-card-main>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-btn class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="close" />
            <q-input v-model="data.title" float-label="Title" autofocus @keydown.tab.prevent="focusEditor" />
          </div>
          <div class="col-12">
            <text-editor ref="editor" :text.sync="data.text" :auto-save="textSave" :save-close="saveClose" />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click.native="modMethods.save(id, data)">Save</q-btn>
            <q-btn outline color="negative" @click.native="modMethods.remove(id)">Delete</q-btn>
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
  name: 'mod-text',
  props: [ 'id', 'data', 'modMethods', 'modOptions' ],
  data () {
    return {}
  },
  methods: {
    textSave (text) {
      this.modMethods.autosave(this.id, text, this.data.title)
    },
    focusEditor () {
      console.log('focus editor')
      this.$refs.editor.focus()
    },
    saveClose () {
      console.log('save close')
      this.modMethods.save(this.id, this.data)
    }
  }
}
</script>

<style>
</style>
