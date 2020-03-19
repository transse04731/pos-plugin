<template>
  <fragment/>
</template>

<script>
  import _ from 'lodash'
  import customParseFormat from 'dayjs/plugin/customParseFormat'

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
      async updatePosSettings(item, dbButtonList, mergeMap) {
        try {
          await cms.getModel('PosSetting').findOneAndUpdate({ [`${dbButtonList}._id`]: item.buttonId }, {
            '$set': {
              [`${dbButtonList}.$.backgroundColor`]: item.style.backgroundColor,
              [`${dbButtonList}.$.text`]: item.text,
              [`${dbButtonList}.$.rows`]: item.row,
              [`${dbButtonList}.$.cols`]: item.col,
              [`${dbButtonList}.$.textColor`]: ['#73F8F8', '#FFFFFF'].includes(item.style.backgroundColor) ? '#000000' : '#FFFFFF',
              [`${dbButtonList}.$.buttonFunction`]: item.buttonFunction,
              [`${dbButtonList}.$.buttonFunctionValue`]: item.buttonFunctionValue,
              [`${dbButtonList}.$.containedButtons`]: mergeMap && mergeMap[item.buttonId] ? mergeMap[item.buttonId] : [],
              [`${dbButtonList}.$.buyback`]: item.buyback,
            }
          });
        } catch (e) {
          console.log('Error updating updatePosSettings', e);
        }
      },
    },
    async created() {
      this.user = cms.getList('PosSetting')[0].user[0]
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)
    },
    beforeDestroy() {
      this.setDateInterval && clearInterval(this.setDateInterval)
    },
    watch: {
      'orderHistoryPagination.limit'(newVal) {
        localStorage.setItem('orderHistoryPageSize', newVal)
      },
    },
    provide() {
      return {
        // login
        loginPassword: this.loginPassword,
        login: this.login,
        resetIncorrectPasscodeFlag: this.resetIncorrectPasscodeFlag,
        user: this.user,
        systemDate: this.systemDate,
        //Layout config views
        updatePosSettings: this.updatePosSettings,
      }
    }
  }
</script>

<style scoped>

</style>
