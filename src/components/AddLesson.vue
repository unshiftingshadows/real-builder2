<template>
  <div class="col-12 relative-position" style="height: 70px">
    <q-btn round color="primary" icon="fas fa-plus" class="absolute-center" @click.native="addModule" />
  </div>
</template>

<script>
var defaultDevo = {
  editing: false,
  title: '',
  mainIdea: '',
  bibleRefs: [],
  notes: '',
  sectionOrder: []
}

var defaultHook = {
  pos: 'before',
  title: '',
  wordcount: 0,
  time: 0,
  editing: false,
  show: true,
  moduleOrder: []
}

var defaultApplication = {
  pos: 'after',
  title: '',
  today: '',
  thisweek: '',
  thought: '',
  wordcount: 0,
  time: 0,
  editing: false,
  show: true
}

var defaultPrayer = {
  pos: 'after',
  text: '',
  wordcount: 0,
  time: 0,
  editing: false,
  show: true
}

var guideTypes = ['lecture', 'discussion', 'questions', 'answers', 'expositional']

/**
 * A modal component for adding a new lesson
 * 
 * ```html
 * <add-lesson :close="value" :edit="value" :add="value" />
 * ```
 * 
 * @author jacob beck
 */
export default {
  name: 'AddLesson',
  props: {
    /**
     * Function for closing any other open lesson before opening a new one to edit
     */
    close: { type: Function, required: true },
    /**
     * Function for opening new lesson to edit
     */
    edit: { type: Function, required: true },
    /**
     * Function for adding lesson to series lesson collection
     */
    add: { type: Function, required: true }
  },
  data () {
    return {
      /**
       * type of piece being added
       * @type {string}
       */
      type: 'lesson'
    }
  },
  methods: {
    /**
     * Adds a new lesson to a LessonList component
     * @return {void} void
     */
    addModule () {
      console.log('add module')
      this.close()
      this.$firebase.lessonsRef(this.$parent.id).add({
        editing: this.$firebase.auth.currentUser.uid,
        title: '',
        mainIdea: '',
        bibleRefs: [],
        notes: '',
        prayer: '',
        application: ''
      }).then((newRef) => {
        console.log('newRef', newRef.id)
        this.add(newRef.id)
        for (var x = 1; x <= 7; x++) {
          this.$firebase.devosRef(this.$parent.id, newRef.id).doc(x.toString()).set(defaultDevo)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('hook').set(defaultHook)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('application').set(defaultApplication)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('prayer').set(defaultPrayer)
        }
        guideTypes.forEach((type) => {
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).set({
            sectionOrder: []
          })
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('hook').set(defaultHook)
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('application').set(defaultApplication)
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('prayer').set(defaultPrayer)
        })
        this.$firebase.reviewRef(this.$parent.id, newRef.id).set({
          sectionOrder: []
        })
        this.$firebase.reviewRef(this.$parent.id, newRef.id).collection('structure').doc('hook').set(defaultHook)
        this.$firebase.reviewRef(this.$parent.id, newRef.id).collection('structure').doc('application').set(defaultApplication)
        this.$firebase.reviewRef(this.$parent.id, newRef.id).collection('structure').doc('prayer').set(defaultPrayer)
        this.edit(newRef.id)
      })
    }
  }
}
</script>

<style>

.add-media-modal {
  padding: 30px;
  width: 100%;
}
@media screen and (min-width: 1200px) {
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
