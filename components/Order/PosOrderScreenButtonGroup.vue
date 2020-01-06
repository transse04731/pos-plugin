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
           :disabled="!isActiveBtn(btn)"
           @click="onClick(btn)">
      {{btn.text}}
    </g-btn>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'PosOrderScreenButtonGroup',
    injectService: [
      'PosStore:(chooseFunction,activeTableProduct,getPosSetting,currentOrder)'
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
        const rightFunctionButtons = setting.rightFunctionButtons;
        const containedBtns = rightFunctionButtons.reduce((acc, btn) => ([...acc, ...btn.containedButtons]), []);
        for (const btn of rightFunctionButtons) {
          if (!containedBtns.includes(btn._id)) {
            this.listBtn.push(
              btn.buttonFunction === 'buybackProduct'
                ? Object.assign({}, btn, {
                  buttonFunctionValue: btn.buyback
                })
                : btn);
          }
        }
      },
      isActiveBtn(btn) {
        return this.$getService('PosStore:isActiveFnBtn')(btn)
      },
      onClick(btn) {
        if (!btn || !btn.buttonFunction) return
        this.$getService('PosStore:chooseFunction')(btn.buttonFunction)(btn.buttonFunctionValue)
      }
    },
    async activated() {
      await this.generateTemplate();
    },
    async mounted() {
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