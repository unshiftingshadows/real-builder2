<template>
  <q-card>
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid">
      <!-- Drag Handle -->
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title>
        <!-- Menu Options -->
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="modMethods.edit(id)">Edit</q-item>
              <q-item link @click.native="modMethods.remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <!-- Time Notice -->
        <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        <!-- Mod Icon -->
        <q-icon :name="typeInfo[data.type].icon" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
        {{ data.title }}
      </q-card-title>
      <q-card-main>
        <!-- Mod Info -->
        <p><span v-html="data.text" /></p>
      </q-card-main>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          <!-- Title Field w/ Close Button -->
          <div class="col-12">
            <q-btn class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="modMethods.close" :disabled="loading" />
            <q-input
              v-model="data[typeInfo[data.type].ref]"
              :float-label="typeInfo[data.type].label"
              autofocus
              @keydown="keydown"
            />
          </div>
          <!-- Time Estimation -->
          <div class="col-12" v-if="data.type === 'activity' || data.type === 'question'">
            <q-input type="number" v-model="data.time" float-label="Estimated Time (in minutes)" />
          </div>
          <!-- Notes Textarea -->
          <div class="col-12" v-if="data.type === 'question'">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="100" :min-rows="1" />
          </div>
          <!-- Long Form Text Editor -->
          <div class="col-12" v-if="data.type === 'text' || data.type === 'activity'">
            <text-editor ref="editor" :text.sync="data.text" :auto-save="textSave" :save-close="saveClose" />
          </div>
          <!-- Bible Translation Selection -->
          <div class="col-12" v-if="data.type === 'bible'">
            <q-select
              v-model="translation"
              float-label="Bible Translation"
              :options="translationOptions"
              class="dark-label"
              dark
            />
          </div>
          <!-- Save/Delete Buttons -->
          <div class="col-12">
            <q-btn color="primary" @click.native="preSave" :disabled="loading">Save</q-btn>
            <q-btn outline color="negative" @click.native="modMethods.remove(id)" :disabled="loading">Delete</q-btn>
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
  name: 'mod-content',
  props: [ 'id', 'data', 'modMethods', 'modOptions' ],
  data () {
    return {
      loading: false,
      types: [ 'text', 'bible', 'activity', 'question' ],
      typeInfo: {
        text: {
          label: 'Title',
          ref: 'title',
          icon: 'fas fa-align-left'
        },
        activity: {
          label: 'Title',
          ref: 'title',
          icon: 'fas fa-trophy'
        },
        question: {
          label: 'Question',
          ref: 'question',
          icon: 'fas fa-question'
        },
        bible: {
          label: 'Bible Ref',
          ref: 'bibleRef',
          icon: 'fas fa-book'
        }
      },
      translation: this.data.translation,
      translationOptions: [
        {
          label: 'English Standard Version - ESV',
          value: 'esv'
        },
        {
          label: 'New American Standard Bible - NASB',
          value: 'nas'
        },
        {
          label: 'New International Version - NIV',
          value: 'niv'
        },
        {
          label: 'New King James Version - NKJV',
          value: 'nkj'
        },
        {
          label: 'New English Translation - NET',
          value: 'net'
        },
        {
          label: 'Lexham English Bible - LEB',
          value: 'leb'
        },
        {
          label: 'King James Version - KVJ',
          value: 'kjv'
        },
        {
          label: 'American Standard Version - ASV',
          value: 'asv'
        },
        {
          label: 'World English Bible - WEB',
          value: 'web'
        }
      ]
    }
  },
  methods: {
    keydown (e) {
      switch (e.keyCode) {
        case 9:
          if (this.data.type === 'text' || this.data.type === 'activity') {
            this.focusEditor()
            e.preventDefault()
          }
          break
        case 13:
          if (this.data.type === 'bible' || e.metaKey) {
            this.preSave()
            e.preventDefault()
          }
          break
        default:
      }
    },
    preSave () {
      if (this.data.type === 'bible') {
        this.loading = true
        this.$database.bible(this.data.bibleRef, this.translation, (data) => {
          console.log(data)
          // NOTE: This needs to be moved to the server side -- not all versions will
          //       follow this same format
          this.data.text = data.text
          this.data.translation = this.translation
          this.data.bibleRef = this.$bible.readable(this.data.bibleRef)
          this.loading = false
          this.modMethods.save(this.id, this.data)
        })
      } else {
        this.modMethods.save(this.id, this.data)
      }
    },
    textSave (text) {
      this.modMethods.autosave(this.id, text, this.data.title)
    },
    focusEditor () {
      this.$refs.editor.focus()
    },
    saveClose () {
      this.preSave(this.id, this.data)
    }
  }
}
</script>

<style>
</style>
