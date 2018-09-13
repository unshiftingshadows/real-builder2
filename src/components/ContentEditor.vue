<template>
  <div>
    <div v-if="loading">
      <q-spinner color="primary" class="absolute-center" size="3rem" />
    </div>
    <div v-if="!loading" class="row gutter-sm">
      <div class="col-12">
        <q-select
          v-model="document.status"
          float-label="Status"
          :options="statusOptions"
        />
      </div>
      <!-- Before -->
      <div class="col-12" v-if="structure.hook && structure.hook.show">
        <module-section id="hook" :data="structure.hook" :modules="modules" :onChange="onChangeMod" :content-type="type" :contentid="id" @edit="editModule" @save="saveModule" @autosave="autoSaveModule" @close="closeModule" @remove="removeModule" class="section-card" />
      </div>
      <!-- Sections -->
      <div class="col-12" v-if="document && document.sectionOrder && document.sectionOrder.length > 0 && Object.keys(sections).length > 0">
        <draggable :list="document.sectionOrder" @start="drag=true" @change="onSectionDrag" ref="sectionDrag" :options="{ group: 'sections', disabled: $q.platform.is.mobile }">
          <module-section v-for="orderIndex in document.sectionOrder" :key="orderIndex" :id="orderIndex" :data="sections[orderIndex]" :modules="modules" :onChange="onChangeMod" :content-type="type" :contentid="id" :edit="editSection" :remove="removeSection" @edit="editModule" @save="saveModule" @autosave="autoSaveModule" @close="closeModule" @remove="removeModule" class="section-card" />
        </draggable>
      </div>
      <add-section :add-section="addSection" :close="closeModule" />
      <!-- Modules -->
      <!-- <div class="col-12" v-if="modules.length > 0">
        <draggable :list="modules" @start="drag=true" ref="indModuleDrag" :options="{ group: { name: 'modules', pull: 'clone' }, handle: '.drag-handle', disabled: editingid !== '' || ($q.platform.is.mobile && !$q.platform.is.ipad) }">
          <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'mod-' + mod.type" :id="mod['.key']" :data="mod" class="module-card" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" v-bind:class="{ 'active-card': mod.editing === $firebase.auth.currentUser.uid }" />
        </draggable>
      </div> -->
      <!-- After -->
      <div class="col-12">
        <mod-repeated-thought v-if="type === 'guide'" :seriesid="$route.params.seriesid" :lessonid="$route.params.lessonid" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" />
        <mod-application v-if="structure.application && structure.application.show" id="application" :data="structure.application" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.application.editing === $firebase.auth.currentUser.uid }" />
        <mod-prayer v-if="structure.prayer && structure.prayer.show" id="prayer" :data="structure.prayer" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.prayer.editing === $firebase.auth.currentUser.uid }" />
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
            :options="Object.keys(sections).map(e => { return { label: sections[e].title, value: sections[e]['.key'] } })"
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
// import ModQuote from 'components/modules/Quote.vue'
// import ModText from 'components/modules/Text.vue'
// import ModBible from 'components/modules/Bible.vue'
// import ModActivity from 'components/modules/Activity.vue'
// import ModQuestion from 'components/modules/Question.vue'
// import ModVideo from 'components/modules/Video.vue'
// import ModImage from 'components/modules/Image.vue'
// import ModComposition from 'components/modules/Composition.vue'
// import ModIllustration from 'components/modules/Illustration.vue'
import ModApplication from 'components/modules/Application.vue'
import ModPrayer from 'components/modules/Prayer.vue'
import ModRepeatedThought from 'components/modules/RepeatedThought.vue'
import ModuleSection from 'components/ModuleSection.vue'

