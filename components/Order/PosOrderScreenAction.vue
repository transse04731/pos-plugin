<template>
  <div ref="action">
    <g-btn :uppercase="false" height="100%" elevation="0"
      v-for="(btn, i) in listBtn" :key="i"
      :style="{
              gridRow: btn.rows[0] + '/' + btn.rows[1],
              gridColumn: btn.cols[0] + '/' + btn.cols[1],
              backgroundColor: btn.backgroundColor,
              color: btn.backgroundColor !== '#FFFFFF' ? btn.textColor : '#000d',
              border: btn.backgroundColor && btn.backgroundColor !== '#FFFFFF' ? null : '1px solid #979797'
            }"
           :disabled="!hasActiveOrderProduct(btn)"
      @click="chooseFunction(btn.buttonFunction)(btn.buttonFunctionValue)">
      {{btn.text}}
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenAction',
    injectService: [
        'PosStore:getPosSetting',
        'PosStore:chooseFunction',
    ],
    data() {
      return {
        listBtn: []
      }
    },
    async mounted() {
      const posStore = this.$getService('PosStore');
      posStore.$watch('leftButtonsUpdate', async () => {
        await this.generateTemplate()
      }, { deep: true });
      await this.generateTemplate();
    },
    methods: {
      async generateTemplate() {
        const setting = await this.getPosSetting();
        const rows = setting.generalSetting.quickFnRows;
        //define template
        const tablePercent = 73 - 9 * rows;
        const actionPercent = 9 * rows;
        const action = this.$refs.action;
        action.style['grid-template-rows'] = 'repeat('+ rows +',1fr)';
        const left = action.parentElement;
        left.style['grid-template-rows'] = '8% '+ tablePercent +'% 11% '+ actionPercent +'% 8%';
        action.style.display = rows === 0 ? 'none' : 'grid';
        //add btn
        this.listBtn = [];
        const btns = setting.leftFunctionButtons.slice(0, 4 * rows);
        const containedBtns = btns.reduce((acc, btn) => ([...acc, ...btn.containedButtons]), []);
        for(const btn of btns) {
          if(!containedBtns.includes(btn._id)) {
            this.listBtn.push(btn);
          }
        }
      },
      hasActiveOrderProduct(btn) {
        if(btn.buttonFunction === 'changePrice' || btn.buttonFunction === 'discountSingleItemDialog')
          return !_.isNil(this.activeTableProduct)
        return true;
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