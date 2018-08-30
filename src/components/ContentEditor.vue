<template>
  <div>
    <div class="row gutter-sm">
      <!-- Before -->
      <div class="col-12" v-if="structure.before && structure.before.hook.show">
        <module-section id="hook" :data="structure.before.hook" :content-type="type" :contentid="id" @edit="editModule" @save="saveModule" @autosave="autoSaveModule" @close="closeModule" @remove="removeModule" class="section-card" />
      </div>
      <!-- Sections -->
      <div class="col-12" v-if="sections.length > 0">
        <draggable :list="sections" @start="drag=true" @change="onSectionDrag" ref="sectionDrag" :options="{ group: 'sections', disabled: $q.platform.is.mobile }">
          <module-section v-for="section in sections" :key="section['.key']" :id="section['.key']" :data="section" :content-type="type" :contentid="id" :edit="editSection" :remove="removeSection" @edit="editModule" @save="saveModule" @autosave="autoSaveModule" @close="closeModule" @remove="removeModule" class="section-card" />
        </draggable>
      </div>
      <add-section :add-section="addSection" :close="closeModule" />
      <!-- Modules -->
      <div class="col-12" v-if="modules.length > 0">
        <draggable :list="modules" @start="drag=true" @change="onChangeMod" @add="onAddMod" @remove="onRemoveMod" ref="indModuleDrag" :options="{ group: { name: 'modules', pull: 'clone' }, handle: '.drag-handle', disabled: editingid !== '' || ($q.platform.is.mobile && !$q.platform.is.ipad) }">
          <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'mod-' + mod.type" :id="mod['.key']" :data="mod" class="module-card" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" v-bind:class="{ 'active-card': mod.editing === $firebase.auth.currentUser.uid }" />
        </draggable>
      </div>
      <!-- After -->
      <div class="col-12">
        <mod-repeated-thought v-if="type === 'guide'" :seriesid="$route.params.seriesid" :lessonid="$route.params.lessonid" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" />
        <mod-application v-if="structure.after && structure.after.application.show" id="application" :data="structure.after.application" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.after.application.editing === $firebase.auth.currentUser.uid }" />
        <mod-prayer v-if="structure.after && structure.after.prayer.show" id="prayer" :data="structure.after.prayer" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.after.prayer.editing === $firebase.auth.currentUser.uid }" />
      </div>
    </div>
    <q-modal ref="addNewModule" content-classes="add-module-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="cancelModule"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Choose Section</h4>
        </div>
        <div class="col-12">
          <q-select
            v-model="sectionChoice"
            float-label="Choose Section to Add Module"
            :options="sections.map(e => { return { label: e.title, value: e['.key'] } })"
          />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="addModule">Save</q-btn>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddModule from 'components/AddModule.vue'
import AddSection from 'components/AddSection.vue'
import ModSection from 'components/modules/Section.vue'
import ModQuote from 'components/modules/Quote.vue'
import ModText from 'components/modules/Text.vue'
import ModBible from 'components/modules/Bible.vue'
import ModActivity from 'components/modules/Activity.vue'
import ModQuestion from 'components/modules/Question.vue'
import ModVideo from 'components/modules/Video.vue'
import ModImage from 'components/modules/Image.vue'
import ModComposition from 'components/modules/Composition.vue'
import ModLyric from 'components/modules/Lyric.vue'
import ModIllustration from 'components/modules/Illustration.vue'
import ModApplication from 'components/modules/Application.vue'
import ModPrayer from 'components/modules/Prayer.vue'
import ModRepeatedThought from 'components/modules/RepeatedThought.vue'
import ModuleSection from 'components/ModuleSection.vue'

