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
    <add-lesson :add="lessonAdd" :edit="lessonEdit" :close="lessonClose" />
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
  props: ['id', 'series'],
  name: 'LessonList',
  fiery: true,
  data () {
    return {
      loading: true,
      initRun: true,
      editingId: '',
      save: false,
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
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      this.lessons[id].editing = this.$firebase.auth.currentUser.uid
      this.$fiery.update(this.lessons[id], ['editing'])
    },
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
    lessonEdit (id) {
      this.editingId = id
    },
    lessonSave (id, nextLesson) {
      console.log('save')
      this.save = true
      this.editingId = ''
      if (nextLesson && nextLesson < this.series.lessonOrder.length) {
        this.lessonEdit(this.series.lessonOrder[nextLesson])
      } else if (nextLesson && nextLesson === this.series.lessonOrder.length) {
        // TODO: Add a new lesson -- need a cloud function for this
      }
    },
    lessonClose () {
      this.editingId = ''
    },
    lessonAdd (id) {
      this.series.lessonOrder.push(id)
      this.$fiery.update(this.series, ['lessonOrder'])
    },
    lessonDelete (id) {
      this.series.lessonOrder.splice(this.series.lessonOrder.indexOf(id), 1)
      this.$fiery.update(this.series, ['lessonOrder'])
      this.$fiery.remove(this.lessons[id])
      // this.$firebase.lessonsRef(this.id).doc(id).delete()
      // this.$firebase.devosRef(this.id, id).get().then((snap) => {
      //   // NOTE: This will delete all subsequent devos -- any progress will be lost
      //   snap.forEach((devoSnap) => {
      //     this.$firebase.devoContentRef(this.id, id, devoSnap.key).delete()
      //   })
      //   this.$firebase.devosRef(this.id, id).delete()
      //   this.reorder()
      // })
    },
    getLessonByOrder (order) {
      return this.lessons.find((element) => {
        return element.order === order
      })
    },
    // reorder () {
    //   // Needs to update the 'order' prop of all lessons
    //   // this.lessons.forEach((lesson, index) => {
    //   //   var updatedLesson = {...lesson}
    //   //   updatedLesson.order = index
    //   //   delete updatedLesson['.key']
    //   //   this.$fiery.update(updatedLesson, ['order'])
    //   // })
    // },
    onDrag (val) {
      // this.drag = false
      console.log('dragged', val)
      // this.reorder()
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
