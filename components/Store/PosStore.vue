<template>
  <fragment/>
</template>

<script>
  import _ from 'lodash'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  import { getProvided } from '../logic/commonUtils';

  dayjs.extend(customParseFormat)

  export default {
    name: 'PosStore',
    props: {},
    data() {
      return {
        systemDate: new Date(),
        loginUrl: '/view/sign-in',
        //payment screen variables
        paymentAmountTendered: '',
        paymentTip: 0,
        lastPayment: 0,
        timeFormat: this.$t('dates.timeFormat'),
        dateFormat: this.$t('dates.dateFormat'),
        locale: 'en'
      }
    },
    domain: 'PosStore',
    methods: {
      async login(username, password, errCb) {
        cms.login(username, password, '/view/management').catch(err => errCb && errCb(err.response.data.message))
        this.incorrectPasscode = true
      },
      logout() {
        cms.logout()
        document.cookie = ''
        this.$router.push(this.loginUrl || '/view/pos-login')
        this.user = null
      }
    },
    async created() {
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)
    },
    beforeDestroy() {
      this.setDateInterval && clearInterval(this.setDateInterval)
    },
    provide() {
      return {
        ...getProvided(this.$data, this),
        ...getProvided(this.$options.methods, this),
      }
    }
  }
</script>

<style scoped>

</style>
