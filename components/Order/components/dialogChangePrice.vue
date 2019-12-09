<template>
  <g-dialog v-model="dialogChangePrice" overlay-color="#6b6f82" overlay-opacity="0.95" width="65%">
    <div class="dialog-change w-100" :style="[{background: showKeyboard ? 'white' : 'transparent'}]">
      <div class="dialog-change-content">
        <div class="header">
          <div class="header-side">
            <p style="padding-bottom: 9px">Original Price</p>
            <g-text-field read-only outlined :value="`€ ${activeProduct && activeProduct.originalPrice}`"></g-text-field>
          </div>
          <div class="header-side">
            <p style="padding-bottom: 9px">Effective Price</p>
            <g-text-field read-only outlined class="tf__effective" :value="`€ ${computedPrice}`"></g-text-field>
          </div>
        </div>
        <g-radio-group name="basic" v-model="changeType">
          <g-radio color="#1271ff" value="percentage" label="Discount by %"></g-radio>
          <div class="row-flex col-10 m-auto">
            <g-btn :uppercase="false" outlined :disabled="disabledPercent" @click="newPercent = 5">- 5%</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledPercent" @click="newPercent = 10">- 10%</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledPercent" @click="newPercent = 15">- 15%</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledPercent" @click="newPercent = 20">- 20%</g-btn>
            <g-text-field dense outlined
                          :disabled="disabledPercent"
                          v-model.number="newPercent"
                          style="flex-grow: 1"
                          placeholder="Other"
                          :prefix="newPercent ? '-' : ''"
                          :suffix="newPercent ? '%' : ''"
                          @focus="showKeyboard = true" @blur="showKeyboard = false"
                          :rules="[rulePercent.percent]"></g-text-field>
          </div>
          <g-radio color="#1271ff" value="amount" label="Discount by €"></g-radio>
          <div class="row-flex col-10 m-auto">
            <g-btn :uppercase="false" outlined :disabled="disabledAmount || activeProduct.originalPrice - 5 < 0" @click="newAmount = 5">- € 5</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledAmount || activeProduct.originalPrice - 10 < 0" @click="newAmount = 10">- € 10</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledAmount || activeProduct.originalPrice - 15 < 0" @click="newAmount = 15">- € 15</g-btn>
            <g-btn :uppercase="false" outlined :disabled="disabledAmount || activeProduct.originalPrice - 20 < 0" @click="newAmount = 20">- € 20</g-btn>
            <g-text-field dense outlined :disabled="disabledAmount" v-model.number="newAmount" style="flex-grow: 1" placeholder="Other" @focus="showKeyboard = true" @blur="showKeyboard = false"></g-text-field>
          </div>
          <g-radio color="#1271ff" value="new" label="New Price"></g-radio>
          <div class="m-auto col-10">
            <g-text-field type="number" dense outlined placeholder="New Price" v-model.number="newPrice" @focus="showKeyboard = true" @blur="showKeyboard = false" :disabled="disabledNew"></g-text-field>
          </div>
        </g-radio-group>
        <div class="action">
          <g-btn :uppercase="false" flat outlined @click="dialogChangePrice = false">Cancel</g-btn>
          <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" @click="changePrice">OK</g-btn>
        </div>
      </div>
      <div :style="[{visibility: showKeyboard ? 'visible' : 'hidden'}]" class="keyboard-wrapper">
        <pos-numpad/>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  import PosNumpad from '../../pos-shared-components/PosNumpad';

  export default {
    name: 'dialogChangePrice',
    components: { PosNumpad },
    injectService: ['PosStore:(activeProduct,convertMoney,calculateNewPrice)'],
    props: {
      value: Boolean,
      product: null,
    },
    data() {
      return {
        changeType: null,
        showKeyboard: false,
        newPrice: 0,
        newPercent: 0,
        newAmount: 0,
        rulePercent: {
          percent: value => (value < 100 && value > 0) || 'Input: 0 - 100',
        },
        showDialog: false
      }
    },
    computed: {
      computedPrice() {
        if (this.activeProduct) {
          return this.getNewPrice();
        }
        return 0
      },
      dialogChangePrice: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.showDialog = value
          this.$emit('input', value);
        }
      },
      disabledPercent() {
        return this.changeType !== 'percentage'
      },
      disabledAmount() {
        return this.changeType !== 'amount'
      },
      disabledNew() {
        return this.changeType !== 'new'
      },
    },
    watch: {
      value: val => {
        this.showDialog = val
      }
    },
    methods: {
      getNewPrice(update = false) {
        if (this.changeType === 'percentage') {
          return this.calculateNewPrice('percentage', this.newPercent, update)
        }
        if (this.changeType === 'amount') {
          return this.calculateNewPrice('amount', this.newAmount, update)
        }
        if (this.changeType === 'new') {
          return this.calculateNewPrice('new', this.newPrice, update)
        }
        return this.activeProduct.originalPrice
      },
      open(changeType) {
        if (changeType && typeof changeType === 'string') this.changeType = changeType
        this.dialogChangePrice = true
      },
      changePrice() {
        if (!this.activeProduct) {
          this.dialogChangePrice = false;
          return;
        }
        this.getNewPrice(true)
        this.dialogChangePrice = false;
      },
    }
  }
</script>

<style lang="scss">
  .dialog-change {
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    .dialog-change-content {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: inherit;
      padding: 24px 48px;

      .header {
        display: flex;
        margin-bottom: 16px;
        font-size: 13px;
        font-weight: 700;
        justify-content: center;

        .header-side {
          width: calc(41.6667% - 8px);
          margin: 0 8px;
        }

        .g-tf-wrapper {
          background-color: #F0F0F0;

          &.tf__effective input {
            color: #4CAF50;
            font-size: 24px;
          }

          input {
            font-size: 20px;
            line-height: 32px;
            font-weight: 700;
          }
        }
      }

      .g-tf-wrapper {
        margin: 0;

        &.g-tf-wrapper fieldset {
          border-radius: 2px;
        }

        &.g-tf-wrapper__disabled fieldset {
          opacity: 0.42;
        }

        input::placeholder {
          text-align: center;
          font-size: 18px;
        }

        input {
          text-align: center;
        }
      }

      div:not(.action) .g-btn {
        height: 42px !important;
      }

      .g-btn:not(:last-child) {
        margin-right: 8px;
      }

      .g-radio-wrapper {
        line-height: 12px;
        margin: 16px 24px;

        .g-radio {
          display: inline-flex;
        }

        .g-radio-label {
          margin-left: 0;
          font-size: 13px;
          line-height: 16px;
        }
      }

      .action {
        display: flex;
        justify-content: flex-end;
        padding-top: 16px;

        .g-btn {
          min-width: 120px !important;

          &.g-btn__outlined {
            border: 1px solid #979797;
            color: #1d1d26;
          }
        }
      }
    }

    .keyboard-wrapper {
      background-color: #bdbdbd;
      padding: 16px 180px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      margin-top: -16px;

      .key-number {
        padding: 10px 8px;
        background: #FFFFFF;
        border: 1px solid #979797;
        box-sizing: border-box;
        border-radius: 4px;
        font-family: "Muli", sans-serif;
      }
    }
  }
</style>