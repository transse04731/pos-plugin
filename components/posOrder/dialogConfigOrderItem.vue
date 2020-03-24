<template>
  <dialog-form-input v-model="dialogConfigOrderItem" width="90%" eager @submit="addModifier">
    <template v-slot:input>
      <g-tabs v-model="tab" :items="tabItems" text-color="#1d1d26" color="white" active-text-color="#1d1d26"
              slider-color="#1471ff" slider-size="3">
        <g-tab-item :item="tabItems[0]">
          <div class="modifier-content">
            <g-text-field-bs large v-model="modifier" label="Modifier" placeholder="Name"/>
            <g-text-field-bs :rules="rules" large v-model="price" label="Price" placeholder="Price"/>
          </div>
        </g-tab-item>
      </g-tabs>
    </template>
  </dialog-form-input>
</template>

<script>
  export default {
    name: "dialogConfigOrderItem",
    props: {
      value: null,
    },
    data() {
      return {
        tab: null,
        tabItems: [
          {title: 'Modifier'}
        ],
        modifier: '',
        price: '',
        rules: [
          val => !isNaN(val) || 'Please enter a number!!'
        ]
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
        if(this.modifier && this.price && !isNaN(this.price))
          this.$emit('addmodifier', {name: this.modifier, price: +this.price})
        this.dialogConfigOrderItem = false
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
