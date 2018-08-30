<template>
  <div>
    <q-btn color="primary" @click.native="open = !open">Add Research</q-btn>
    <q-modal v-model="open" content-classes="research-modal">
      <div class="row gutter-sm">
        <div class="col-12">
          <p>Current Research</p>
          <q-list>
            <q-item v-for="item in currentResearch" :key="item._id">
              <q-item-main>
                {{ item.media.title }}
              </q-item-main>
              <q-item-side right>
                <q-item-tile icon="fas fa-times" color="negative" @click.native="remove(item.type, item.media._id)" class="cursor-pointer" />
              </q-item-side>
            </q-item>
          </q-list>
        </div>
        <div class="col-12">
          <p>Add Research</p>
          <q-input v-model="searchTerm" float-label="Search" @keyup.enter="search" />
          <q-list>
            <div v-if="searching">
              <q-spinner color="primary" size="2rem" class="absolute-center" />
            </div>
            <div v-if="!searching">
              <q-item v-if="searchResults.length === 0">
                <q-item-main>No results...</q-item-main>
              </q-item>
              <q-item v-for="item in searchResults" :key="item._id">
                <q-item-main>
                  {{ item.title }}
                </q-item-main>
                <q-item-side right>
                  <q-item-tile icon="fas fa-plus" color="positive" @click.native="add('topic', item._id)" class="cursor-pointer" />
                </q-item-side>
              </q-item>
            </div>
          </q-list>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: [ 'currentResearch', 'id', 'type', 'reinit' ],
  data () {
    return {
      open: false,
      searching: false,
      searchTerm: '',
      searchResults: []
    }
  },
  methods: {
    search () {
      this.searching = true
      this.$database.search('topic', this.searchTerm, {}, (res) => {
        this.searchResults = res.filter((element) => {
          return !this.currentResearch.map((el) => {
            return el.media._id
          }).includes(element._id)
        })
        this.searching = false
      })
    },
    add (type, id) {
      console.log('add research')
      this.$database.research('add', this.type, this.id, type, id, (res) => {
        console.log(res)
        this.searchResults.splice(this.searchResults.map(function (e) { return e._id }).indexOf(id), 1)
        this.reinit()
      })
    },
    remove (type, id) {
      console.log('remove research')
      this.$database.research('remove', this.type, this.id, type, id, (res) => {
        console.log(res)
        this.currentResearch.splice(this.currentResearch.map(function (e) { return e.media._id }).indexOf(id), 1)
      })
    }
  }
}
</script>

<style>

.research-modal {
  padding: 30px;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 1200px) {
  .research-modal {
    min-width: 650px;
    width: 650px;
  }
}

</style>
