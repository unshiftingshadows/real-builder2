<template>
  <q-modal ref="addMediaModal" v-model="showAddMedia" content-classes="add-media-modal">
    <q-btn
      color="primary"
      @click.native="showAddMedia = false"
      icon="fas fa-times"
      class="float-right"
      size="sm"
    />
    <h4>Add {{ type }}</h4>
    <div class="row gutter-sm">
      <div class="col-12" v-if="type === 'quote'">
        <q-input v-model="quoteText" float-label="Quote Text" type="textarea" :max-height="100" :min-rows="1" />
      </div>
      <div class="col-12" v-if="type === 'illustration'">
        <q-input type="text" float-label="Illustatration Title" v-model="illustrationTitle" />
      </div>
      <div class="col-12" v-if="type === 'lyric'">
        <q-input type="text" float-label="Lyric Title" v-model="lyricTitle" />
      </div>
      <div class="col-12" v-if="type === 'image'">
        <q-btn-toggle
          v-model="imageType"
          toggle-color="primary"
          :options="imageOptions"
        />
        <br/>
        <br/>
        <div class="col-12" v-if="imageType === 'wiki'">
          <q-input type="text" float-label="Wiki Title" v-model="imageTitle" />
        </div>
        <div class="col-12" v-if="imageType === 'upload'">
          <FilePond
            name="image-upload"
            ref="image-upload"
            labelIdle="Drop files here..."
            allowMultiple="false"
            acceptedFileTypes="image/jpeg, image/png"
            :files="images"
            :server="imageServer"
          />
        </div>
        <div class="col-12" v-if="imageType === 'link'">
          <q-input type="text" float-label="Image URL" v-model="imageURL" />
        </div>
      </div>
      <div class="col-12" v-if="type === 'video'">
        <q-input type="text" float-label="Video URL" v-model="videoURL" />
      </div>
      <div class="col-12" v-if="!(type === 'image' && imageType === 'upload')">
        <q-btn color="primary" class="float-right" @click.native="add" :disabled="loading">Add {{ type }}</q-btn>
        <q-spinner class="float-right" size="2rem" color="primary" style="margin-right: 20px;" v-if="loading" />
      </div>
    </div>
  </q-modal>
</template>

<script>
import { Notify } from 'quasar'
import FilePond, { registerPlugin } from 'vue-filepond'
import FilePondImagePreview from 'filepond-plugin-image-preview'

registerPlugin(FilePondImagePreview)

import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

export default {
  components: {
    FilePond
  },
  props: ['type', 'addNew'],
  // name: 'ComponentName',
  data () {
    return {
      loading: false,
      quoteText: '',
      illustrationTitle: '',
      lyricTitle: '',
      videoURL: '',
      imageType: '',
      imageTitle: '',
      images: [],
      imageURL: '',
      imageOptions: [
        {
          label: 'Wiki',
          value: 'wiki'
        },
        {
          label: 'Upload',
          value: 'upload'
        },
        {
          label: 'Link',
          value: 'link'
        }
      ],
      imageServer: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          // Should do custom file upload or local storing here
          this.loading = true
          this.$database.add('image', { service: 'upload' }, (res) => {
            var uploadProcess = this.$firebase.imagesRef.child(res._id).put(file)
            uploadProcess.on('state_changed', (snapshot) => {
              progress(true, snapshot.bytesTransferred, snapshot.totalBytes)
            }, (err) => {
              error(err)
            }, () => {
              load(uploadProcess.snapshot.ref.name)
              uploadProcess.snapshot.ref.getDownloadURL().then((url) => {
                res.thumbURL = url
                res.imageURL = url
                res.pageURL = url
                this.showAddMedia = false
                this.loading = false
                this.addNew(res)
              })
            })
          })

          // Can call the error method if something is wrong, should exit after
          // error('oh my goodness');

          // Should call the progress method to update the progress to 100% before calling load
          // (endlessMode, processedSize, totalSize)
          // progress(true, 0, 1024);

          // Should call the load method when done and pass the returned server file id
          // the unique server file id is used by revert and restore functions
          // load('unique-file-id');

          // Should expose an abort method so the request can be cancelled
          return {
            abort: () => {
              // User tapped abort, cancel our ongoing actions here

              // Let FilePond know the request has been cancelled
              abort()
            }
          }
        },
        revert: './revert',
        restore: './restore/',
        load: './load/',
        fetch: './fetch/'
      },
      types: ['quote', 'image', 'illustration', 'lyric', 'video'],
      showAddMedia: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.text = ''
    },
    add () {
      console.log('add')
      if (this.types.includes(this.type)) {
        var obj = {}
        switch (this.type) {
          case 'quote':
            if (this.quoteText === '') {
              this.$q.notify('Please review fields again')
              return
            }
            obj.data = this.quoteText
            break
          case 'image':
            switch (this.imageType) {
              case 'wiki':
                if (this.imageTitle === '') {
                  this.$q.notify('Please review fields again')
                  return
                }
                obj.data = this.imageTitle
                obj.service = 'wiki'
                break
              case 'upload':
                return
              case 'link':
                if (this.imageURL === '') {
                  this.$q.notify('Please review fields again')
                  return
                }
                obj.data = this.imageURL
                obj.service = 'link'
                break
              default:
                console.error('invalid image type')
            }
            break
          case 'illustration':
            if (this.illustrationTitle === '') {
              this.$q.notify('Please review fields again')
              return
            }
            obj.data = this.illustrationTitle
            break
          case 'lyric':
            if (this.lyricTitle === '') {
              this.$q.notify('Please review fields again')
              return
            }
            obj.data = this.lyricTitle
            break
          case 'video':
            if (this.videoURL === '') {
              this.$q.notify('Please review fields again')
              return
            }
            obj.data = this.videoURL
            break
          default:
            console.error('Invalid media type')
            this.$q.notify('Invalid media type')
        }
        this.loading = true
        this.$database.add(this.type, obj, (res) => {
          this.showAddMedia = false
          this.loading = false
          this.addNew(res)
          Notify.create({
            message: this.type + ' created!',
            type: 'positive',
            position: 'bottom-left'
          })
        })
      }
    },
    show () {
      this.showAddMedia = true
    }
  }
}
</script>

<style>
</style>
