<template>
  <div>
    <div v-if="!seriesLoading">
      <h5>{{ series.title }}</h5>
      <p>{{ series.mainIdea }}</p>
    </div>
    <hr style="border-color: var(--q-color-primary);"/>
    <div v-if="!lessonLoading">
      <h6>{{ lesson.title }}</h6>
      <p>{{ lesson.mainIdea }}</p>
      <q-list no-border separator>
        <q-item v-for="(ref, index) in bibleRefs" :key="ref">
          <q-item-main>
            <q-item-tile label>{{ ref }}</q-item-tile>
            <q-item-tile sublabel>{{ $bible.readable(lesson.bibleRefs[index]) }}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <hr style="border-color: var(--q-color-primary);"/>
      <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" />
    </div>
    <div class="fixed-bottom bg-tertiary drawer-overlay" style="padding: 10px;" v-bind:class="{ 'full-height': showResources }">
      <q-btn class="float-right" color="dark" @click.native="openResources()">{{ showResources ? 'Hide' : 'Show' }}</q-btn>
      <h5 style="margin: 0;">Resources</h5>
      <hr style="border-width: .5px;" />
      <!-- List resources used in the devos -->
      <br/>
      <q-spinner size="2rem" color="secondary" class="on-right" v-if="loadingResources" />
      <div v-if="!loadingResources && resources.length === 0" class="q-subheading">No current resources</div>
      <n-q-list v-if="!loadingResources && resources.length > 0" :items="resources" singlecolumn />
    </div>
  </div>
</template>

<script>
import NQList from 'components/NQList.vue'

export default {
  components: {
    NQList
  },
  name: 'DrawerGuide',
  fiery: true,
  data () {
    return {
      seriesLoading: true,
      lessonLoading: true,
      series: this.$fiery(this.$firebase.ref('series', '', this.$route.params.seriesid), {
        map: true,
        onSuccess: () => {
          this.seriesLoading = false
        }
      }),
      lesson: this.$fiery(this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid), {
        map: true,
        onSuccess: async () => {
          this.bibleRefs = await this.$bible.texts(this.lesson.bibleRefs)
          this.lessonLoading = false
        }
      }),
      showResources: false,
      loadingResources: false,
      resources: [],
      bibleRefs: []
    }
  },
  methods: {
    async openResources () {
      if (!this.showResources) {
        this.loadingResources = true
        this.showResources = true
        if (this.resources.length === 0) {
          this.resources = (await this.$firebase.nqResources(this.lesson.usedResources)).data.resources
        }
        this.loadingResources = false
      } else {
        this.showResources = false
      }
    }
  }
}
</script>

<style>

.drawer-overlay {
  height: 60px;
  -webkit-transition: height 1s, -webkit-transform 1s;
  transition: height 1s, transform 1s;
}

.full-height {
  height: 100%;
}

</style>
