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
           :disabled="!isActiveBtn(btn)"
           @click="onClick(btn)">
      {{btn.text}}
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenAction',
    injectService: [
      'PosStore:(getPosSetting,chooseFunction,activeTableProduct)',
    ],
    data() {
      return {
        listBtn: []
      }
    },
    async activated() {
      await this.generateTemplate();
    },
    async mounted() {
      await this.generateTemplate();
    },
    methods: {
      async generateTemplate() {
        const setting = await this.getPosSetting();
        const rows = setting.generalSetting.quickFnRows;

        //define template
        const actionRef = this.$refs.action;

        if (actionRef) {
          const tablePercent = 73 - 9 * rows;
          const actionPercent = 9 * rows;
          actionRef.style['grid-template-rows'] = `repeat(${rows},1fr)`;
          const leftLayout = actionRef.parentElement;
          leftLayout.style['grid-template-rows'] = `8% ${tablePercent}% 11% ${actionPercent}% 8%`;
          actionRef.style.display = rows === 0 ? 'none' : 'grid';
        }
        //add btn
        this.listBtn = [];
        const btns = setting.leftFunctionButtons.slice(0, 4 * rows);
        const containedBtns = btns.reduce((acc, btn) => ([...acc, ...btn.containedButtons]), []);

        for (const btn of btns) {
          if (!containedBtns.includes(btn._id)) {
            this.listBtn.push(
              btn.buttonFunction === 'buybackProduct'
                ? Object.assign(btn, {
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