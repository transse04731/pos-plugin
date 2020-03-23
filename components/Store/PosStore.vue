<template>
  <fragment/>
</template>

<script>
  import _ from 'lodash'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  import localeData from 'dayjs/plugin/localeData'
  import { getProvided } from '../logic/commonUtils';

  dayjs.extend(customParseFormat)
  dayjs.extend(localeData)

  export default {
    name: 'PosStore',
    props: {},
    data() {
      return {
        systemDate: new Date(),
        user: null,
        loginPassword: '',
        incorrectPasscode: false,
        //payment screen variables
        paymentAmountTendered: '',
        paymentTip: 0,
        lastPayment: 0,
        timeFormat: this.$t('dates.timeFormat'),
        dateFormat: this.$t('dates.dateFormat'),
      }
    },
    domain: 'PosStore',
    methods: {
      //<!--<editor-fold desc="Login screen">-->
      login() {
        try {
          this.user = _.find(cms.getList('PosSetting')[0].user, user => user.passcode === this.loginPassword)
          if (this.user) {
            this.loginPassword = ''
            return this.$router.push({ path: `/view/pos-dashboard` })
          }
        } catch (e) {
          console.error(e)
        }
        this.incorrectPasscode = true
      },
      resetIncorrectPasscodeFlag() {
        if (this.incorrectPasscode) {
          this.incorrectPasscode = false
        }
      },
      //<!--</editor-fold>-->
      //Layout config views
    },
    async created() {
      this.user = cms.getList('PosSetting')[0].user[0]
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)

      const i18nConfig = cms.getList('SystemConfig').find(i => i.type === 'I18n')
      const locale = i18nConfig ? i18nConfig.content.locale : 'en'

      if (locale) {
        const localeModule = require(`dayjs/locale/${locale}`)
        localeModule && dayjs.locale(localeModule)
      }
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
