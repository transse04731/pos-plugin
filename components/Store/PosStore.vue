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
        loginPassword: '',
        incorrectPasscode: false,
        //payment screen variables
        paymentAmountTendered: '',
        paymentTip: 0,
        lastPayment: 0,
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
