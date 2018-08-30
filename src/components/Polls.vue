<template>
  <q-modal v-model="showPoll" ref="pollModal" content-classes="poll-modal" position="bottom">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            {{ poll.title }}
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <p>{{ poll.welcomeMessage }}</p>
          <q-list v-if="showPoll" no-border separator sparse>
            <q-item v-for="question in poll.questions" :key="question.text">
              <q-item-main>
                <q-item-tile>
                  <p>{{ question.text }}</p>
                </q-item-tile>
                <q-item-tile>
                  <q-input v-if="question.type === 'short'" v-model="question.answer" />
                  <q-option-group v-if="question.type === 'selectOne'" v-model="question.answer" :options="question.options" type="radio" />
                  <q-option-group v-if="question.type === 'selectMultiple'" v-model="question.answer" :options="question.options" type="checkbox" />
                  <div v-if="question.type === 'slider'">
                    <q-chip color="primary" class="float-right">{{ question.max }}</q-chip>
                    <q-chip color="primary">{{ question.min }}</q-chip>
                    <q-slider v-model="question.answer" :min="1" :max="5" :step="1" snap markers />
                  </div>
                  <q-toggle v-if="question.type === 'yesNo'" :label="question.text" v-model="question.answer" />
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </div>
        <q-toolbar slot="footer">
          <q-toolbar-title>
          </q-toolbar-title>
          <q-btn @click.native="nextAction.action">{{ nextAction.label }}</q-btn>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>
</template>

<script>
import { Notify } from 'quasar'

export default {
  // name: 'ComponentName',
  data () {
    return {
      poll: {
        title: '',
        welcomeMessage: ''
      },
      showPoll: false,
      notification: {},
      page: this.$route.name,
      testPoll: {
        title: 'A Great Poll',
        welcomeMessage: 'Please complete the questions below',
        askMessage: 'Hey! Take this poll',
        secondaryMessage: 'It\'s super great!',
        acceptMessage: 'Okie dokie',
        rejectMessage: 'Nah...',
        questions: [
          {
            text: 'A short answer question',
            type: 'short',
            answer: ''
          },
          {
            text: 'A single select question',
            type: 'selectOne',
            options: [
              {
                label: 'Something',
                value: 'something'
              },
              {
                label: 'Something Else',
                value: 'somethingelse'
              }
            ],
            answer: ''
          },
          {
            text: 'A multi select question',
            type: 'selectMultiple',
            options: [
              {
                label: 'A',
                value: 'a'
              },
              {
                label: 'B',
                value: 'b'
              },
              {
                label: 'C',
                value: 'c'
              }
            ],
            answer: []
          },
          {
            text: 'A slider question',
            type: 'slider',
            min: 'Not very...',
            max: 'Definitely!',
            answer: 3
          },
          {
            text: 'A yes/no question',
            type: 'yesNo',
            answer: false
          }
        ]
      },
      nextAction: {
        label: 'Finish',
        action: () => { console.log('works!') }
      }
    }
  },
  watch: {
    '$route': function (val) {
      this.page = val.name
      // this.notification()
    }
  },
  mounted () {
    this.init()
    // this.notify(this.testPoll)
    // this.poll = this.testPoll
    // this.showPoll = true
  },
  methods: {
    init () {
      this.$database.poll('getCurrentPolls', null, (res) => {
        console.log('current polls', res)
      })
    },
    submit () {
      console.log('poll submitted')
    },
    notify (poll) {
      this.notification = Notify.create({
        message: poll.askMessage,
        timeout: 0,
        color: 'primary',
        icon: 'fas fa-bell',
        detail: poll.secondaryMessage,
        position: 'bottom-left',
        actions: [
          {
            label: poll.acceptMessage,
            icon: 'fas fa-thumbs-up',
            handler: () => {
              console.log('poll dismissed')
            }
          },
          {
            label: poll.rejectMessage,
            icon: 'fas fa-times',
            handler: () => {
              console.log('poll dismissed')
            }
          }
        ]
      })
    }
  }
}
</script>

<style>

.poll-modal {
  min-width: 50vw;
  min-height: 80vh;
}

</style>
