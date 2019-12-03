<template>
  <div>
    <g-number-keyboard area="keyboard" :items="keyboard" :template="template" v-model="keyboardValue">
      <template v-slot:screen>
        <div></div>
      </template>
    </g-number-keyboard>
    <div class="disabled"></div>
    <div class="disabled"></div>
    <div class="disabled"></div>
    <div class="disabled"></div>
    <g-btn outlined height="100%" text-color="#979797">
      <span style="color: #1c1c1c; font-size: 16px">Multiple Payment</span>
    </g-btn>
    <div class="disabled"></div>
    <g-btn flat background-color="blue darken 1" text-color="white" height="100%" @click.stop="pay">
      <span class="fs-large-2">Pay</span>
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenKeyboard',
    injectService: [
      'PosStore:(paymentAmountTendered,savePaidOrder)'
    ],
    data() {
      return {
        keyboard: [
          { content: ['7'], style: 'grid-area: key7', action: (value, append) => (value + append) },
          { content: ['8'], style: 'grid-area: key8', action: (value, append) => (value + append) },
          { content: ['9'], style: 'grid-area: key9', action: (value, append) => (value + append) },
          { content: ['€ 100'], style: 'grid-area: key100', action: (value) => (+value + 100) },
          { content: ['4'], style: 'grid-area: key4', action: (value, append) => (value + append) },
          { content: ['5'], style: 'grid-area: key5', action: (value, append) => (value + append) },
          { content: ['6'], style: 'grid-area: key6', action: (value, append) => (value + append) },
          { content: ['€ 50'], style: 'grid-area: key50', action: (value) => (+value + 50) },
          { content: ['1'], style: 'grid-area: key1', action: (value, append) => (value + append) },
          { content: ['2'], style: 'grid-area: key2', action: (value, append) => (value + append) },
          { content: ['3'], style: 'grid-area: key3', action: (value, append) => (value + append) },
          { content: ['€ 20'], style: 'grid-area: key20', action: (value) => (+value + 20) },
          { content: ['0'], style: 'grid-area: key0', action: (value, append) => (value + append) },
          { content: [','], style: 'grid-area: keyC', action: (value, append) => (value + append) },
          { img: 'delivery/key_delete', style: 'grid-area: keyD', action: (value) => (value && value.substring(0, value.length - 1)) },
          { content: ['€ 10'], style: 'grid-area: key10', action: (value) => (+value + 10) },
        ],
        template: 'grid-template-areas: "key7 key8 key9 key100" "key4 key5 key6 key50" "key1 key2 key3 key20" "key0 keyC keyD key10"; grid-auto-rows: 1fr; grid-auto-columns: 1fr; grid-gap: 6px'
      }
    },
    computed: {
      keyboardValue: {
        get() {
          return '' + this.paymentAmountTendered
        },
        set(value) {
          this.paymentAmountTendered = +value
        }
      }
    },
    methods: {
      async pay() {
        await this.savePaidOrder()
        await this.$router.push({ path: '/view/test-pos-order' })
      }
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
        border-radius: 6px;
        box-shadow: none;
        font-size: 20px;
        font-weight: 700;
        font-family: "Muli", sans-serif;
      }
    }

    div.disabled {
      background: #DFDFDF;
      opacity: 0.5;
      border: 1px solid #9B9B9B;
      border-radius: 6px;
    }
  }
</style>