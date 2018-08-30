<template>
  <div class="col-12 relative-position" style="height: 70px">
    <q-btn round color="primary" icon="fas fa-plus" class="absolute-center" @click.native="addModule" />
  </div>
</template>

<script>
var defaultDevos = {
  '1': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '2': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '3': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '4': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '5': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '6': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  },
  '7': {
    editing: false,
    title: '',
    mainIdea: '',
    bibleRefs: '',
    notes: ''
  }
}

var defaultContent = {
  structure: {
    before: {
      hook: {
        title: '',
        wordcount: 0,
        time: 0,
        editing: false,
        show: true
      }
    },
    after: {
      application: {
        title: '',
        today: '',
        thisweek: '',
        thought: '',
        wordcount: 0,
        time: 0,
        editing: false,
        show: true
      },
      prayer: {
        text: '',
        wordcount: 0,
        time: 0,
        editing: false,
        show: true
      }
    }
  }
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
      var newRef = this.$firebase.lessonsRef(this.$parent.id).push({
        editing: this.$firebase.auth.currentUser.uid,
        order: this.nextLessonOrder,
        title: '',
        mainIdea: '',
        bibleRefs: '',
        notes: '',
        prayer: '',
        application: ''
      })
      this.$firebase.devosRef(this.$parent.id, newRef.key).set(defaultDevos)
      for (var x = 1; x <= 7; x++) {
        this.$firebase.devoContentRef(this.$parent.id, newRef.key, x).set(defaultContent)
      }
      guideTypes.forEach((type) => {
        this.$firebase.guides(this.$parent.id, newRef.key, type).set(defaultContent)
      })
      this.edit(newRef.key)
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
