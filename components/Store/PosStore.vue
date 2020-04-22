<template>
  <fragment/>
</template>

<script>
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
        loginPassword: '',
        incorrectPasscode: false,
        //payment screen variables
        paymentAmountTendered: '',
        paymentTip: 0,
        lastPayment: 0,
        timeFormat: this.$t('dates.timeFormat'),
        dateFormat: this.$t('dates.dateFormat'),
        locale: 'en',
        device: 'Terminal1',
        isFirstTimeSetup: true,
      }
    },
    domain: 'PosStore',
    methods: {
      //<!--<editor-fold desc="Login screen">-->
      async login() {
        try {
          const posSetting = await cms.getModel('PosSetting').findOne();
          this.user = posSetting.user.find(user => user.passcode === this.loginPassword)

          if (this.user) {
            this.loginPassword = ''
            return this.$router.push({ path: `/pos-dashboard` })
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
      completeSetup() {
        this.isFirstTimeSetup = false
        localStorage.setItem('isFirstTimeSetup', 'false')
      }
      //<!--</editor-fold>-->
    },
    async created() {
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)

      const i18nConfig = cms.getList('SystemConfig').find(i => i.type === 'I18n')
      if (i18nConfig) {
        this.locale = i18nConfig.content.locale
      }

      if (this.$router && this.$router.currentRoute) {
        const {currentRoute} = this.$router
        if (currentRoute.path === '/pos-login' && currentRoute.query.device) {
          this.device = currentRoute.query.device
        }
      }

      this.isFirstTimeSetup = JSON.parse(localStorage.getItem('isFirstTimeSetup'))
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
