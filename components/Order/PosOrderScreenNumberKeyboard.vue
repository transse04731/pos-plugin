<template>
  <g-number-keyboard area="keyboard" v-model="number" :items="numpad_1" @submit="openDialogProductSearchResults">
    <template v-slot:screen>
      <div class="number-key-show ba-thin bg-grey-lighten-3" style="height: calc(16.6667% - 4px)">
        <input id="number_key_output" class="number-key-text col-12 self-center bg-transparent fs-large-2 fw-700 pl-2" style="border: none; outline: none" v-model="number">
      </div>
    </template>
  </g-number-keyboard>
</template>

<script>
  import GNumberKeyboard from 'pos-vue-framework/src/components/GKeyboard/GNumberKeyboard';
  export default {
    name: 'PosOrderScreenNumberKeyboard',
    components: { GNumberKeyboard },
    data() {
      return {
        number: '',
        numpad_1: [
          {
            content: ['7'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key7; border: 1px solid #979797'
          },
          {
            content: ['8'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key8; border: 1px solid #979797'
          },
          {
            content: ['9'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key9; border: 1px solid #979797'
          },
          {
            content: ['4'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key4; border: 1px solid #979797'
          },
          {
            content: ['5'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key5; border: 1px solid #979797'
          },
          {
            content: ['6'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key6; border: 1px solid #979797'
          },
          {
            content: ['1'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key1; border: 1px solid #979797'
          },
          {
            content: ['2'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key2; border: 1px solid #979797'
          },
          {
            content: ['3'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key3; border: 1px solid #979797'
          },
          {
            content: ['0'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key0; border: 1px solid #979797'
          },
          {
            content: ['00'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value, append) => (value + append),
            style: 'grid-area: key00; border: 1px solid #979797'
          },
          {
            content: ['x'],
            classes: 'key-number bg-white ba-blue-9 ba-thin',
            action: (value) => value.substring(0, value.length - 1),
            style: 'grid-area: keyX; border: 1px solid #979797'
          },
          { content: ['C'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: () => '0', style: 'grid-area: keyC; border: 1px solid #979797' },
          { content: ['&crarr;'], classes: 'key-number white', type: 'enter', action: () => null, style: 'grid-area: Enter; border: 1px solid #979797' }
        ]
      }
    },
    methods: {
      openDialogProductSearchResults() {
        this.$getService('dialogProductSearchResult:setActive')(true)
      }
    }
  }
</script>

<style scoped>

</style>