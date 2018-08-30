<template>
  <div class="row gutter-sm">
    <!-- This is where lesson lessons will be populated -->
    <div class="col-12">
      <draggable :list="lessons" @start="drag=true" @end="onDrag" ref="draggable" :options="{ disabled: editingId !== '' }">
          <mod-lesson v-for="lesson in lessons" :key="lesson['.key']" :id="lesson['.key']" :data="lesson" :edit="lessonEdit" :save="lessonSave" :close="lessonClose" :remove="lessonDelete" class="lesson-card" />
      </draggable>
    </div>
    <!-- This button should always be just below the last user-made module -->
    <add-lesson :next-lesson-order="nextLessonOrder" :edit="lessonEdit" :close="lessonClose" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddLesson from 'components/AddLesson.vue'
import ModLesson from 'components/modules/Lesson.vue'

export default {
  components: {
    Draggable,
    AddLesson,
    ModLesson
  },
  props: ['id'],
  // name: 'ComponentName',
  firebase () {
    return {
      lessons: {
        source: this.$firebase.lessonsRef(this.id).orderByChild('order'),
        readyCallback: function (val) {
          console.log('callback called')
          var check = this.lessons.find((element) => {
            return element.editing === this.$firebase.auth.currentUser.uid
          })
          if (check) {
            this.closeEdit(check['.key'])
          }
        }
      }
    }
  },
  mounted () {
    // this.init()
  },
  beforeDestroy () {
    if (this.editingId !== '') {
      this.closeEdit(this.editingId)
    }
  },
  data () {
    return {
      editingId: '',
      save: false,
      drag: false,
      lessons: []
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
  computed: {
    nextLessonOrder: function () {
      return this.lessons.length
    }
  },
  methods: {
    init () {
    },
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      this.$firebase.lessonsRef(this.id).child(id).update({
        editing: this.$firebase.auth.currentUser.uid
      })
    },
    closeEdit (id) { // closes editing on a module and **saves** any edits
      console.log('close', id)
      if (id) {
        if (this.save) {
          var updatedLesson = {...this.getLessonById(id)}
          updatedLesson.editing = false
          delete updatedLesson['.key']
          console.log('updated', updatedLesson)
          // Save changes
          this.$firebase.lessonsRef(this.id).child(id).set(updatedLesson)
          this.save = false
        } else {
          // Close without saving changes
          this.$firebase.lessonsRef(this.id).child(id).update({ editing: false })
        }
      } else {
      }
    },
    lessonEdit (id) {
      this.editingId = id
    },
    lessonSave (id) {
      console.log('save')
      this.save = true
      this.editingId = ''
    },
    lessonClose () {
      this.editingId = ''
    },
    lessonDelete (id) {
      this.$firebase.lessonsRef(this.id).child(id).remove()
      this.$firebase.devosRef(this.id, id).once('value').then((snap) => {
        // NOTE: This will delete all subsequent devos -- any progress will be lost
        snap.forEach((devoSnap) => {
          this.$firebase.devoContentRef(this.id, id, devoSnap.key).remove()
        })
        this.$firebase.devosRef(this.id, id).remove()
        this.reorder()
      })
    },
    getLessonById (id) {
      return this.lessons.find((element) => {
        return element['.key'] === id
      })
    },
    getLessonByOrder (order) {
      return this.lessons.find((element) => {
        return element.order === order
      })
    },
    reorder () {
      var allLessons = {}
      // Needs to update the 'order' prop of all lessons
      this.lessons.forEach((lesson, index) => {
        var updatedLesson = {...lesson}
        updatedLesson.order = index
        delete updatedLesson['.key']
        allLessons[lesson['.key']] = updatedLesson
      })
      console.log(allLessons)
      this.$firebase.lessonsRef(this.id).update(allLessons)
    },
    onDrag (val) {
      this.drag = false
      console.log('dragged', val)
      this.reorder()
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
