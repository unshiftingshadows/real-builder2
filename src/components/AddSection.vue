<template>
  <div class="col-12 relative-position" style="height: 70px; margin-top: 20px;">
    <q-btn color="primary" class="absolute-center" @click.native="showAddSection = true">Add Section</q-btn>
    <q-modal v-model="showAddSection" ref="addNewSection" content-classes="add-section-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="showAddSection = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Add Section</h4>
        </div>
        <div class="col-12">
          <q-input v-model="newTitle" float-label="Title" type="text" @keyup.enter="add" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="add">Save</q-btn>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: ['addSection', 'close'],
  data () {
    return {
      newTitle: '',
      showAddSection: false
    }
  },
  methods: {
    add () {
      this.showAddSection = false
      this.addSection(this.newTitle)
    }
  }
}
</script>

<style>

.add-section-modal {
  padding: 20px;
}

</style>