export default {
  components: {
    Draggable,
    AddModule,
    AddSection,
    // ModQuote,
    // ModText,
    // ModBible,
    // ModActivity,
    // ModQuestion,
    // ModVideo,
    // ModImage,
    // ModComposition,
    // ModIllustration,
    ModApplication,
    ModPrayer,
    ModRepeatedThought,
    ModuleSection
  },
  name: 'ContentEditor',
  props: ['type', 'id'],
  fiery: true,
  data () {
    return {
      statusOptions: [
        {
          value: 'build',
          label: 'Build'
        },
        {
          value: 'write',
          label: 'Write'
        },
        {
          value: 'edit',
          label: 'Edit'
        },
        {
          value: 'approve',
          label: 'Approve'
        }
      ],
      loading: true,
      initRun: true,
      drag: false,
      editingid: '',
      editingSection: undefined,
      sectionChoice: '',
      tempModule: false,
      document: this.$fiery(this.$firebase.ref(this.type, '', this.id, this.$route.params.seriesid, this.$route.params.lessonid), {
        include: ['sectionOrder', 'status'],
        onSuccess: () => {
          if (!this.document.status) {
            this.document.status = 'build'
          }
        }
      }),
      structure: this.$fiery(this.$firebase.ref(this.type, 'structure', this.id, this.$route.params.seriesid, this.$route.params.lessonid), {
        map: true
      }),
      sections: this.$fiery(this.$firebase.ref(this.type, 'sections', this.id, this.$route.params.seriesid, this.$route.params.lessonid), {
        map: true
      }),
      modules: this.$fiery(this.$firebase.ref(this.type, 'modules', this.id, this.$route.params.seriesid, this.$route.params.lessonid), {
        map: true,
        onSuccess: () => {
          this.loading = false
        }
      }),
      versions: this.$fiery(this.$firebase.ref(this.type, 'versions', this.id, this.$route.params.seriesid, this.$route.params.lessonid))
    }
  },
  watch: {
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
  mounted () {
    this.$root.$on('add-module', (data, sectionid) => {
      console.log('section', sectionid)
      this.tempModule = {
        data: data,
        sectionid: sectionid
      }
    })
    this.init()
  },
  methods: {
    init () {
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
          this.structure.hook.editing = this.$firebase.auth.currentUser.uid
          this.$fiery.update(this.structure.hook, ['editing'])
        } else {
          this.sections[sectionid].editing = this.$firebase.auth.currentUser.uid
          this.$fiery.update(this.sections[sectionid], ['editing'])
        }
        this.modules[moduleid].editing = this.$firebase.auth.currentUser.uid
        this.$fiery.update(this.modules[moduleid], ['editing'])
      } else if (moduleid === 'application' || moduleid === 'prayer') {
        this.structure[moduleid].editing = this.$firebase.auth.currentUser.uid
        this.$fiery.update(this.structure[moduleid], ['editing'])
      } else {
        this.modules[moduleid].editing = this.$firebase.auth.currentUser.uid
        this.$fiery.update(this.modules[moduleid], ['editing'])
      }
    },
    autoSaveModule (moduleid, sectionid, text, title) {
      console.log('autosave module', moduleid, sectionid, text, title)
      if (moduleid === 'application' || moduleid === 'prayer') {
        this.structure[moduleid].text = text
        if (title !== undefined) {
          this.structure[moduleid].title = title
        }
        this.$fiery.update(this.structure[moduleid], ['title', 'text'])
      } else {
        if (title !== undefined) {
          this.modules[moduleid].title = title
        }
        this.modules[moduleid].text = text
        this.$fiery.update(this.modules[moduleid], ['title', 'text'])
      }
    },
    saveModule (moduleid, sectionid, data) {
      console.log('save module', moduleid, sectionid, data)
      data.editing = false
      if (data.type === 'text' || data.type === 'bible') {
        data.wordcount = this.getWordCount(data.text)
        data.time = this.getEstTime(data.wordcount)
      }
      console.log('save data', data)
      if (moduleid === 'application' || moduleid === 'prayer') {
        this.$fiery.update(data)
      } else {
        this.$fiery.update(data)
      }
      this.editingid = ''
    },
    closeModule (moduleid, sectionid) {
      console.log('closing', moduleid, sectionid)
      console.log('current', this.editingid, this.editingSection)
      if (moduleid !== undefined && typeof moduleid === 'string') {
        if (moduleid === 'application' || moduleid === 'prayer') {
          this.structure[moduleid].editing = false
          this.$fiery.update(this.structure[moduleid], ['editing'])
        } else {
          this.modules[moduleid].editing = false
          this.$fiery.update(this.modules[moduleid], ['editing'])
        }
      } else if (this.editingid !== '') {
        if (this.editingid === 'application' || this.editingid === 'prayer') {
          this.structure[this.editingid].editing = false
          this.$fiery.update(this.structure[this.editingid], ['editing'])
          this.editingid = ''
          this.editingSection = undefined
        } else {
          this.modules[this.editingid].editing = false
          this.$fiery.update(this.modules[this.editingid], ['editing'])
          this.editingid = ''
          this.editingSection = undefined
        }
      } else {
        console.log('no current module to close')
      }
    },
    removeModule (moduleid, sectionid) {
      console.log('remove module', moduleid, sectionid)
      if (sectionid !== '') {
        if (sectionid === 'hook') {
          this.structure.hook.moduleOrder.splice(this.structure.hook.moduleOrder.indexOf(moduleid), 1)
          this.$fiery.update(this.structure.hook, ['moduleOrder'])
        } else {
          this.sections[sectionid].moduleOrder.splice(this.sections[sectionid].moduleOrder.indexOf(moduleid), 1)
          this.$fiery.update(this.sections[sectionid], ['moduleOrder'])
        }
      }
      this.$fiery.remove(this.modules[moduleid])
      this.editingid = ''
    },
    addModule (sectionid) {
      console.log('adding module', sectionid, this.tempModule.data)
      this.tempModule.data.editing = this.$firebase.auth.currentUser.uid
      if (sectionid) {
        this.$fires.modules.add(this.tempModule.data).then((newMod) => {
          console.log('saved')
          this.tempModule = false
          this.editingid = newMod.id
          this.editingSection = sectionid
          if (sectionid === 'hook') {
            this.structure.hook.moduleOrder.push(newMod.id)
            this.$fiery.update(this.structure.hook, ['moduleOrder'])
          } else {
            this.sections[sectionid].moduleOrder.push(newMod.id)
            this.$fiery.update(this.sections[sectionid], ['moduleOrder'])
          }
        })
      } else {
        console.error('cannot add module to unknown section')
      }
    },
    cancelModule () {
      this.tempModule = false
    },
    addSection (title) {
      console.log('adding section', title)
      var obj = {
        title: title,
        static: false,
        editing: false,
        moduleOrder: []
      }
      this.$fires.sections.add(obj).then((newRef) => {
        this.document.sectionOrder.push(newRef.id)
        this.$fiery.update(this.document)
      })
    },
    editSection (sectionid, updates) {
      console.log('editing section', sectionid, updates, this.sections)
      for (var update in updates) {
        this.sections[sectionid][update] = updates[update]
      }
      this.$fiery.update(this.sections[sectionid])
    },
    removeSection (sectionid) {
      // * NOTE: This does not remove all subcollections for some reason...modules still exist, even though structure is gone
      console.log('remove section', sectionid)
      // this.$fiery.remove(this.getSectionById(sectionid))
      this.document.sectionOrder.splice(this.document.sectionOrder.indexOf(sectionid), 1)
      this.$fiery.update(this.document)
      this.$fiery.remove(this.sections[sectionid])
    },
    getWordCount (string) {
      if (string !== undefined) {
        return string.split(' ').length
      } else {
        return 0
      }
    },
    getEstTime (wordcount) {
      return Math.ceil(wordcount / 120)
    },
    onSectionDrag (val) {
      console.log('section drag', val)
      this.drag = false
      if (val.moved) {
        console.log('moved')
        this.$fiery.update(this.document, ['sectionOrder']).then(() => {
          console.log('saved')
        })
      }
    },
    onChangeMod (val, sectionid) {
      console.log('module changed', val)
      if (sectionid === 'hook') {
        this.$fiery.update(this.structure.hook, ['moduleOrder']).then(() => {
          console.log('saved')
        })
      } else {
        this.$fiery.update(this.sections[sectionid], ['moduleOrder']).then(() => {
          console.log('saved')
        })
      }
    }
  }
}
</script>

<style>

.module-card {
  margin-bottom: 20px;
}

.section-card {
  margin-bottom: 10px;
}

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
