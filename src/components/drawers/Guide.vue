<template>
  <div>
    <div v-if="!seriesLoading">
      <h5>{{ series.title }}</h5>
      <p>{{ series.mainIdea }}</p>
    </div>
    <hr/>
    <div v-if="!lessonLoading">
      <h5>Bible Refs</h5>
      <ul>
        <li v-for="ref in lesson.bibleRefs" :key="ref">{{ $bible.text(ref) }}<br/>{{ $bible.readable(ref) }}</li>
      </ul>
      <hr/>
      <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" />
    </div>
    <div class="fixed-bottom bg-primary drawer-overlay" style="padding: 10px;" v-bind:class="{ 'full-height': showResources }">
      <q-btn class="float-right" color="dark" @click.native="showResources = showResources ? false : true">{{ showResources ? 'Hide' : 'Show' }}</q-btn>
      <h5 style="margin: 0;">Resources</h5>
    </div>
  </div>
</template>

<script>
export default {
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
        onSuccess: () => {
          this.lessonLoading = false
        }
      }),
      showResources: false
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
