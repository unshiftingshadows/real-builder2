<template>
  <q-card color="primary">
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid">
      <q-card-title>
        <q-icon v-show="!data.editing" class="float-right cursor-pointer" name="fas fa-ellipsis-v" size="1rem">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="edit(id)">Edit</q-item>
              <q-item link @click.native="remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-icon>
        <span style="font-style: bold; font-size: 2rem; vertical-align: middle;">{{ data.number }}.&nbsp;&nbsp;</span>
        {{ data.title }}
      </q-card-title>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <q-icon link class="float-right cursor-pointer" name="fas fa-times" size="1rem" @click.native="close" />
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="data.title" float-label="Title" @keyup.enter="save(id)" class="dark-label" autofocus />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click.native="save(id, data)">Save</q-btn>
            <q-btn outline color="negative" @click.native="remove(id)">Delete</q-btn>
          </div>
        </div>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-section',
  props: [ 'id', 'data', 'edit', 'save', 'close', 'remove' ],
  data () {
    return {}
  }
}
</script>

<style>

.dark-label .q-if-label {
  color: white !important;
}

</style>
