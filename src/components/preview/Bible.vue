<template>
  <q-card color="secondary">
    <q-card-title>
      <q-icon name="fas fa-book" size="2rem" />&nbsp;&nbsp;&nbsp;
      {{ data.bibleRef }} <span class="q-caption">{{ data.translation }}</span>
    </q-card-title>
    <q-card-main>
      <p>{{ data.text }}</p>
    </q-card-main>
  </q-card>
</template>

<script>
export default {
  props: ['data'],
  // name: 'ComponentName',
  data () {
    return {}
  }
}
</script>

<style>
</style>
