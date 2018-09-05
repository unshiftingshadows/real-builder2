<template>
  <div class="row gutter-sm">
    <!-- This is where lesson lessons will be populated -->
    <div class="col-12">
      <draggable :list="series.lessonOrder" @start="drag=true" @end="onDrag" ref="draggable" :options="{ disabled: editingId !== '' }">
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
      initRun: true,
      editingId: '',
      save: false,
      drag: false,
      lessons: this.$fiery(this.$firebase.lessonsRef(this.id), {
        map: true,
        onSuccess: (val) => {
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
    }
  },
  // firestore () {
  //   return {
  //     lessons: this.$firebase.lessonsRef(this.id).orderBy('order')
  //   }
  // },
  mounted () {
    // this.init()
    // console.log('before bind', this.$firebase.lessonsRef(this.id))
    // this.$binding('lessons', this.$firebase.lessonsRef(this.id).orderBy('order'))
    //   .then((lessons) => {
    //     console.log('callback called')
    //     // var check = this.lessons.find((element) => {
    //     //   return element.editing === this.$firebase.auth.currentUser.uid
    //     // })
    //     // if (check) {
    //     //   this.closeEdit(check['.key'])
    //     // }
    //   })
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
  methods: {
    init () {
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
    lessonSave (id) {
      console.log('save')
      this.save = true
      this.editingId = ''
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
    reorder () {
      // Needs to update the 'order' prop of all lessons
      // this.lessons.forEach((lesson, index) => {
      //   var updatedLesson = {...lesson}
      //   updatedLesson.order = index
      //   delete updatedLesson['.key']
      //   this.$fiery.update(updatedLesson, ['order'])
      // })
      this.$fiery.update(this.series, ['lessonOrder'])
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
