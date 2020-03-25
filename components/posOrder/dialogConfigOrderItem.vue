<template>
  <dialog-form-input v-model="dialogConfigOrderItem" width="90%" eager @submit="submit">
    <template v-slot:input>
      <g-tabs v-model="tab" :items="tabItems" text-color="#1d1d26" color="white" active-text-color="#1d1d26"
              slider-color="#1471ff" slider-size="3">
        <g-tab-item :item="tabItems[0]">
          <div class="modifier-content">
            <g-text-field-bs required large v-model="modifier" label="Modifier" placeholder="Name"/>
            <g-text-field-bs required :rules="rules" large v-model="price" label="Price" placeholder="Price"/>
          </div>
        </g-tab-item>
        <g-tab-item :item="tabItems[1]">
          <change-value :change-type.sync="changeType" :original-value="originalValue" :new-value-editable="newValueEditable"
                        :new-value.sync="newValue" />
        </g-tab-item>
      </g-tabs>
    </template>
  </dialog-form-input>
</template>

<script>
  import ChangeValue from '../pos-shared-components/ChangeValue';

  export default {
    name: "dialogConfigOrderItem",
    components: { ChangeValue },
    props: {
      value: null,
      originalValue: Number,
    },
    data() {
      return {
        tab: null,
        tabItems: [
          {title: 'Modifier', event: 'addModifier'},
          {title: 'Discount', event: 'changePrice'}
        ],
        // add modifier
        modifier: '',
        price: '',
        rules: [
          val => !isNaN(val) || 'Please enter a number!!'
        ],

        // discount
        newValueEditable: true,
        changeType: 'percentage',
        newValue: 0
      }
    },
    computed: {
      dialogConfigOrderItem: {
        get() {
          return this.value
        },
        set(val) {
          this.modifier = ''
          this.price = ''
          this.$emit('input', val)
        }
      }
    },
    methods: {
      addModifier() {
        if (this.modifier && this.price && !isNaN(this.price))
          this.$emit('addModifier', {name: this.modifier, price: +this.price})
        this.dialogConfigOrderItem = false
      },
      changePrice() {
        this.$emit('changePrice', this.newValue)
        this.dialogConfigOrderItem = false
      },
      submit() {
        if (this.tab) {
          this[this.tab.event]()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .modifier-content {
    margin-top: 8px;

    ::v-deep .bs-tf-label {
      font-size: 16px;
    }
  }
</style>
