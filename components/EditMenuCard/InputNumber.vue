<template>
  <div class="input-number" :style="inputNumberStyle">
    <div class="input-number__dec" @click="dec">-</div>
    <div class="input-number__value">{{ internalValue }}</div>
    <div class="input-number__inc" @click="inc">+</div>
  </div>
</template>
<script>
  export default {
    name: 'InputNumber',
    props: {
      label: String,
      value: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      min: {
        type: Number,
        default: 0
      },
      width: [String, Number]
    },
    data: function () {
      return {
        internalValue: this.value || 0
      }
    },
    computed: {
      inputNumberStyle() {
        if (this.width)
          return {
            width: `${this.width}px`
          }
      }
    },
    watch: {
      value(newVal) {
        this.internalValue = newVal
      }
    },
    created() {
      if (this.value < this.min || this.value > this.max)
        throw 'Value out of range'
    },
    methods: {
      inc() {
        if (this.internalValue + 1 <= this.max)
          this.internalValue++;
        this.emitChange()
      },
      dec() {
        if (this.internalValue - 1 >= this.min)
          this.internalValue--;
        this.emitChange()
      },
      emitChange() {
        this.$emit('input', this.internalValue)
      }
    }
  }
</script>
<style scoped lang="scss">
  $foreColor: #979797;

  .input-number {
    border: 1px solid $foreColor;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    height: 40px;
    line-height: 40px;

    &__value {
      font-family: Muli;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      color: #000;
      flex: 1;
    }

    %btnWidth {
      width: 30px;
      cursor: pointer;

      &--disabled {
        pointer-events: none;
      }
    }

    &__dec {
      @extend %btnWidth;
      border-right: 1px solid $foreColor;
      color: $foreColor;
    }

    &__inc {
      @extend %btnWidth;
      border-left: 1px solid $foreColor;
      color: $foreColor;
    }
  }
</style>
