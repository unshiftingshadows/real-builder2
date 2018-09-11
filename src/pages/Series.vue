<template>
  <q-page padding>
    <div class="row gutter-md">
      <div class="col-12">
      </div>
      <div class="col-12">
        <q-input v-model="series.mainIdea" float-label="Main Idea" type="textarea" :max-height="150" :min-rows="3" @blur="update()" />
      </div>
      <div class="col-12">
        <lesson-list :id="id" :series="series" />
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
          <q-input v-model="series.title" />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click.native="update">Save</q-btn>
        </div>
      </div>
    </q-modal>
    <q-page-sticky position="top">
      <q-toolbar color="secondary" style="z-index: 10;">
        <q-toolbar-title>
          {{ series.title }}
        </q-toolbar-title>
        <q-select
          v-model="series.status"
          float-label="Status"
          :options="statusOptions"
        />
        <q-btn icon="fas fa-ellipsis-v" color="primary" class="float-right">
          <q-popover anchor="bottom right" self="top right">
            <q-list link>
              <q-item v-close-overlay @click.native="editTitle = true">Rename...</q-item>
              <!-- <q-item-separator /> -->
              <!-- <q-item v-close-overlay>Archive</q-item> -->
              <!-- <q-item v-close-overlay>Share...</q-item> -->
              <!-- <q-item v-close-overlay>Print...</q-item> -->
              <!-- <q-item v-close-overlay>Present...</q-item> -->
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
      <div class="main-idea-tab float-right" v-bind:class="{ 'main-idea-show': showMainIdea }">
        {{ series.mainIdea }}
      </div>
    </q-page-sticky>
    <q-scroll-observable @scroll="userHasScrolled" />
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import LessonList from 'components/LessonList.vue'

export default {
  components: {
    LessonList
  },
  name: 'PageSeries',
  fiery: true,
  data () {
    return {
      statusOptions: [
        {
          value: 'build',
          label: 'Build'
        },
        {
          value: 'write',
          label: 'Write'
        },
        {
          value: 'edit',
          label: 'Edit'
        },
        {
          value: 'approve',
          label: 'Approve'
        }
      ],
      id: this.$route.params.seriesid,
      series: this.$fiery(this.$firebase.ref('series', '', this.$route.params.seriesid)),
      editTitle: false,
      showMainIdea: false
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
      var obj = {
        title: this.series.title,
        mainIdea: this.series.mainIdea,
        status: this.series.status || 'build'
      }
      this.$firebase.ref('series', '', this.id).update(obj).then(() => {
        Notify.create({
          type: 'positive',
          message: 'Series updated!',
          position: 'bottom-left'
        })
      })
    },
    userHasScrolled (scroll) {
      if (scroll.position < 30) {
        this.showMainIdea = false
      } else {
        this.showMainIdea = true
      }
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
