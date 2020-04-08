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
        user: null,
        
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
        cms.login(username, password, null, true).then(async () => {
          this.user = await cms.getModel('User').findOne({username, password})
          this.$router.push('/view/od-management')
        }).catch(err => {
          errCb && errCb(err.response.data.message)
        })
        this.incorrectPasscode = true
      },
      logout(cb) {
        cms.logout()
        document.cookie = ''
        cb && cb()
      }
    },
    async created() {
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)
      // const i18nConfig = cms.getList('SystemConfig').find(i => i.type === 'I18n')
      // if (i18nConfig) {
      //   this.locale = i18nConfig.content.locale
      // }
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
