<template>
  <div>
    <div class="row gutter-md">
      <div class="col-12" v-if="structure.hook.show">
        <h4>Hook</h4>
        <h5 v-if="structure.hook.title !== ''">{{ structure.hook.title }}</h5>
        <p>{{ structure.hook.text }}</p>
      </div>
      <div class="col-12" v-for="module in modules" :key="module['.key']">
        <component v-bind:is="'preview-' + module.type" :id="module['.key']" :data="module" />
      </div>
      <div class="col-12" v-if="structure.application.show">
        <h4>Application</h4>
        <h5 v-if="structure.application.title !== ''">{{ structure.application.title }}</h5>
        <p>{{ structure.application.text }}</p>
      </div>
      <div class="col-12" v-if="structure.prayer.show">
        <h4>Prayer</h4>
        <h5 v-if="structure.prayer.title !== ''">{{ structure.prayer.title }}</h5>
        <p>{{ structure.prayer.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewSection from 'components/preview/Section.vue'
import PreviewText from 'components/preview/Text.vue'
import PreviewBible from 'components/preview/Bible.vue'
import PreviewActivity from 'components/preview/Activity.vue'
import PreviewQuestion from 'components/preview/Question.vue'
import PreviewQuote from 'components/preview/Quote.vue'
import PreviewImage from 'components/preview/Image.vue'
import PreviewIllustration from 'components/preview/Illustration.vue'
import PreviewLyric from 'components/preview/Lyric.vue'
import PreviewVideo from 'components/preview/Video.vue'

export default {
  components: {
    PreviewSection,
    PreviewText,
    PreviewBible,
    PreviewActivity,
    PreviewQuestion,
    PreviewQuote,
    PreviewImage,
    PreviewIllustration,
    PreviewLyric,
    PreviewVideo
  },
  props: ['id', 'type'],
  // name: 'ComponentName',
  firebase () {
    return {
      structure: {
        source: this.$firebase.ref(this.type, 'structure', this.id),
        asObject: true
      },
      modules: {
        source: this.$firebase.ref(this.type, 'modules', this.id).orderByChild('order')
      }
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
