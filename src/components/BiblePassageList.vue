<template>
  <div>
    <h5>Bible Passages</h5>
    <q-list v-if="show">
      <bible-passage
        v-for="passage in passages"
        :key="passage"
        :passage="passage"
      />
    </q-list>
  </div>
</template>

<script>
import BiblePassage from 'components/BiblePassage.vue'

export default {
  components: {
    BiblePassage
  },
  // name: 'ComponentName',
  props: [ 'passages' ],
  data () {
    return {
      show: false
    }
  }
}
</script>

<style>
</style>
