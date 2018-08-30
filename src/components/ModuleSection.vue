<template>
  <q-card flat>
    <q-card-title>
      <q-btn color="dark" icon="fas fa-ellipsis-v" class='float-right' v-if="id !== 'hook'">
        <q-popover anchor="bottom right" self="top right">
          <q-list>
            <q-item link v-close-overlay @click.native="editTitle = true">Edit</q-item>
            <q-item link @click.native="remove(id)">Delete</q-item>
          </q-list>
        </q-popover>
      </q-btn>
      <h5 style="margin: 0;">
        <q-icon v-if="!open" name="fas fa-caret-right cursor-pointer" style="margin-top: -5px; padding-left: 4px; padding-right: 4px;" size="2rem" @click.native="open = true" />
        <q-icon v-if="open" name="fas fa-caret-down cursor-pointer" style="margin-top: -5px;" size="2rem" @click.native="open = false" />
        &nbsp;
        {{ id === 'hook' ? 'Hook' : data.title }}
      </h5>
    </q-card-title>
    <div class="row gutter-sm" style="padding-left: 10px; padding-right: 10px;" v-if="open">
      <div class="col-12">
        <draggable style="min-height: 20px;" :list="modules" @start="drag=true" @change="onChange" @add="onAdd" @remove="onRemove" ref="secModuleDrag" :options="{ group: { name: 'modules', pull: 'clone' }, ghostClass: 'sortable-ghost', handle: '.drag-handle', disabled: disabled || ($q.platform.is.mobile && !$q.platform.is.ipad) }">
          <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'mod-' + mod.type" :id="mod['.key']" :data="mod" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': mod.editing === $firebase.auth.currentUser.uid }" />
        </draggable>
      </div>
      <div class="col-12" style="padding-top: 0;">
        <add-module :next-mod-order="nextModOrder" :sectionid="id" :edit="editModule" :close="closeModule" :content-type="contentType" dark />
      </div>
    </div>
    <q-modal v-model="editTitle" ref="editSectionTitle" content-classes="edit-section-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="editTitle = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Edit Title</h4>
        </div>
        <div class="col-12">
          <q-input v-model="newTitle" float-label="Title" type="text" @keyup.enter="edit(id, { title: newTitle }); editTitle=false" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="edit(id, { title: newTitle }); editTitle=false">Save</q-btn>
        </div>
      </div>
    </q-modal>
  </q-card>
</template>

<script>
import Draggable from 'vuedraggable'
import AddModule from 'components/AddModule.vue'
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

export default {
  components: {
    Draggable,
    AddModule,
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
    ModIllustration
  },
  // name: 'ComponentName',
  props: ['id', 'data', 'edit', 'remove', 'disabled', 'contentType', 'contentid'],
  data () {
    return {
      drag: false,
      editTitle: false,
      newTitle: '',
      open: true
    }
  },
  firebase () {
    return {
      'modules': {
        source: this.$firebase.sectionModules(this.contentType, this.contentid, this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('section modules loaded')
          this.modules.forEach((mod) => {
            if (mod.editing === this.$firebase.auth.currentUser.uid) {
              console.log('closed previously open module', mod['.key'])
              this.closeModule(mod['.key'])
            }
          })
        }
      }
    }
  },
  computed: {
    nextModOrder: function () {
      if (this.modules) {
        return this.modules.length
      } else {
        return 0
      }
    }
  },
  watch: {
    'data.title': function (newVal) {
      this.newTitle = newVal
    }
  },
  mounted () {
    this.newTitle = this.data.title
  },
  methods: {
    editModule (moduleid) {
      this.$emit('edit', moduleid, this.id)
    },
    saveModule (moduleid, data) {
      this.$emit('save', moduleid, this.id, data)
    },
    autoSaveModule (moduleid, text) {
      this.$emit('autosave', moduleid, this.id, text)
    },
    closeModule (moduleid) {
      this.$emit('close', moduleid, this.id)
    },
    removeModule (moduleid) {
      this.$emit('remove', moduleid, this.id)
    },
    onAdd (val) {
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
    onRemove (val) {
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
    onChange (val) {
      if (val.moved) {
        var updatedMods = {}
        this.modules.forEach((item, index) => {
          updatedMods[item['.key']] = {...item}
          updatedMods[item['.key']].order = index
          delete updatedMods[item['.key']]['.key']
        })
        this.$firebaseRefs.modules.set(updatedMods)
      }
    },
    reorder () {
      console.log('module list', this.modules)
    }
  }
}
</script>

<style>

.edit-section-modal {
  padding: 20px;
}

.q-card-title {
  height: 36px;
}

.sortable-ghost {
  opacity: 0.5;
}

.section-card {
  background-color: inherit;
  border: 2px dashed var(--q-color-primary);
}

</style>
