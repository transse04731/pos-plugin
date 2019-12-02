<template>
  <g-dialog v-model="internalValue" width="70%">
    <div class="wrapper">
      <div class="header">
        <span>Price range filter</span>
        <g-icon @click="internalValue = false" size="20" svg>icon-close</g-icon>
      </div>
      <pos-range-slider :min="min" :max="max" v-model="filter"/>
      <div class="range-value">
        <span>{{min === 0 ? min : '€ ' + min}}</span>
        <span>€ {{max}}</span>
      </div>
      <div class="buttons">
        <g-btn text @click="internalValue = false" backgroundColor="#EFEFEF" text-color="#757575" width="120" style="margin-right: 8px">Cancel</g-btn>
        <g-btn text @click="submit" backgroundColor="#2979FF" text-color="#FFFFFF" width="120">OK</g-btn>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  import PosRangeSlider from '../pos-shared-components/POSInput/PosRangeSlider';

  export default {
    name: 'dialogAmountFilter',
    components: { PosRangeSlider },
    props: {
      min: {
        type: [Number, String],
        default: 0
      },
      max: {
        type: [Number, String],
        default: 500
      },
      value: null,
    },
    injectService: [
      'PosStore:orderHistoryFilters',
      'PosStore:getOrderHistory',
    ],
    data() {
      return {
        filter: [0, 0]
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value || false
        },
        set(value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      async submit() {
        const index = this.orderHistoryFilters.findIndex(f => f.title === 'Amount');
        const amountFilter = {
          title: 'Amount',
          text: this.filter[0] + ' - ' + this.filter[1],
          value: this.filter,
          property: 'vSum',
        };
        if (index > -1) {
          this.orderHistoryFilters.splice(index, 1, amountFilter);
        } else {
          this.orderHistoryFilters.unshift(amountFilter);
        }
        this.internalValue = false;
        await this.getOrderHistory();
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    width: 100%;
    background-color: #FFFFFF;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px 16px 48px 30px;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
  }

  .range-value {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0 30px;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 16px;
  }
</style>