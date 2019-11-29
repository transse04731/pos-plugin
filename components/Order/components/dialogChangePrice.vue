<template>
  <g-dialog v-model="dialogChangePrice" overlay-color="#6b6f82" overlay-opacity="0.95" width="65%">
    <div class="dialog-change w-100" :style="[{background: showKeyboard ? 'white' : 'transparent'}]">
      <div class="dialog-change-content">
        <div class="header">
          <div class="col-5">
            <p>Original Price</p>
            <g-text-field read-only outlined :value="`€ ${activeProduct && activeProduct.originalPrice}`"/>
          </div>
          <div class="col-5">
            <p>Effective Price</p>
            <g-text-field read-only outlined class="tf__effective" :value="`€ ${computedPrice}`"/>
          </div>
        </div>
        <g-radio-group name="basic" v-model="changeType">
          <g-radio color="#1271ff" value="percentage" label="Discount by %"></g-radio>
          <div class="row-flex col-10 m-auto">
            <g-btn outlined :disabled="disabledPercent" @click="newPercent = 5">- 5%</g-btn>
            <g-btn outlined :disabled="disabledPercent" @click="newPercent = 10">- 10%</g-btn>
            <g-btn outlined :disabled="disabledPercent" @click="newPercent = 15">- 15%</g-btn>
            <g-btn outlined :disabled="disabledPercent" @click="newPercent = 20">- 20%</g-btn>
            <g-text-field dense outlined :disabled="disabledPercent" v-model="newPercent" style="flex-grow: 1" placeholder="Other" @focus="showKeyboard = true" @blur="showKeyboard = false" :rules="[rulePercent.percent]"></g-text-field>
          </div>
          <g-radio color="#1271ff" value="amount" label="Discount by €"></g-radio>
          <div class="row-flex col-10 m-auto">
            <g-btn outlined :disabled="disabledAmount" @click="newAmount = 5">- € 5</g-btn>
            <g-btn outlined :disabled="disabledAmount" @click="newAmount = 10">- € 10</g-btn>
            <g-btn outlined :disabled="disabledAmount" @click="newAmount = 15">- € 15</g-btn>
            <g-btn outlined :disabled="disabledAmount" @click="newAmount = 20">- € 20</g-btn>
            <g-text-field dense outlined :disabled="disabledAmount" v-model="newAmount" style="flex-grow: 1" placeholder="Other" @focus="showKeyboard = true" @blur="showKeyboard = false"></g-text-field>
          </div>
          <g-radio color="#1271ff" value="new" label="New Price"></g-radio>
          <div class="m-auto col-10">
            <g-text-field dense outlined placeholder="New Price" v-model="newPrice" @focus="showKeyboard = true" @blur="showKeyboard = false" :disabled="disabledNew"></g-text-field>
          </div>
        </g-radio-group>
        <div class="action">
          <g-btn flat background-color="#efefef" text-color="grey darken 1" @click="dialogChangePrice = false">Cancel</g-btn>
          <g-btn flat background-color="blue accent 3" text-color="white" @click="changePrice">OK</g-btn>
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
  import _ from 'lodash'

  export default {
    name: 'dialogChangePrice',
    components: { PosNumpad },
    injectService: ['PosStore:(activeTableProduct,currentOrder,convertMoney)'],
    props: {
      value: Boolean,
      product: null,
      //todo dynamic discount button value
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
      activeProduct: {
        get() {
          if (this.currentOrder && this.currentOrder.items.length > 0 && !_.isNil(this.activeTableProduct)) {
            return this.currentOrder.items[this.activeTableProduct]
          }
        }
      },
      computedPrice() {
        if (this.activeProduct) {
          if (this.changeType === 'percentage') {

            return (this.activeProduct.originalPrice * (100 - this.newPercent)) / 100
          }
          if (this.changeType === 'amount') return this.activeProduct.originalPrice - this.newAmount
          if (this.changeType === 'new') return parseFloat(this.newPrice)

          return this.activeProduct.originalPrice
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
      open(changeType) {
        if (changeType && typeof changeType === 'string') this.changeType = changeType
        this.dialogChangePrice = true
      },
      changePrice() {
        if (!this.activeProduct) {
          this.dialogChangePrice = false;
          return;
        }
        this.$set(this.activeProduct, 'price', this.computedPrice)
        this.$set(this.activeProduct, 'discount', this.activeProduct.originalPrice - this.computedPrice)
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

        .g-tf-wrapper {
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
        height: 44px !important;
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