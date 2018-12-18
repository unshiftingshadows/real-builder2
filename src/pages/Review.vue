<template>
  <q-page padding>
    <div class="row gutter-md">
      <div class="col-xs-12" style="height: 130px;">
      </div>
      <div class="col-12">
        <content-editor :key="id" :id="id" type="review" />
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
          <q-input v-model="lesson.title" />
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
          <q-input v-model="lesson.mainIdea" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="update">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-page-sticky position="top">
      <q-toolbar color="secondary" style="z-index: 10;">
        <q-toolbar-title>
          {{ lesson.title }} <span class="q-headline-text text-weight-light">| Review</span>
        </q-toolbar-title>
        <q-btn icon="fas fa-ellipsis-v" color="primary" class="float-right">
          <q-popover anchor="bottom right" self="top right">
            <q-list link>
              <q-item v-close-overlay @click.native="editTitle = true">Rename...</q-item>
              <q-item v-close-overlay @click.native="editMainIdea = true">Main Idea</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'lesson', params: { seriesid: $route.params.seriesid, lessonid: id } })">Devos</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'research', params: { seriesid: $route.params.seriesid, lessonid: id } })">Research</q-item>
              <q-item link v-close-overlay @click.native="$router.push({ name: 'guide', params: { seriesid: $route.params.seriesid, lessonid: id } })">Guides</q-item>
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
        {{ lesson.mainIdea }}
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import ContentEditor from 'components/ContentEditor.vue'

export default {
  components: {
    ContentEditor
  },
  name: 'LessonReview',
  fiery: true,
  data () {
    return {
      seriesid: this.$route.params.seriesid,
      id: this.$route.params.lessonid,
      lesson: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid)),
      editTitle: false,
      editMainIdea: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.$database.view('series', this.id, (res) => {
      //   this.series = res
      // })
    },
    update () {
      this.editTitle = false
      this.editMainIdea = false
      // var obj = {
      //   title: this.lesson.title,
      //   mainIdea: this.lesson.mainIdea
      // }
      this.$fiery.update(this.lesson, ['title', 'mainIdea']).then(() => {
        Notify.create({
          type: 'positive',
          message: 'Lesson updated!',
          position: 'bottom-left'
        })
      })
      // this.$firebase.ref('lesson', this.$route.params.lessonid, this.$route.params.seriesid).update(obj).then(() => {
      //   Notify.create({
      //     type: 'positive',
      //     message: 'Lesson updated!',
      //     position: 'bottom-left'
      //   })
      // })
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
