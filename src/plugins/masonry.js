import { VueMasonryPlugin } from 'vue-masonry'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueMasonryPlugin)
}