export default {
  components: {
    Draggable,
    AddModule,
    AddSection,
    ModSection,
    ModQuote,
    ModText,
    ModBible,
    ModActivity,
    ModQuestion,
    ModVideo,
    ModImage,
    ModComposition,
    ModLyric,
    ModIllustration,
    ModApplication,
    ModPrayer,
    ModRepeatedThought,
    ModuleSection
  },
  // name: 'ComponentName',
  props: ['type', 'id'],
  data () {
    return {
      drag: false,
      editingid: '',
      editingSection: undefined,
      sectionChoice: '',
      tempModule: false,
      structure: {
        before: {
          hook: {
            show: false
          }
        },
        after: {
          application: {
            show: false
          },
          prayer: {
            show: false
          }
        }
      }
    }
  },
  watch: {
    // 'editingid': function (newid, oldid) {
    //   console.log('old mod', oldid)
    //   console.log('new mod', newid)
    //   if (!oldid) {
    //     console.log('no old id...')
    //   } else if (!this.deleting) {

    //   }
    // },
    'tempModule': function (val) {
      console.log('tempModule watch')
      if (val !== false) {
        console.log('tempModule not empty', val)
        if (val.sectionid) {
          this.addModule(val.sectionid)
        } else if (this.sections.length > 0) {
          this.$refs.addNewModule.show()
        } else {
          this.addModule()
        }
      } else {
        console.log('tempModule empty', val)
        this.$refs.addNewModule.hide()
      }
    }
  },
  computed: {
    nextModOrder: function () {
      return this.modules.length
    },
    nextSectionOrder: function () {
      return this.sections.length
    }
  },
  firebase () {
    return {
      structure: {
        source: this.$firebase.ref(this.type, 'structure', this.id, this.$route.params.seriesid, this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          console.log('structure loaded')
          this.$emit('modules-init', {
            before: {
              hook: this.structure.before.hook.show
            },
            after: {
              application: this.structure.after.application.show,
              prayer: this.structure.after.prayer.show
            }
          })
        }
      },
      sections: {
        source: this.$firebase.ref(this.type, 'sections', this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('sections loaded')
        }
      },
      modules: {
        source: this.$firebase.ref(this.type, 'modules', this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('modules loaded')
        }
      },
      versions: {
        source: this.$firebase.ref(this.type, 'versions', this.id, this.$route.params.seriesid, this.$route.params.lessonid),
        readyCallback: function (val) {
          console.log('versions loaded')
        }
      }
    }
  },
  mounted () {
    this.$root.$children[0].user.$on('add-module', (data, sectionid) => {
      console.log('section', sectionid)
      this.tempModule = {
        data: data,
        sectionid: sectionid
      }
    })
    // this.$root.$children[0].user.$on('edit-module', (moduleid, sectionid) => {
    //   this.startEdit(moduleid, sectionid)
    // })
    // this.$root.$children[0].user.$on('save-module', (moduleid, sectionid, data) => {
    //   this.saveModule(moduleid, sectionid, data)
    // })
    // this.$root.$children[0].user.$on('close-module', (moduleid, sectionid) => {
    //   this.closeModule(moduleid, sectionid)
    // })
    // this.$root.$children[0].user.$on('remove-module', (moduleid, sectionid) => {
    //   this.removeModule(moduleid, sectionid)
    // })
    this.init()
  },
  methods: {
    init () {
      console.log('contentEditor mounted')
    },
    editModule (moduleid, sectionid) {
      console.log('edit module', moduleid, sectionid)
      if (this.editingid !== moduleid && this.editingid !== '') {
        console.log('close module before edit')
        this.closeModule(this.editingid, this.editingSection)
      }
      this.editingid = moduleid
      this.editingSection = sectionid
      if (sectionid) {
        if (sectionid === 'hook') {
          this.$firebaseRefs.structure.child('before').child('hook').update({
            editing: this.$firebase.auth.currentUser.uid
          })
        } else {
          this.$firebaseRefs.sections.child(sectionid).update({
            editing: this.$firebase.auth.currentUser.uid
          })
        }
        this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).child(moduleid).update({
          editing: this.$firebase.auth.currentUser.uid
        })
      } else if (moduleid === 'application' || moduleid === 'prayer') {
        this.$firebaseRefs.structure.child('after').child(moduleid).update({
          editing: this.$firebase.auth.currentUser.uid
        })
      } else {
        this.$firebaseRefs.modules.child(moduleid).update({
          editing: this.$firebase.auth.currentUser.uid
        })
      }
    },
    autoSaveModule (moduleid, sectionid, text) {
      console.log('autosave module', moduleid, sectionid, text)
      if (sectionid) {
        this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).child(moduleid).update({
          text: text
        })
      } else if (moduleid === 'application' || moduleid === 'prayer') {
        this.$firebaseRefs.structure.child('after').child(moduleid).update({
          text: text
        })
      } else {
        this.$firebaseRefs.modules.child(moduleid).update({
          text: text
        })
      }
    },
    saveModule (moduleid, sectionid, data) {
      console.log('save module', moduleid, sectionid, data)
      var saveData = {...data}
      saveData.editing = false
      delete saveData['.key']
      if (saveData.type === 'text' || saveData.type === 'bible') {
        saveData.wordcount = this.getWordCount(saveData.text)
        saveData.time = this.getEstTime(saveData.wordcount)
      }
      console.log('save data', saveData)
      if (sectionid) {
        this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).child(moduleid).update(saveData)
      } else if (moduleid === 'application' || moduleid === 'prayer') {
        this.$firebaseRefs.structure.child('after').child(moduleid).update(saveData)
      } else {
        this.$firebaseRefs.modules.child(moduleid).update(saveData)
      }
      this.editingid = ''
    },
    closeModule (moduleid, sectionid) {
      console.log('closing', moduleid, sectionid)
      console.log('current', this.editingid, this.editingSection)
      if (moduleid !== undefined && typeof moduleid === 'string') {
        if (sectionid !== undefined) {
          this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).child(moduleid).update({
            editing: false
          })
        } else if (moduleid === 'application' || moduleid === 'prayer') {
          this.$firebaseRefs.structure.child('after').child(moduleid).update({
            editing: false
          })
        } else {
          this.$firebaseRefs.modules.child(moduleid).update({
            editing: false
          })
        }
      } else if (this.editingid !== '') {
        if (this.editingSection !== undefined) {
          this.$firebase.sectionModules(this.type, this.id, this.editingSection, this.$route.params.seriesid, this.$route.params.lessonid).child(this.editingid).update({
            editing: false
          }).then(() => {
            this.editingid = ''
            this.editingSection = undefined
          })
        } else if (this.editingid === 'application' || this.editingid === 'prayer') {
          this.$firebaseRefs.structure.child('after').child(this.editingid).update({
            editing: false
          }).then(() => {
            this.editingid = ''
            this.editingSection = undefined
          })
        } else {
          this.$firebaseRefs.modules.child(this.editingid).update({
            editing: false
          }).then(() => {
            this.editingid = ''
            this.editingSection = undefined
          })
        }
      } else {
        console.log('no current module to close')
      }
    },
    removeModule (moduleid, sectionid) {
      console.log('remove module', moduleid, sectionid)
      if (sectionid) {
        this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).child(moduleid).remove()
      } else if (moduleid === 'application' || moduleid === 'prayer') {
        this.$firebaseRefs.structure.child('after').child(moduleid).remove()
      } else {
        this.$firebaseRefs.modules.child(moduleid).remove()
      }
      this.editingid = ''
    },
    addModule (sectionid) {
      this.tempModule.data.editing = this.$firebase.auth.currentUser.uid
      if (sectionid) {
        this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).push(this.tempModule.data).then((newMod) => {
          this.tempModule = false
          this.editingid = newMod.key
          this.editingSection = sectionid
        })
      } else {
        this.tempModule.data.order = this.nextModOrder
        this.$firebaseRefs.modules.push(this.tempModule.data).then((newMod) => {
          this.tempModule = false
          this.editingid = newMod.key
          this.editingSection = undefined
        })
      }
    },
    cancelModule () {
      this.tempModule = false
    },
    addSection (title) {
      var obj = {
        title: title,
        static: false,
        order: this.nextSectionOrder,
        editing: false
      }
      this.$firebaseRefs.sections.push(obj)
    },
    editSection (sectionid, updates) {
      this.$firebaseRefs.sections.child(sectionid).update(updates)
    },
    removeSection (sectionid) {
      this.$firebase.sectionModules(this.type, this.id, sectionid, this.$route.params.seriesid, this.$route.params.lessonid).remove()
      this.$firebaseRefs.sections.child(sectionid).remove()
    },
    getModuleById (moduleid, sectionid) {
      if (sectionid) {
        return this.sections.find((element) => {
          return element['.key'] === sectionid
        }).modules.find((element) => {
          return element['.key'] === moduleid
        })
      } else {
        return this.modules.find((element) => {
          return element['.key'] === moduleid
        })
      }
    },
    getWordCount (string) {
      return string.split(' ').length
    },
    getEstTime (wordcount) {
      return Math.ceil(wordcount / this.$root.$children[0].user.prefs.speakingSpeed)
    },
    onSectionDrag (val) {
      this.drag = false
      if (val.moved) {
        var updatedMods = {}
        this.sections.forEach((item, index) => {
          updatedMods[item['.key']] = {...item}
          updatedMods[item['.key']].order = index
          delete updatedMods[item['.key']]['.key']
        })
        this.$firebaseRefs.sections.set(updatedMods)
      }
    },
    onAddMod (val) {
      console.log('module added', this.id, val)
      var newItem = {...this.modules[val.newIndex]}
      newItem.order = val.newIndex
      delete newItem['.key']
      console.log('new item', newItem)
      this.modules.splice(val.newIndex, 1)
      console.log('new item', newItem)
      var updatedMods = {}
      this.modules.slice(val.newIndex).forEach((item, index) => {
        console.log('add cycle item')
        updatedMods[item['.key']] = {...item}
        updatedMods[item['.key']].order = index + val.newIndex + 1
        delete updatedMods[item['.key']]['.key']
      })
      this.$firebaseRefs.modules.update(updatedMods)
      this.$firebaseRefs.modules.push(newItem)
    },
    onRemoveMod (val) {
      console.log('module removed', this.id, val)
      var updatedMods = {}
      this.modules.forEach((item, index) => {
        if (index !== val.oldIndex) {
          updatedMods[item['.key']] = {...item}
          updatedMods[item['.key']].order = index
          delete updatedMods[item['.key']]['.key']
        }
      })
      this.$firebaseRefs.modules.set(updatedMods)
    },
    onChangeMod (val) {
      if (val.moved) {
        var updatedMods = {}
        this.modules.forEach((item, index) => {
          updatedMods[item['.key']] = {...item}
          updatedMods[item['.key']].order = index
          delete updatedMods[item['.key']]['.key']
        })
        this.$firebaseRefs.modules.set(updatedMods)
      }
    }
  }
}
</script>

<style>

.module-card {
  margin-bottom: 20px;
}

/* .section-card {
  margin-bottom: 20px;
} */

.add-module-modal {
  padding: 20px;
}

.drag-handle {
  float: left;
  height: 60px;
  margin-right: -5px;
  padding-top: 20px;
  padding-left: 4px;
  padding-right: 4px;
  opacity: 0.5;
  cursor: move;
}

.drag-handle:hover {
  opacity: .7;
}

</style>
