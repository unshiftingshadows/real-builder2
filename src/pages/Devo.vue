<template>
  <q-page padding>
    <div class="row gutter-md">
      <div class="col-xs-12">
      </div>
      <div class="col-12" v-if="passageList.length > 0">
        <h4 style="margin-top: 0;">Passages</h4>
        <p v-for="(passage, index) in passageList" :key="passage"><b>{{ passage }}</b><br/>{{ $bible.readable(devo.bibleRefs[index]) }}</p>
      </div>
      <div class="col-12">
        <!-- <module-list type="rdevo" :id="id" /> -->
        <content-editor :key="id" :id="id" type="devo" />
      </div>
    </div>
    <q-modal v-model="editTitle" ref="editTitleModal" content-classes="edit-title-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="editTitle = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Edit Title</h4>
        </div>
        <div class="col-12">
          <q-input v-model="devo.title" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="update">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="editMainIdea" ref="editMainIdeaModal" content-classes="edit-title-modal">
      <div class="row gutter-md">
        <div class="col-12">
          <q-btn
            color="primary"
            @click.native="editMainIdea = false"
            icon="fas fa-times"
            class="float-right"
            size="sm"
          />
          <h4>Edit Main Idea</h4>
        </div>
        <div class="col-12">
          <q-input v-model="devo.mainIdea" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="update">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-page-sticky position="top">
      <q-toolbar color="secondary" style="z-index: 10;">
        <q-toolbar-title>
          <span class="q-headline-text text-weight-light">Day {{ id }}:</span> {{ devo.title }}
        </q-toolbar-title>
        <q-btn icon="fas fa-ellipsis-v" color="primary" class="float-right">
          <q-popover anchor="bottom right" self="top right">
            <q-list link>
              <q-item v-close-overlay @click.native="editTitle = true">Rename...</q-item>
              <q-item v-close-overlay @click.native="editMainIdea = true">Main Idea</q-item>
              <!-- <q-item-separator /> -->
              <!-- <q-item v-close-overlay>Archive</q-item> -->
              <!-- <q-item v-close-overlay>Share...</q-item> -->
              <!-- <q-item v-close-overlay>Print...</q-item> -->
              <!-- <q-item v-close-overlay>Present...</q-item> -->
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
      <div class="main-idea-tab float-right main-idea-show">
        {{ devo.mainIdea }}
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import ContentEditor from 'components/ContentEditor.vue'
import RenderModules from 'components/preview/RenderModules.vue'

export default {
  components: {
    ContentEditor,
    RenderModules
  },
  name: 'DevoPage',
  fiery: true,
  data () {
    return {
      seriesid: this.$route.params.seriesid,
      lessonid: this.$route.params.lessonid,
      id: this.$route.params.devoid,
      devo: this.$fiery(this.$firebase.devosRef(this.$route.params.seriesid, this.$route.params.lessonid).doc(this.$route.params.devoid), {
        onSuccess: async (val) => {
          if (!this.devo.usedResources) {
            this.devo.usedResources = []
            this.$fiery.update(this.devo)
          }
          this.passageList = await this.$bible.texts(this.devo.bibleRefs, 'esv')
        }
      }),
      editTitle: false,
      editMainIdea: false,
      passageList: []
    }
  },
  methods: {
    update () {
      this.editTitle = false
      this.editMainIdea = false
      var obj = {
        title: this.devo.title,
        mainIdea: this.devo.mainIdea
      }
      this.$firebase.devosRef(this.$route.params.seriesid, this.$route.params.lessonid).doc(this.$route.params.devoid).update(obj).then(() => {
        Notify.create({
          type: 'positive',
          message: 'Devo updated!',
          position: 'bottom-left'
        })
      })
    }
  }
}
</script>

<style>

.q-page-sticky span {
  width: 100%;
}

.main-idea-tab {
  z-index: 5;
  width: 100%;
  padding: 20px;
  margin-top: -200px;
  opacity: 0;
  transition: margin-top 2s, opacity 2s;
  -webkit-transition: margin-top 2s, opacity 2s;
}

.main-idea-show {
  margin-top: 0px;
  opacity: 1;
}

@media screen and (min-width: 800px) {
  .main-idea-tab {
    width: 50%;
  }
}

@media screen and (min-width: 1200px) {
  .main-idea-tab {
    width: 30%;
  }
}

.edit-title-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .edit-title-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
