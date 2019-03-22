<template>
  <q-card :color="data.type === 'bible' ? 'secondary' : ''">
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid" @click="clicked">
      <!-- Drag Handle -->
      <div class="round-borders bg-primary drag-handle" v-if="(!$q.platform.is.mobile || $q.platform.is.ipad) && !modOptions.disabled">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title>
        <!-- Menu Options -->
        <q-btn v-show="!data.editing" v-if="!modOptions.disabled" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="modMethods.edit(id)" v-if="data.type !== 'mainidea'">Edit</q-item>
              <q-item link @click.native="modMethods.remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <!-- Time Notice -->
        <span v-if="data.type !== 'mainidea'" class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        <!-- Mod Icon -->
        <q-icon :name="typeInfo[data.type].icon" :color="data.type === 'bible' ? 'white' : 'primary'" size="2rem" />&nbsp;&nbsp;&nbsp;
        <span v-if="data.type !== 'bible' && data.type !== 'question'">{{ data.title }}</span>
        <span v-if="data.type === 'question'">{{ data.question }}</span>
        <span v-if="data.type === 'bible'">{{ data.bibleRef }}</span>
      </q-card-title>
      <q-card-main>
        <!-- Mod Info -->
        <p><span v-html="data.text" /></p>
        <blockquote v-if="data.notes || data.type === 'activity'" class="q-caption"><span v-html="data.type === 'activity' && data.equipment ? 'Equipment: ' + data.equipment.join(', ') : data.notes" /></blockquote>
        <span class="q-title" v-if="data.type === 'bullet'">
          <component v-bind:is="data.ordered ? 'ol' : 'ul'">
            <li v-for="item in data.list" :key="item" style="margin-bottom: 10px;">
              {{ item }}
            </li>
          </component>
        </span>
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
          <div class="col-12" v-if="data.type === 'activity' || data.type === 'question' || data.type === 'bullet'">
            <q-input type="number" v-model="data.time" float-label="Estimated Time (in minutes)" @keydown="keydown" />
          </div>
          <!-- Notes Textarea -->
          <div class="col-12" v-if="data.type === 'question'">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="100" :min-rows="1" @keydown="keydown" />
          </div>
          <!-- Long Form Text Editor -->
          <div class="col-12" v-if="data.type === 'text' || data.type === 'activity'">
            <text-editor ref="editor" :text.sync="data.text" :auto-save="e => autosave(this.id, e, this.data.title)" :save-close="saveClose" />
          </div>
          <!-- List Editor -->
          <div class="col-12" v-if="data.type === 'bullet' || data.type === 'activity'">
            <span class="q-subheading on-left" v-if="data.type === 'activity'">Equipment</span>
            <q-checkbox v-model="data.ordered" label="Ordered?" v-if="data.type === 'bullet'" />
            <component v-bind:is="data.ordered ? 'ol' : 'ul'">
              <li v-for="item in data.type === 'bullet' ? data.list : data.equipment" :key="item">
                {{ item }}
              </li>
            </component>
            <q-input v-model="temp" float-label="New Item" type="text" @keydown="keydown" />
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
            <q-btn outline color="negative" class="on-right" @click.native="modMethods.remove(id)" :disabled="loading">Delete</q-btn>
            <q-spinner size="2rem" class="on-right" v-if="loading" />
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
      types: [ 'text', 'bible', 'activity', 'question', 'mainidea', 'bullet' ],
      typeInfo: {
        text: {
          label: 'Title',
          ref: 'title',
          icon: 'fas fa-align-left'
        },
        bullet: {
          label: 'Title',
          ref: 'title',
          icon: 'fas fa-list'
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
        },
        mainidea: {
          label: 'Main Idea',
          ref: 'mainidea',
          icon: 'fas fa-lightbulb'
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
      ],
      temp: ''
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
          if (this.data.type === 'bullet' || this.data.type === 'activity') {
            this.data.type === 'bullet' ? this.data.list.push(this.temp) : this.data.equipment.push(this.temp)
            this.temp = ''
          }
          break
        default:
      }
    },
    preSave () {
      if (this.data.type === 'bible') {
        this.loading = true
        var readable = this.$bible.readable(this.data.bibleRef)
        this.$bible.text(this.data.bibleRef, this.translation).then(res => {
          this.data.text = res
          this.data.translation = this.translation
          this.data.bibleRef = readable
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
    },
    clicked (e) {
      if (e.srcElement.nodeName !== 'I' && e.srcElement.nodeName !== 'BUTTON') {
        if (!this.data.editing) {
          this.modMethods.edit(this.id)
        }
      }
    }
  }
}
</script>

<style>
</style>
