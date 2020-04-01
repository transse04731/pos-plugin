<template>
  <div :class="csBtnClass" :style="csBtnStyle" @click.stop.prevent="() => $emit('click')">
    <slot name="icon"/>
    <span v-if="iconProvided" class="cs-btn__icon-margin"/>
    <slot/>
  </div>
</template>
<script>
  export default {
    name: 'CsBtn',
    props: {
      primary: Boolean,
      secondary: Boolean,
      light: Boolean,
      disabled: Boolean,
      width: [Number, String]
    },
    data: function () {
      return {}
    },
    computed: {
      csBtnClass() {
        return {
          'cs-btn': true,
          'cs-btn-normal': !this.primary && !this.secondary,
          'cs-btn-primary': this.primary,
          'cs-btn-secondary': this.secondary,
          'cs-btn-light': this.light,
          'cs-btn-disabled': this.disabled
        }
      },
      csBtnStyle() {
        const style = {}
        if (this.width)
          style.width = `${this.width}px`
        return style
      },
      iconProvided() {
        return this.$slots.icon !== undefined && this.$slots.default !== undefined
      }
    },
    methods: {}
  }
</script>
<style scoped lang="scss">
  .cs-btn {
    box-sizing: border-box;
    outline: none;
    height: 45px;
    border-radius: 4px;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 145px;
    background: linear-gradient(180deg, #FFFFFF 38.92%, rgba(255, 255, 255, 0.78) 100%), #C4C4C4;
    border: 1.5px solid #E0E0E0;
    color: #616161;
    font-weight: 600;
    text-align: center;
    font-size: 15px;

    &:hover {
      cursor: pointer;
    }

    &-light {
      background: #FFF;
      border: 1.5px solid transparent;
      color: #212121;
    }

    &-secondary {
      border: 1.5px solid #536DFE;
      background: #FFF;
      color: #536DFE;
      &:hover {
        background-color: #E3F2FD;
      }
    }

    &-primary {
      border: 1.5px solid #536DFE;
      background: #536DFE;
      color: #E3F2FD;
    }

    &__icon-margin {
      margin-right: 10px;
    }

    &-disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
