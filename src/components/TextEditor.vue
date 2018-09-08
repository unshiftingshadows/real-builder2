<template>
  <div>
    <vue-editor
      ref="editor"
      :editorToolbar="toolbar"
      :editorOptions="options"
      :value="text"
      @input="$emit('update:text', $event)"
    />
  </div>
</template>

<script>
import { Notify } from 'quasar'
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  name: 'TextEditor',
  props: [ 'text', 'autoSave', 'saveClose' ],
  data () {
    return {
      content: this.text,
      toolbar: [
        [{ 'header': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ],
      options: {
        modules: {
          keyboard: {
            bindings: [{
              key: 13,
              shortKey: true,
              shiftKey: true,
              handler: () => { console.log('shift meta enter') }
            }, {
              key: 13,
              shortKey: true,
              shiftKey: false,
              handler: this.saveClose ? () => { this.saveClose() } : () => {}
            }]
          }
        }
      },
      editCount: 0,
      saveInterval: null
    }
  },
  mounted () {
    console.log('editor', this.$refs.editor)
    this.$refs.editor.quill.on('selection-change', (range, oldRange, source) => {
      if (range === null && oldRange !== null) {
        this.editCount = 0
        this.save()
      }
    })
    this.$refs.editor.quill.on('text-change', (delta, oldDelta, source) => {
      if (this.editCount >= 100) {
        this.editCount = 0
        this.save()
      } else this.editCount++
    })
    this.saveInterval = setInterval(this.autoSave, 300000)
  },
  beforeDestroy () {
    clearInterval(this.saveInterval)
  },
  methods: {
    save () {
      this.autoSave(this.text)
      Notify.create({
        type: 'positive',
        message: 'Auto saving...',
        position: 'bottom-left'
      })
    },
    focus () {
      this.$refs.editor.quill.focus()
    }
  }
}
</script>

<style>

.ql-picker-label {
  color: #bbb !important;
}

.ql-fill {
  fill: #bbb !important;
}

.ql-stroke {
  stroke: #bbb !important;
}

</style>
