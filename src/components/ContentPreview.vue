<template>
  <div>
    <div class="row gutter-sm">
      <!-- Before -->
      <div class="col-12" v-if="structure.before && structure.before.hook.show">
        <preview-section id="hook" :data="structure.before.hook" :content-type="type" :contentid="id" />
      </div>
      <!-- Sections -->
      <div class="col-12" v-if="sections.length > 0">
        <preview-section v-for="section in sections" :key="section['.key']" :id="section['.key']" :data="section" :content-type="type" :contentid="id" class="section-preview" />
      </div>
      <!-- Modules -->
      <div class="col-12" v-if="modules.length > 0">
        <component v-for="mod in modules" :key="mod['.key']" v-bind:is="'preview-' + mod.type" :id="mod['.key']" :data="mod" class="module-preview" />
      </div>
      <!-- After -->
      <div class="col-12">
        <preview-repeated-thought v-if="type === 'guide'" :seriesid="$route.params.seriesid" :lessonid="$route.params.lessonid" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" />
        <preview-application v-if="structure.after && structure.after.application.show" id="application" :data="structure.after.application" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.after.application.editing === $firebase.auth.currentUser.uid }" />
        <preview-prayer v-if="structure.after && structure.after.prayer.show" id="prayer" :data="structure.after.prayer" :edit="editModule" :save="saveModule" :autosave="autoSaveModule" :close="closeModule" :remove="removeModule" class="module-card" v-bind:class="{ 'active-card': structure.after.prayer.editing === $firebase.auth.currentUser.uid }" />
      </div>
    </div>
  </div>
</template>

<script>
import PreviewSection from 'components/preview/Section.vue'
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
import PreviewApplication from 'components/preview/Application.vue'
import PreviewPrayer from 'components/preview/Prayer.vue'
import PreviewRepeatedThought from 'components/preview/RepeatedThought.vue'

export default {
  components: {
    PreviewSection,
    PreviewQuote,
    PreviewText,
    PreviewBible,
    PreviewActivity,
    PreviewQuestion,
    PreviewVideo,
    PreviewImage,
    // PreviewComposition,
    PreviewLyric,
    PreviewIllustration,
    PreviewApplication,
    PreviewPrayer,
    PreviewRepeatedThought
  },
  // name: 'ComponentName',
  props: ['type', 'id'],
  data () {
    return {
      structure: {
        before: {
          hook: {
            show: false
          }
        },
        after: {
          application: {
            show: false
          },
          prayer: {
            show: false
          }
        }
      }
    }
  },
  firebase () {
    return {
      structure: {
        source: this.$firebase.ref(this.type, 'structure', this.id, this.$route.params.seriesid, this.$route.params.lessonid),
        asObject: true,
        readyCallback: function (val) {
          console.log('structure loaded')
        }
      },
      sections: {
        source: this.$firebase.ref(this.type, 'sections', this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('sections loaded')
        }
      },
      modules: {
        source: this.$firebase.ref(this.type, 'modules', this.id, this.$route.params.seriesid, this.$route.params.lessonid).orderByChild('order'),
        readyCallback: function (val) {
          console.log('modules loaded')
        }
      },
      versions: {
        source: this.$firebase.ref(this.type, 'versions', this.id, this.$route.params.seriesid, this.$route.params.lessonid),
        readyCallback: function (val) {
          console.log('versions loaded')
        }
      }
    }
  }
}
</script>

<style>

.module-preview {
  margin-bottom: 20px;
}

.section-preview {
  margin-bottom: 20px;
}

</style>
