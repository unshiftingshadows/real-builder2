<template>
  <q-card flat>
    <q-card-title>
      <h4 style="margin: 0;">
        <q-icon v-if="!open" name="fas fa-caret-right cursor-pointer" style="margin-top: -5px; padding-left: 4px; padding-right: 4px;" size="2rem" @click.native="open = true" />
        <q-icon v-if="open" name="fas fa-caret-down cursor-pointer" style="margin-top: -5px;" size="2rem" @click.native="open = false" />
        &nbsp;
        {{ id === 'hook' ? 'Hook' : data.title }}
      </h4>
    </q-card-title>
    <div class="row gutter-sm" style="padding-left: 10px; padding-right: 10px;" v-if="open">
      <div class="col-12">
        <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'preview-' + mod.type" :id="mod['.key']" :data="mod" class="module-preview" />
      </div>
    </div>
  </q-card>
</template>

<script>
import PreviewQuote from 'components/preview/Quote.vue'
import PreviewText from 'components/preview/Text.vue'
import PreviewBible from 'components/preview/Bible.vue'
import PreviewActivity from 'components/preview/Activity.vue'
import PreviewQuestion from 'components/preview/Question.vue'
import PreviewVideo from 'components/preview/Video.vue'
import PreviewImage from 'components/preview/Image.vue'
// import PreviewComposition from 'components/preview/Composition.vue'
import PreviewLyric from 'components/preview/Lyric.vue'
import PreviewIllustration from 'components/preview/Illustration.vue'

export default {
  components: {
    PreviewQuote,
    PreviewText,
    PreviewBible,
    PreviewActivity,
    PreviewQuestion,
    PreviewVideo,
    PreviewImage,
    // PreviewComposition,
    PreviewLyric,
    PreviewIllustration
  },
  props: ['id', 'data', 'contentType', 'contentid'],
  // name: 'ComponentName',
  data () {
    return {
      open: true
    }
  },
  firebase () {
    return {
      'modules': {
        source: this.$firebase.sectionModules(this.contentType, this.contentid, this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('section modules loaded')
        }
      }
    }
  }
}
</script>

<style>

.section-preview {
  background-color: inherit;
  border: 2px dashed var(--q-color-primary);
}

</style>
