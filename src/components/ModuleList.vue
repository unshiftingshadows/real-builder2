<template>
  <div class="row gutter-sm">
    <div class="col-12" v-if="structure && structure.hook && structure.hook.show">
      <!-- Hook module -->
      <q-card v-bind:class="{ 'active-card': structure.hook.editing === $firebase.auth.currentUser.uid}">
        <div v-if="!structure.hook.editing || structure.hook.editing !== $firebase.auth.currentUser.uid">
          <q-card-title>
            <q-icon v-if="!structure.hook.editing" class="float-right cursor-sectioner" name="fas fa-edit" color="primary" size="1rem" @click.native="editingId = 'hook'" />
            <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ structure.hook.time }} minutes&nbsp;&nbsp;&nbsp;</span>
            Hook
            <span slot="subtitle" v-if="structure.hook.title !== ''">{{ structure.hook.title }}</span>
          </q-card-title>
          <q-card-main>
            <p><span v-html="structure.hook.text" /></p>
          </q-card-main>
        </div>
        <div v-if="structure.hook.editing === $firebase.auth.currentUser.uid">
          <q-card-title>
            <q-icon link class="float-right cursor-sectioner" name="fas fa-times" color="primary" size="1rem" @click.native="editingId = ''" />
            Hook
          </q-card-title>
          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12">
                <q-input v-model="structure.hook.title" float-label="Subtitle" />
              </div>
              <div class="col-12">
                <editor :text.sync="structure.hook.text" :save="autoSave" />
              </div>
              <div class="col-12">
                <q-btn color="primary" @click.native="moduleSave('hook')">Save</q-btn>
              </div>
            </div>
          </q-card-main>
        </div>
      </q-card>
    </div>
    <!-- This is where other modules will be populated -->
    <div class="col-12">
      <draggable :list="modules" @start="drag=true" @end="onDrag" ref="draggable" :options="{ disabled: editingId !== '' || $q.platform.is.mobile }">
          <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'mod-' + mod.type" :id="mod['.key']" :data="mod" :edit="moduleEdit" :save="moduleSave" :close="moduleClose" :remove="moduleDelete" class="module-card" v-bind:class="{ 'active-card': mod.editing === $firebase.auth.currentUser.uid}" />
      </draggable>
    </div>
    <!-- This button should always be just below the last user-made module -->
    <add-module :next-mod-order="nextModOrder" :next-section-order="nextSectionOrder" :edit="moduleEdit" :close="moduleClose" :content-type="type" />
    <div class="col-12" v-if="structure && structure.application && structure.application.show">
      <!-- Application module -->
      <q-card v-bind:class="{ 'active-card': structure.application.editing === $firebase.auth.currentUser.uid}">
        <div v-if="!structure.application.editing">
          <q-card-title>
            <q-icon class="float-right cursor-sectioner" name="fas fa-edit" color="primary" size="1rem" @click.native="editingId = 'application'" />
            <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ structure.application.time }} minutes&nbsp;&nbsp;&nbsp;</span>
            Application
            <span slot="subtitle" v-if="structure.application.title !== ''">{{ structure.application.title }}</span>
          </q-card-title>
          <q-card-main>
            <p><span v-html="structure.application.text" /></p>
          </q-card-main>
        </div>
        <div v-if="structure.application.editing">
          <q-card-title>
            <q-icon link class="float-right cursor-sectioner" name="fas fa-times" color="primary" size="1rem" @click.native="editingId = ''" />
            Application
          </q-card-title>
          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12">
                <q-input v-model="structure.application.title" float-label="Subtitle" />
              </div>
              <div class="col-12">
                <q-input v-model="structure.application.thought" float-label="Questions to Consider" type="textarea" :max-height="100" :min-rows="1" />
              </div>
              <div class="col-12">
                <q-input v-model="structure.application.today" float-label="Today" type="textarea" :max-height="100" :min-rows="1" />
              </div>
              <div class="col-12">
                <q-input v-model="structure.application.thisweek" float-label="This Week" type="textarea" :max-height="100" :min-rows="1" />
              </div>
              <div class="col-12">
                <q-btn color="primary" @click.native="moduleSave('application')">Save</q-btn>
              </div>
            </div>
          </q-card-main>
        </div>
      </q-card>
    </div>
    <div class="col-12" v-if="structure && structure.prayer && structure.prayer.show">
      <!-- Prayer module -->
      <q-card v-bind:class="{ 'active-card': structure.prayer.editing === $firebase.auth.currentUser.uid}">
        <div v-if="!structure.prayer.editing">
          <q-card-title>
            <q-icon class="float-right cursor-sectioner" name="fas fa-edit" color="primary" size="1rem" @click.native="editingId = 'prayer'" />
            <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ structure.prayer.time }} minutes&nbsp;&nbsp;&nbsp;</span>
            Prayer
            <span slot="subtitle" v-if="structure.prayer.title !== ''">{{ structure.prayer.title }}</span>
          </q-card-title>
          <q-card-main>
            <p><span v-html="structure.prayer.text" /></p>
          </q-card-main>
        </div>
        <div v-if="structure.prayer.editing">
          <q-card-title>
            <q-icon link class="float-right cursor-sectioner" name="fas fa-times" color="primary" size="1rem" @click.native="editingId = ''" />
            Prayer
          </q-card-title>
          <q-card-main>
            <div class="row gutter-sm">
              <div class="col-12">
                <q-input v-model="structure.prayer.title" float-label="Subtitle" />
              </div>
              <div class="col-12">
                <editor :text.sync="structure.prayer.text" :save="autoSave" />
              </div>
              <div class="col-12">
                <q-btn color="primary" @click.native="moduleSave('prayer')">Save</q-btn>
              </div>
            </div>
          </q-card-main>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Editor from 'components/Editor.vue'
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
    Editor,
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
  props: ['type', 'id'],
  // name: 'ComponentName',
  firebase () {
    return {
      structure: {
        source: this.$firebase.ref(this.type, 'structure', this.id, this.$route.params.seriesid, this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          console.log('structure ready')
          this.$emit('modules-init', {
            hook: this.structure.hook.show,
            application: this.structure.application.show,
            prayer: this.structure.prayer.show
          })
        }
      },
      modules: {
        source: this.$firebase.ref(this.type, 'modules', this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          // this.$root.$children[0].user.dim = false
          // var check = this.modules.find((element) => {
          //   return element.editing === this.$firebase.auth.currentUser.uid
          // })
          // if (check) {
          //   this.closeEdit(check['.key'])
          // }
        }
      }
    }
  },
  mounted () {
    // this.init()
  },
  // NOTE: Issue here is that firebase unmounts before the beforeDestroy
  //       method runs...kind of a problem...no immediate fix for saving
  //       open components when a user moves from one page to another
  //
  //       For the time being, a basic function is used to ensure any module
  //       is closed before changing pages...not necessarily saved though
  beforeDestroy () {
    if (this.editingId !== '') {
      this.$root.$children[0].user.dim = false
      if (this.editingId === 'hook' || this.editingId === 'application' || this.editingId === 'prayer') {
        this.$firebase.ref(this.type, 'structure', this.id).child(this.editingId).update({ editing: false })
      } else {
        this.$firebase.ref(this.type, 'modules', this.id).child(this.editingId).update({ editing: false })
      }
    }
  },
  // beforeDestroy () {
  //   if (this.editingId !== '') {
  //     if (this.editingId === 'hook' || this.editingId === 'application' || this.editingId === 'prayer') {
  //       console.log('structure close save', this)
  //       this.structure[this.editingId].editing = false
  //       if (this.editingId === 'hook' || this.editingId === 'prayer') {
  //         this.structure[this.editingId].wordcount = this.getWordCount(this.structure[this.editingId].text)
  //         this.structure[this.editingId].time = this.getEstTime(this.structure[this.editingId].wordcount)
  //       } else {
  //         this.structure.application.wordcount = this.getWordCount(this.structure.application.thought + ' ' + this.structure.application.today + ' ' + this.structure.application.thisweek)
  //         this.structure.application.time = this.getEstTime(this.structure.application.wordcount)
  //       }
  //       // Save changes
  //       this.$firebase.ref(this.type, 'structure', this.this.editingId).child(this.editingId).update(this.structure[this.editingId])
  //     } else {
  //       var updatedMod = {...this.getModuleById(this.editingId)}
  //       updatedMod.editing = false
  //       delete updatedMod['.key']
  //       if (updatedMod.type === 'text' || updatedMod.type === 'bible') {
  //         // If needing to set wordcount and time
  //         updatedMod.wordcount = this.getWordCount(updatedMod.text)
  //         updatedMod.time = this.getEstTime(updatedMod.wordcount)
  //       }
  //       console.log('updated', updatedMod)
  //       // Save changes
  //       this.$firebase.ref(this.type, 'modules', this.this.editingId).child(this.editingId).set(updatedMod)
  //     }
  //     this.$root.$children[0].user.dim = false
  //   }
  // },
  data () {
    return {
      editingId: '',
      save: false,
      drag: false,
      modules: [],
      structure: {
        application: {
          show: false
        },
        hook: {
          show: false
        },
        prayer: {
          show: false
        }
      },
      deleting: false
    }
  },
  watch: {
    editingId: function (newid, oldid) {
      console.log('old', oldid)
      console.log('new', newid)
      if (!oldid) {
        console.log('no oldid...')
      } else if (!this.deleting) {
        this.closeEdit(oldid)
      } else {
        this.deleting = false
      }
      if (newid !== '') {
        console.log(this.$refs)
        this.$root.$children[0].user.dim = true
        this.startEdit(newid)
      } else {
        this.$root.$children[0].user.dim = false
      }
    },
    nextModOrder: function (newOrder, oldOrder) {
      console.log('new modules', newOrder)
      console.log('old modules', oldOrder)
      if (newOrder !== oldOrder && oldOrder !== 0) {
        console.log('different!')
        var index = this.modules.map(function (e) { return e.order }).indexOf('new')
        if (index !== -1) {
          console.log('new module', this.modules[index])
          this.$database.view(this.modules[index].type, this.modules[index].mediaid, (res) => {
            console.log('new module res', res)
            var text = ''
            if (this.modules[index].type === 'quote' || this.modules[index].type === 'idea' || this.modules[index].type === 'illustration') {
              text = res.resource.text
            } else if (this.modules[index].type === 'outline') {
              text = res.resource.sections.join(' ')
            }
            var wordcount = this.getWordCount(text)
            var time = this.getEstTime(wordcount)
            console.log('wordcount', wordcount)
            console.log('time', time)
            this.$firebase.ref(this.type, 'modules', this.id).child(this.modules[index]['.key']).update({
              wordcount: wordcount,
              time: time,
              order: this.nextModOrder
            })
          })
        }
      }
    }
  },
  computed: {
    nextModOrder: function () {
      return this.modules.length
    },
    nextSectionOrder: function () {
      return this.modules.filter((val) => {
        return val.type === 'section'
      }).length + 1
    }
  },
  methods: {
    init () {
    },
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      if (id === 'hook' || id === 'application' || id === 'prayer') {
        // this.structure[id].editing = true
        this.$firebase.ref(this.type, 'structure', this.id).child(id).update({
          editing: this.$firebase.auth.currentUser.uid
        })
      } else {
        // this.modules[id].editing = true
        this.$firebase.ref(this.type, 'modules', this.id).child(id).update({
          editing: this.$firebase.auth.currentUser.uid
        })
      }
    },
    closeEdit (id) { // closes editing on a module and **saves** any edits
      console.log('close', id)
      if (id) {
        if (id === 'hook' || id === 'application' || id === 'prayer') {
          if (this.save) {
            this.structure[id].editing = false
            if (id === 'hook' || id === 'prayer') {
              this.structure[id].wordcount = this.getWordCount(this.structure[id].text)
              this.structure[id].time = this.getEstTime(this.structure[id].wordcount)
            } else {
              this.structure.application.wordcount = this.getWordCount(this.structure.application.thought + ' ' + this.structure.application.today + ' ' + this.structure.application.thisweek)
              this.structure.application.time = this.getEstTime(this.structure.application.wordcount)
            }
            // Save changes
            this.$firebase.ref(this.type, 'structure', this.id).child(id).update(this.structure[id])
            this.save = false
          } else {
            // Close without saving changes
            this.$firebase.ref(this.type, 'structure', this.id).child(id).update({ editing: false })
          }
        } else {
          if (this.save) {
            var updatedMod = {...this.getModuleById(id)}
            updatedMod.editing = false
            delete updatedMod['.key']
            if (updatedMod.type === 'text' || updatedMod.type === 'bible') {
              // If needing to set wordcount and time
              updatedMod.wordcount = this.getWordCount(updatedMod.text)
              updatedMod.time = this.getEstTime(updatedMod.wordcount)
            }
            console.log('updated', updatedMod)
            // Save changes
            this.$firebase.ref(this.type, 'modules', this.id).child(id).set(updatedMod)
            this.save = false
          } else {
            // Close without saving changes
            this.$firebase.ref(this.type, 'modules', this.id).child(id).update({ editing: false })
          }
        }
      } else {
      }
    },
    moduleEdit (id) {
      this.editingId = id
    },
    moduleSave (id) {
      console.log('save')
      this.save = true
      this.editingId = ''
    },
    moduleClose () {
      this.editingId = ''
    },
    moduleDelete (id) {
      this.deleting = true
      this.editingId = ''
      this.$firebase.ref(this.type, 'modules', this.id).child(id).remove()
    },
    getModuleById (id) {
      return this.modules.find((element) => {
        return element['.key'] === id
      })
    },
    getModuleByOrder (order) {
      return this.modules.find((element) => {
        return element.order === order
      })
    },
    getWordCount (string) {
      return string.split(' ').length
    },
    getEstTime (wordcount) {
      return Math.ceil(wordcount / 120)
    },
    reorder () {
      var allMods = {}
      // Needs to update the 'order' prop of all modules
      var sectionCount = 1
      this.modules.forEach((mod, index) => {
        var updatedMod = {...mod}
        updatedMod.order = index
        delete updatedMod['.key']
        if (mod.type === 'section') {
          console.log('sectionCount', sectionCount)
          console.log('section', updatedMod)
          updatedMod.number = sectionCount
          sectionCount = sectionCount + 1
        }
        allMods[mod['.key']] = updatedMod
        // console.log('reorder', updatedMod)
      })
      console.log(allMods)
      this.$firebase.ref(this.type, 'modules', this.id).update(allMods)
    },
    onDrag (val) {
      this.drag = false
      console.log('dragged', val)
      console.log('ran')
      this.reorder()
    },
    // Auto save for structure modules only
    autoSave () {
      console.log('auto save text')
      this.$firebase.ref(this.type, 'structure', this.id).child(this.editingId).update({
        text: this.structure[this.editingId].text
      })
    }
  }
}
</script>

<style>

.module-card {
  margin-bottom: 20px;
}

</style>
