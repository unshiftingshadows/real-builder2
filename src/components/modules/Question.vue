<template>
  <q-card>
    <div v-show="!data.editing || data.editing !== $firebase.auth.currentUser.uid">
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-arrows-alt" size="1rem" />
      </div>
      <q-card-title>
        <q-btn v-show="!data.editing" class="float-right cursor-pointer" icon="fas fa-ellipsis-v" color="primary" size="sm">
          <q-popover anchor="bottom right" self="top right">
            <q-list>
              <q-item link v-close-overlay @click.native="edit(id)">Edit</q-item>
              <q-item link @click.native="remove(id)">Delete</q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <span class="float-right" style="font-size: .8rem; vertical-align: top; line-height: 1rem;">{{ data.time }} minutes&nbsp;&nbsp;&nbsp;</span>
        <q-icon name="fas fa-question" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
        {{ data.text }}
      </q-card-title>
      <q-card-main>
        {{ data.notes }}
      </q-card-main>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-btn link class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="close" />
            <q-input v-model="data.text" float-label="Question" type="text" autofocus />
          </div>
          <div class="col-12">
            <q-input v-model="data.notes" float-label="Notes" type="textarea" :max-height="100" :min-rows="1" />
          </div>
          <div class="col-12">
            <q-input type="number" v-model="data.time" float-label="Estimated Time (in minutes)" />
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
  name: 'mod-text',
  props: [ 'id', 'data', 'edit', 'save', 'close', 'remove' ],
  data () {
    return {}
  }
}
</script>

<style>
</style>
