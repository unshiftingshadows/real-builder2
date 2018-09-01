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
  notes: ''
}

var defaultHook = {
  pos: 'before',
  title: '',
  wordcount: 0,
  time: 0,
  editing: false,
  show: true
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

export default {
  // name: 'ComponentName',
  props: [ 'nextLessonOrder', 'close', 'edit' ],
  data () {
    return {
      showAddMedia: false,
      type: 'lesson'
    }
  },
  methods: {
    addModule () {
      console.log('add module')
      this.close()
      this.$firebase.lessonsRef(this.$parent.id).add({
        editing: this.$firebase.auth.currentUser.uid,
        order: this.nextLessonOrder,
        title: '',
        mainIdea: '',
        bibleRefs: [],
        notes: '',
        prayer: '',
        application: ''
      }).then((newRef) => {
        console.log('newRef', newRef.id)
        for (var x = 1; x <= 7; x++) {
          this.$firebase.devosRef(this.$parent.id, newRef.id).doc(x.toString()).set(defaultDevo)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('hook').set(defaultHook)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('application').set(defaultApplication)
          this.$firebase.devoContentRef(this.$parent.id, newRef.id, x.toString()).collection('structure').doc('prayer').set(defaultPrayer)
        }
        guideTypes.forEach((type) => {
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('hook').set(defaultHook)
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('application').set(defaultApplication)
          this.$firebase.guideRef(this.$parent.id, newRef.id, type).collection('structure').doc('prayer').set(defaultPrayer)
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
