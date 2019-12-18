<template>
  <div area="buttons">
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
  import _ from 'lodash'

  export default {
    name: 'PosOrderScreenButtonGroup',
    injectService: [
      'PosStore:(chooseFunction, activeTableProduct, getPosSetting)'
    ],
    data() {
      return {
        listBtn: []
      }
    },
    methods: {
      async generateTemplate() {
        const setting = await this.getPosSetting();
        this.listBtn = [];
        const btns = setting.rightFunctionButtons;
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
    },
    async mounted() {
      const posStore = this.$getService('PosStore');
      posStore.$watch('rightButtonsUpdate', async () => {
        await this.generateTemplate()
      }, { deep: true });
      await this.generateTemplate();
    },
  }
</script>

<style scoped lang="scss">
  .g-btn {
    &.g-btn__outlined {
      border: 1px solid #979797;
      background-color: #fafafa;
    }

    &.g-btn__disabled {
      background-color: #DFDFDF;
    }

    &.g-btn__text {
      border: 0;
    }
  }

  .buttons {
    padding: 8px 8px 8px 0;
  }
</style>