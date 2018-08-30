<template>
  <q-page padding style="background-color: white;">
    <iframe title="Feedback Form" class="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://realcurriculum.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=No&captcha=yes" scrolling="no" height="500px" width="100%" frameborder="0" :onload="prepop()">
    </iframe>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  methods: {
    prepop () {
      // console.log('input field', document.getElementById('freshwidget-embedded-form').contentWindow.document.getElementById('helpdesk_ticket_email'))
    }
  }
}
</script>

<style media="screen, projection">

@import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css);

</style>
