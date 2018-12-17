<template>
  <q-modal ref="modal" content-classes="topic-modal">
    <div class="topic-preview">
      <q-btn size="sm" icon="fas fa-trash" color="negative" class="float-right" @click.native="removeTopic(data.id)" />
      <q-btn size="sm" icon="fas fa-times" color="primary" class="float-right" @click.native="$refs.modal.hide()" />
      <h5>{{ data.title }}</h5>
      <div class="q-title">Premise</div>
      <hr style="border: .5px white solid" />
      <p>{{ data.premise }}</p>
      <div class="q-title">Notes</div>
      <hr style="border: .5px white solid" />
      <div>
        <span v-html="data.notes"></span>
      </div>
      <br/>
      <br/>
      <div class="q-title">Conclusion</div>
      <hr style="border: .5px white solid" />
      <p>{{ data.conclusion }}</p>
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'PreviewTopic',
  props: [ 'data', 'removeTopic' ],
  data () {
    return {}
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    }
  }
}
</script>

<style>
.topic-modal {
  width: 100%;
  padding: 20px 400px;
}
@media screen and (min-width: 1200px) {
  .topic-modal {
    min-width: 650px;
    width: 650px;
  }
}
</style>
