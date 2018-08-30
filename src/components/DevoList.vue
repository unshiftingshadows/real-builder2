<template>
  <div class="row gutter-sm">
    <div class="col-12">
      <mod-devo v-for="devo in devos" :key="devo['.key']" :id="devo['.key']" :data="devo" :edit="devoEdit" :save="devoSave" :close="devoClose" class="devo-card" />
    </div>
  </div>
</template>

<script>
import ModDevo from 'components/modules/Devo.vue'

export default {
  components: {
    ModDevo
  },
  props: ['id', 'seriesid'],
  // name: 'ComponentName',
  firebase () {
    return {
      devos: {
        source: this.$firebase.devosRef(this.seriesid, this.id).orderByChild('order'),
        readyCallback: function (val) {
          console.log('callback called')
          var check = this.devos.find((element) => {
            return element.editing === this.$firebase.auth.currentUser.uid
          })
          if (check) {
            this.closeEdit(check['.key'])
          }
        }
      }
    }
  },
  data () {
    return {
      devos: [],
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
    }
  },
  methods: {
    init () {
    },
    startEdit (id) {
      console.log('edit', id)
      // Turn on editing for id
      this.$firebase.devosRef(this.seriesid, this.id).child(id).update({
        editing: this.$firebase.auth.currentUser.uid
      })
    },
    closeEdit (id) { // closes editing on a module and **saves** any edits
      console.log('close', id)
      if (id) {
        if (this.save) {
          var updatedDevo = {...this.getDevoById(id)}
          updatedDevo.editing = false
          delete updatedDevo['.key']
          console.log('updated', updatedDevo)
          // Save changes
          this.$firebase.devosRef(this.seriesid, this.id).child(id).set(updatedDevo)
          this.save = false
        } else {
          // Close without saving changes
          this.$firebase.devosRef(this.seriesid, this.id).child(id).update({ editing: false })
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
    getDevoById (id) {
      return this.devos.find((element) => {
        return element['.key'] === id
      })
    }
  }
}
</script>

<style>

.devo-card {
  margin-bottom: 20px;
}

</style>
