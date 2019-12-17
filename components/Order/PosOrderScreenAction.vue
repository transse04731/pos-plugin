<template>
  <div ref="action">
    <g-btn :uppercase="false" outlined height="100%">F1</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F2</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F3</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F4</g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenAction',
    injectService: [
        'PosStore:generalSetting',
        'PosStore:getGeneralSetting'
    ],
    data() {
      return {
        listBtn: [
          {}
        ]
      }
    },
    computed: {
      quickFnRows: {
        get() {
          if (this.generalSetting) {
            return this.generalSetting.quickFnRows;
          }
        },
        set(val) {
          this.generalSetting.quickFnRows = val;
        }
      },
    },
    async created() {
      await this.getGeneralSetting();
      console.log(this.generalSetting)
      console.log(this.quickFnRows)
      const rows = this.generalSetting.quickFnRows;
      const tablePercent = 73 - 9 * rows;
      const actionPercent = 9 * rows;
      const left = document.querySelector('.layout__left');
      left.style['grid-template-rows'] = '8% '+ tablePercent +'% 11% '+ actionPercent +'% 8%';
      const action = this.$refs.action;
      action.style['grid-template-rows'] = 'repeat('+ rows +',1fr)';
      if(rows === 0)
        action.style.display = 'none';
    },
    watch: {
      quickFnRows: {
        handler: function (val) {
          console.log(val)
        },
        deep: true
      },
      setting: function (v) {
        console.log(v);
      }
    }
  }
</script>

<style scoped lang="scss">
  .action {
    padding: 9px 6px;
  }

  .g-btn {
    &.g-btn__outlined {
      border: 1px solid #979797;
      background-color: #fafafa;
    }
  }
</style>