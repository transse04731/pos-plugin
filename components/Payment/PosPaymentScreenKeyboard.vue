<template>
  <div>
    <g-number-keyboard area="keyboard" :items="keyboard" :template="template" v-model="keyboardValue">
      <template v-slot:screen>
        <div></div>
      </template>
    </g-number-keyboard>
    <g-btn :uppercase="false" height="100%" elevation="0"
           v-for="(btn, i) in listBtn" :key="i"
           :style="{
              fontSize: '20px',
              gridRow: btn.rows[0] + '/' + btn.rows[1],
              gridColumn: btn.cols[0] + '/' + btn.cols[1],
              backgroundColor: btn.backgroundColor,
              color: btn.backgroundColor !== '#FFFFFF' ? btn.textColor : '#000d',
              border: btn.backgroundColor && btn.backgroundColor !== '#FFFFFF' ? null : '1px solid #979797'
            }"
           :disabled="!isActiveBtn(btn)"
           @click="onClickBtn(btn)">
      <g-icon v-if="btn.buttonFunction === 'cashDrawer'" class="mr-2" svg size="36">icon-cashier</g-icon>
      {{btn.text}}
    </g-btn>
  </div>
</template>

<script>
  const keyboardFunction = {
    number: (value, number) => value.charAt(value.length - 3) === '.' ? value : (value + number), //cant input > 2 digits after fixed-point
    dot: value => value.includes('.') ? value : (value + '.'), // only 1 fixed-point
    delete:(value) => (value && value.substring(0, value.length - 1))
  }

  export default {
    name: 'PosPaymentScreenKeyboard',
    injectService: [
      'OrderStore:(paymentAmountTendered,savePaidOrder,selectedPayment,paymentTotal,currentOrder)',
      'SettingsStore:getPosSetting'
    ],
    data() {
      return {
        keyboard: [
          { content: ['7'], style: 'grid-area: key7', action: keyboardFunction.number },
          { content: ['8'], style: 'grid-area: key8', action: keyboardFunction.number },
          { content: ['9'], style: 'grid-area: key9', action: keyboardFunction.number },
          { content: ['4'], style: 'grid-area: key4', action: keyboardFunction.number },
          { content: ['5'], style: 'grid-area: key5', action: keyboardFunction.number },
          { content: ['6'], style: 'grid-area: key6', action: keyboardFunction.number },
          { content: ['1'], style: 'grid-area: key1', action: keyboardFunction.number },
          { content: ['2'], style: 'grid-area: key2', action: keyboardFunction.number },
          { content: ['3'], style: 'grid-area: key3', action: keyboardFunction.number },
          { content: ['0'], style: 'grid-area: key0', action: keyboardFunction.number },
          { content: [','], style: 'grid-area: keyC', action: keyboardFunction.dot },
          { img: 'delivery/key_delete', style: 'grid-area: keyD', action: keyboardFunction.delete },
        ],
        template: 'grid-template-areas: "key7 key8 key9" "key4 key5 key6" "key1 key2 key3" "key0 keyC keyD"; grid-auto-rows: 1fr; grid-auto-columns: 1fr; grid-gap: 6px',
        listBtn: []
      }
    },
    computed: {
      keyboardValue: {
        get() {
          return this.paymentAmountTendered
        },
        set(value) {
          this.paymentAmountTendered = value.includes('.') ? value : parseFloat('0' + value).toString()
        }
      },
    },
    methods: {
      isActiveBtn(btn) {
        if (btn.buttonFunction === 'pay') {
          return this.paymentAmountTendered >= this.paymentTotal
        }
        return !!btn.text;
      },
      onClickBtn(btn) {
        if(btn.buttonFunction)
          this[btn.buttonFunction](btn.buttonFunctionValue);
      },
      async pay() {
        await this.$router.push({ path: '/view/pos-order' })
        await this.savePaidOrder()
        this.selectedPayment = null
      },
      cashDrawer() {

      },
      banknote(value) {
        this.paymentAmountTendered = (+value + parseFloat('0' + this.paymentAmountTendered)).toString();
      },
      discount() {
        if(this.currentOrder.items.find(i => i.vDiscount > 0) && !this.currentOrder.isDiscountInTotal) {
          this.$getService('alertDiscount:setActive')(true);
        } else {
          const originalTotal = this.currentOrder.items.reduce((acc, item) => (acc + (item.discountResistance ? 0 : item.quantity * item.originalPrice)), 0);
          this.$getService('dialogDiscount:open')('percentage', originalTotal);
        }
      },
      async generateTemplate() {
        const setting = await this.getPosSetting();
        this.listBtn = [];
        const paymentBtns = setting.paymentFunctionButtons;
        const containedBtns = paymentBtns.reduce((acc, btn) => ([...acc, ...btn.containedButtons]), []);
        for(const btn of paymentBtns) {
          if(!containedBtns.includes(btn._id)) {
            this.listBtn.push(btn);
          }
        }
      }
    },
    async mounted() {
      await this.generateTemplate();
    },
    async activated() {
      await this.generateTemplate();
    }
  }
</script>

<style scoped lang="scss">
  .controller {
    padding: 12px;

    .keyboard {
      ::v-deep .key {
        background: #FFFFFF;
        border: 1px solid #979797;
        box-sizing: border-box;
        border-radius: 2px;
        box-shadow: none;
        font-size: 20px;
        font-weight: 700;
        font-family: "Muli", sans-serif;
      }
    }
  }
</style>