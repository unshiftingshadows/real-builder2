<template>
  <div class="row gutter-sm">
    <div v-if="loading">
      <q-spinner color="primary" class="absolute-center" size="3rem" />
    </div>
    <div v-if="!loading" class="col-12">
      <draggable :list="lesson.devoOrder" @end="onDrag" ref="draggable" :options="{ ghostClass: 'sortable-ghost', handle: '.drag-handle', disabled: editingId !== '' }">
        <mod-devo v-for="(devoid, devoIndex) in lesson.devoOrder" :key="devoid" :id="devoid" :num="devoIndex" :data="devos[devoid]" :edit="devoEdit" :save="devoSave" :close="devoClose" class="devo-card" />
      </draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import ModDevo from 'components/modules/Devo.vue'

export default {
  components: {
    Draggable,
    ModDevo
  },
  props: ['id', 'seriesid', 'lesson'],
  name: 'DevoList',
  fiery: true,
  data () {
    return {
      loading: true,
      initRun: true,
      devos: {},
      editingId: ''
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
    },
    'lesson.devoOrder': function (newVal, oldVal) {
      console.log('order changed!', newVal, oldVal)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log('devolist mounted')
      this.devos = this.$fiery(this.$firebase.devosRef(this.seriesid, this.id), {
        map: true,
        onSuccess: (val) => {
          this.loading = false
          console.log('callback called')
          if (this.initRun) {
            var check = Object.keys(this.devos).find((element) => {
              return this.devos[element].editing === this.$firebase.auth.currentUser.uid
            })
            if (check) {
              this.closeEdit(check['.key'])
            }
            this.initRun = false
          }
        }
      })
    },
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      this.$firebase.devosRef(this.seriesid, this.id).doc(id).update({
        editing: this.$firebase.auth.currentUser.uid
      })
    },
    closeEdit (id) { // closes editing on a module and **saves** any edits
      console.log('close', id)
      if (id) {
        if (this.save) {
          var updatedDevo = {...this.devos[id]}
          updatedDevo.editing = false
          delete updatedDevo['.key']
          console.log('updated', updatedDevo)
          // Save changes
          this.$firebase.devosRef(this.seriesid, this.id).doc(id).set(updatedDevo)
          this.save = false
        } else {
          // Close without saving changes
          this.$firebase.devosRef(this.seriesid, this.id).doc(id).update({ editing: false })
        }
      } else {
      }
    },
    devoEdit (id) {
      this.editingId = id
    },
    devoSave (id) {
      console.log('save')
      this.save = true
      this.editingId = ''
    },
    devoClose () {
      this.editingId = ''
    },
    onDrag (val) {
      // this.drag = false
      console.log('dragged', val)
      // this.reorder()
      this.$fiery.update(this.lesson, ['devoOrder'])
      // return false
    }
  }
}
</script>

<style>

.devo-card {
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
