<template>
  <div class="row gutter-sm">
    <div v-if="loading">
      <q-spinner color="primary" class="absolute-center" size="3rem" />
    </div>
    <!-- This is where lesson lessons will be populated -->
    <div v-if="!loading" class="col-12">
      <draggable :list="series.lessonOrder" @end="onDrag" ref="draggable" :options="{ ghostClass: 'sortable-ghost', handle: '.drag-handle', disabled: editingId !== '' }">
          <mod-lesson v-for="(lessonid, lessonIndex) in series.lessonOrder" :key="lessonid" :id="lessonid" :num="lessonIndex" :data="lessons[lessonid]" :edit="lessonEdit" :save="lessonSave" :close="lessonClose" :remove="lessonDelete" class="lesson-card" />
      </draggable>
    </div>
    <!-- This button should always be just below the last user-made module -->
    <add-lesson ref="addLesson" :add="lessonAdd" :edit="lessonEdit" :close="lessonClose" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddLesson from 'components/AddLesson.vue'
import ModLesson from 'components/modules/Lesson.vue'

/**
 * A modal component for listing Lesson modules
 * 
 * ```html
 * <lesson-list :id="value" :series="value" />
 * ```
 * 
 * @author jacob beck
 */
export default {
  components: {
    Draggable,
    AddLesson,
    ModLesson
  },
  props: {
    /**
     * series id
     */
    id: { type: String },
    /**
     * series object
     */
    series: { type: Object }
  },
  name: 'LessonList',
  fiery: true,
  data () {
    return {
      /**
       * value to hide render until after loading lessons
       * @type {boolean}
       */
      loading: true,
      /**
       * value to check if this is the initial run to get firestore data
       * @type {boolean}
       */
      initRun: true,
      /**
       * id of the current lesson being edited
       * @type {string}
       */
      editingId: '',
      /**
       * value to check whether the changes should be saved or discarded
       * @type {boolean}
       */
      save: false,
      /**
       * list of lesson objects with data from firestore
       * - fiery ref object
       * @type {object}
       */
      lessons: {}
    }
  },
  beforeDestroy () {
    if (this.editingId !== '') {
      this.closeEdit(this.editingId)
    }
  },
  watch: {
    editingId: function (newid, oldid) {
      console.log('old', oldid)
      console.log('new', newid)
      if (!oldid) {
        console.log('no oldid...')
      } else {
        this.closeEdit(oldid)
      }
      if (newid !== '') {
        console.log(this.$refs)
        this.startEdit(newid)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    /**
     * Initalize the component
     * Attaches a fiery object to lessons for listening to data changes
     * @return {void} void
     */
    init () {
      this.lessons = this.$fiery(this.$firebase.lessonsRef(this.id), {
        map: true,
        onSuccess: (val) => {
          this.loading = false
          console.log('callback called')
          if (this.initRun) {
            var check = Object.keys(this.lessons).find((element) => {
              return this.lessons[element].editing === this.$firebase.auth.currentUser.uid
            })
            if (check) {
              this.closeEdit(check)
            }
            this.initRun = false
          }
        }
      })
    },
    /**
     * Opens a lesson for editing
     * @param {string} id id of the lesson module to edit
     * @return {void} void
     */
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      this.lessons[id].editing = this.$firebase.auth.currentUser.uid
      this.$fiery.update(this.lessons[id], ['editing'])
    },
    /**
     * Closes a lesson from editing
     * @param {string} id id of the lesson to be closed
     * @return {void} void
     */
    closeEdit (id) { // closes editing on a module and **saves** any edits
      console.log('close', id)
      if (id) {
        if (this.save) {
          var updatedLesson = {...this.lessons[id]}
          updatedLesson.editing = false
          delete updatedLesson['.key']
          console.log('updated', updatedLesson)
          // Save changes
          this.$firebase.lessonsRef(this.id).doc(id).set(updatedLesson)
          this.save = false
        } else {
          // Close without saving changes
          this.$firebase.lessonsRef(this.id).doc(id).update({ editing: false })
        }
      } else {
      }
    },
    /**
     * Sets the editingId for a lesson to edit
     * @param {string} id id of the lesson to edit
     * @return {void} void
     */
    lessonEdit (id) {
      this.editingId = id
    },
    /**
     * Saves a lesson
     * - opens the next lesson if nextLesson is not invalid
     * @param {string} id id of the lesson to save and close
     * @param {int} nextLesson index of the next lesson in the series lessonOrder
     * @return {void} void
     */
    lessonSave (id, nextLesson) {
      console.log('save')
      this.save = true
      this.editingId = ''
      if (nextLesson && nextLesson < this.series.lessonOrder.length) {
        this.lessonEdit(this.series.lessonOrder[nextLesson])
      } else if (nextLesson && nextLesson === this.series.lessonOrder.length) {
        // TODO: Add a new lesson -- need a cloud function for this
        this.$refs.addLesson.addModule()
      }
    },
    /**
     * Sets the editingId to blank
     * @return {void} void
     */
    lessonClose () {
      this.editingId = ''
    },
    /**
     * Add a new lesson id to the series lessonOrder
     * @param {string} id id of newly created lesson
     * @return {void} void
     */
    lessonAdd (id) {
      this.series.lessonOrder.push(id)
      this.$fiery.update(this.series, ['lessonOrder'])
    },
    /**
     * Deletes a lesson
     * @param {string} id id of lesson to be deleted
     * @return {void} void
     */
    lessonDelete (id) {
      this.series.lessonOrder.splice(this.series.lessonOrder.indexOf(id), 1)
      this.$fiery.update(this.series, ['lessonOrder'])
      this.$fiery.remove(this.lessons[id])
    },
    /**
     * Returns a lesson object after passing an index
     * @param {int} order index of lesson to return
     * @return {object} lesson object
     */
    getLessonByOrder (order) {
      return this.lessons.find((element) => {
        return element.order === order
      })
    },
    /**
     * Updates order after a drag/drop
     * @return {void} void
     */
    onDrag (val) {
      this.$fiery.update(this.series, ['lessonOrder'])
    }
  }
}
</script>

<style>

.lesson-card {
  margin-bottom: 20px;
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
