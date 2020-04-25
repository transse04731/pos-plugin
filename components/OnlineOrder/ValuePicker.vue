<template>
  <div class="picker-wrapper">
    <template v-for="item in values">
      <slot name="item" :item="item" :select="pickValue" :isSelected="isValueSelected">
        <g-btn-bs  @click.stop="pickValue(item)"
                   :class="[isValueSelected(item) ? 'selected' : null]"
                   border-color="#C4C4C4" text-color="black" width="40" height="30">
          {{item}}
        </g-btn-bs>
      </slot>
    </template>
    <g-text-field-bs ref="input" v-if="allowCustom" placeholder="Custom..." :value="inputValue" @input="pickCustomValue"></g-text-field-bs>
  </div>
</template>

<script>
  export default {
    name: 'ValuePicker',
    props: {
      values: Array,
      allowCustom: Boolean,
      value: null,
      defaultValue: null
    },
    data() {
      return {
        inputValue: ''
      }
    },
    methods: {
      pickValue(val) {
        if (this.allowCustom) {
          this.inputValue = null
        }
        this.$emit('input', val)
      },
      pickCustomValue(val) {
        this.$emit('input', val)
      },
      isValueSelected(val) {
        return this.value === val
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (!this.value && this.defaultValue) this.$emit('input', this.defaultValue)
      })
    }
  }
</script>

<style scoped lang="scss">
  .picker-wrapper {
    .selected {
      background: #E3F2FD !important;
      border: 1px solid #90CAF9 !important;
    }

    .bs-tf-wrapper {
      margin-left: 8px;
    }
  }
</style>
