<template>
  <div>
    <h5 style="margin-bottom: 5px;">{{ data.title }}</h5>
    <span v-html="data.text"/>
  </div>
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
