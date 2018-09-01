<template>
  <div>
    <h5>{{ series.title }}</h5>
    <p>{{ series.mainIdea }}</p>
    <hr/>
    <h5>Bible Refs</h5>
    <ul>
      <li v-for="ref in lessonRefs" :key="ref.ref">{{ ref.text }}<br/>{{ ref.ref }}</li>
    </ul>
    <hr/>
    <q-input v-model="lesson.notes" float-label="Lesson Notes" type="textarea" :max-height="150" :min-rows="3" />
    <div class="fixed-bottom bg-primary drawer-overlay" style="padding: 10px;" v-bind:class="{ 'full-height': showResources }">
      <q-btn class="float-right" color="dark" @click.native="showResources = showResources ? false : true">{{ showResources ? 'Hide' : 'Show' }}</q-btn>
      <h5 style="margin: 0;">Resources</h5>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  firebase () {
    return {
      series: {
        source: this.$firebase.ref('series', '', this.$route.params.seriesid),
        asObject: true
      },
      lesson: {
        source: this.$firebase.lessonsRef(this.$route.params.seriesid).doc(this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          if (val.val().bibleRefs !== undefined && val.val().bibleRefs !== '') {
            val.val().bibleRefs.split(',').forEach((ref) => {
              console.log(ref)
              this.$database.bible(ref, 'esv', (res) => {
                this.lessonRefs.push({
                  ref: ref,
                  text: res.text
                })
              })
            })
          }
        }
      }
    }
  },
  data () {
    return {
      lessonRefs: [],
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
