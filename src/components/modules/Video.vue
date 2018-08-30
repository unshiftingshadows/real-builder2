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
        <q-icon name="fas fa-video" color="primary" size="2rem" />&nbsp;&nbsp;&nbsp;
      </q-card-title>
      <q-card-media>
        <q-video :src="media.embedURL" />
      </q-card-media>
    </div>
    <div v-if="data.editing === $firebase.auth.currentUser.uid">
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-btn link class="float-right cursor-pointer" icon="fas fa-times" size="sm" @click.native="close" />
            <p>To edit videos...use the media links on the left to edit the original video directly</p>
          </div>
          <div class="col-12">
            <!-- <q-btn color="primary" @click.native="preSave">Save</q-btn> -->
            <q-btn outline color="negative" @click.native="remove(id)">Delete</q-btn>
          </div>
        </div>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'mod-video',
  props: [ 'id', 'data', 'edit', 'save', 'remove', 'close' ],
  data () {
    return {
      media: {
        embedURL: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$database.view(this.data.type, this.data.mediaid, (res) => {
        this.media = res.resource
      })
    },
    preSave () {
      this.save(this.id)
    }
  }
}
</script>

<style>

.q-video {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 25px;
  height: 0;
  width: 100%;
}
.q-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
