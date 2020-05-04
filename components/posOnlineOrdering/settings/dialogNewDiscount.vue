<template>
  <g-dialog v-model="internalValue" width="666" eager>
    <div class="dialog">
      <div class="dialog__title">Add New Discount</div>
      <div class="dialog__content">
        <g-text-field-bs label="Name" v-model="name"/>
        <div class="row-flex">
          <div class="col-6">
            <p class="mt-1 ml-1 mb-2">Type</p>
            <div class="row-flex">
              <g-checkbox color="indigo accent-2" v-model="type" value="delivery" label="Delivery"/>
              <g-checkbox color="indigo accent-2" v-model="type" value="pickup" label="Pickup"/>
            </div>
          </div>
          <div class="col-6 row-flex">
            <div class="flex-equal">
              <g-select :items="amounts" v-model="amount.type" text-field-component="GTextFieldBs"
                        label="Amount"/>
            </div>
            <div class="col-3 pt-3" v-if="amount.type !== 'freeShipping'">
              <g-text-field-bs large v-model="amount.value"/>
            </div>
          </div>
        </div>
        <p class="mt-1 ml-1 mb-2">Condition</p>
        <div class="dialog__condition">
          <div>
            <g-checkbox color="indigo accent-2" v-model="condition.totalValue.active" label="Total value"/>
          </div>
          <div :class="['row-flex', 'br-2', 'b-grey', 'ba-thin', !condition.totalValue.active && 'disabled']">
            <div class="col-6 b-grey brw-thin row-flex align-items-center justify-center pa-2"
                 @click="toggleTotalValue()">
              <g-icon color="#212121" v-if="condition.totalValue.type === 'greater'" size="20">fas
                fa-greater-than-equal
              </g-icon>
              <g-icon color="#212121" v-if="condition.totalValue.type === 'less'" size="20">fas fa-less-than-equal
              </g-icon>
            </div>
            <div class="col-6 row-flex align-items-center justify-center">
              <input type="number" class="ta-center fw-700 fs-large" v-model="condition.totalValue.value"/>
            </div>
          </div>
          <div>
            <g-checkbox color="indigo accent-2" v-model="condition.time.active" label="Time period"/>
          </div>
          <div :class="['row-flex', 'br-2', 'b-grey', 'ba-thin', !condition.time.active && 'disabled']">
            <div class="col-6 b-grey brw-thin row-flex align-items-center justify-center pa-2">
              <g-date-picker-input class="date-picker" v-model="condition.time.fromDate" :max="condition.time.toDate"/>
            </div>
            <div class="col-6 row-flex align-items-center justify-center pa-2">
              <g-date-picker-input class="date-picker" v-model="condition.time.toDate" :min="condition.time.fromDate"/>
            </div>
          </div>
          <div>
            <g-checkbox color="indigo accent-2" v-model="condition.weekDay.active" label="Days of the week"/>
          </div>
          <div :class="['row-flex', 'br-2', 'flex-wrap', 'b-grey', 'ba-thin', !condition.weekDay.active && 'disabled']">
            <g-checkbox color="indigo accent-2" class="col-4" v-model="condition.weekDay.days" value="Mon"
                        label="Mon"/>
            <g-checkbox color="indigo accent-2" class="col-4" v-model="condition.weekDay.days" value="Thu"
                        label="Thu"/>
            <g-checkbox color="indigo accent-2" class="col-4" v-model="condition.weekDay.days" value="Sun"
                        label="Sun"/>
            <g-checkbox color="indigo accent-2" class="col-4" v-model="condition.weekDay.days" value="Tue"
                        label="Tue"/>
            <g-checkbox color="indigo accent-2" class="col-8" v-model="condition.weekDay.days" value="Fri"
                        label="Fri"/>
            <g-checkbox color="indigo accent-2" class="col-4" v-model="condition.weekDay.days" value="Wed"
                        label="Wed"/>
            <g-checkbox color="indigo accent-2" class="col-8" v-model="condition.weekDay.days" value="Sat"
                        label="Sat"/>
          </div>
          <div>
            <g-checkbox color="indigo accent-2" v-model="condition.zipCode.active" label="Zip code"/>
          </div>
          <div :class="[!condition.zipCode.active && 'disabled']">
            <g-combobox text-field-component="GTextFieldBs" deletable-chips multiple
                        v-model="condition.zipCode.code"/>
          </div>
          <div>
            <g-checkbox color="indigo accent-2" v-model="condition.coupon.active" label="Coupon"/>
          </div>
          <div :class="['row-flex', !condition.coupon.active && 'disabled']">
            <div class="flex-equal row-flex align-items-center justify-center">
              <g-text-field-bs v-model="condition.coupon.title"/>
            </div>
            <div class="col-3 row-flex align-items-center justify-end pr-2">No. of use</div>
            <div class="flex-equal row-flex align-items-center justify-center">
              <g-text-field-bs type="number" v-model="condition.coupon.numberUse"/>
            </div>
          </div>
        </div>
        <div class="dialog__action">
          <g-btn-bs width="100" large text-color="#424242" @click="close()">Cancel</g-btn-bs>
          <g-btn-bs width="100" large text-color="white" background-color="indigo-accent-2" @click="submit">Save
          </g-btn-bs>
        </div>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogNewDiscount",
    props: {
      value: Boolean,
      edit: Boolean,
      discount: Object
    },
    data() {
      return {
        name: '',
        type: [],
        amount: {
          type: '',
          value: 0,
        },
        condition: {
          totalValue: {
            active: false,
            type: 'greater',
            value: 0
          },
          time: {
            active: false,
            fromDate: '',
            toDate: ''
          },
          weekDay: {
            active: false,
            days: []
          },
          zipCode: {
            active: false,
            code: []
          },
          coupon: {
            active: false,
            title: '',
            numberUse: 0
          }
        },
        amounts: [
          {text: `Number (${$t('common.currency')})`, value: 'number'},
          {text: 'Percentage', value: 'percentage'},
          {text: 'Free shipping', value: 'freeShipping'}
        ]
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      toggleTotalValue() {
        if (this.condition.totalValue.type === 'greater') {
          this.condition.totalValue.type = 'less'
        } else if (this.condition.totalValue.type === 'less') {
          this.condition.totalValue.type = 'greater'
        }
      },
      close() {
        this.internalValue = false
      },
      submit() {
        const discount = {}
        this.$emit('submit', discount)
        this.close()
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog {
    width: 100%;
    background: white;
    border-radius: 4px;
    padding: 24px;
    color: #212121;

    &__title {
      font-weight: 600;
      font-size: 24px;
      margin-bottom: 16px;
    }

    &__condition {
      display: grid;
      grid-template-columns: 30% 70%;
      grid-template-rows: 45px 45px 108px 45px 45px;
      grid-gap: 8px;

      ::v-deep input {
        -moz-appearance: textfield;
        outline: none;
        user-select: text;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }

      .g-checkbox-wrapper {
        margin: 0;
        padding: 6px 4px;
      }

      .date-picker ::v-deep .g-tf {
        &:before, &:after {
          display: none;
        }

        .input > div {
          display: none;
        }
      }

      .g-combobox ::v-deep {
        .bs-tf-wrapper {
          margin: 0;
          width: 100%;

          .input {
            display: flex;
            flex-wrap: wrap;
            flex: 1 1 0;
            min-width: 0;
          }

          .bs-tf-input {
            min-width: 0;
            flex: 1;
            height: 40px;
          }
        }
      }

      .bs-tf-wrapper {
        margin: 0;
        width: 100%;
      }
    }

    &__action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .bs-tf-wrapper ::v-deep {
      .bs-tf-input {
        text-align: center;
        font-weight: 700;
        width: 100%;
      }
    }
  }
</style>
