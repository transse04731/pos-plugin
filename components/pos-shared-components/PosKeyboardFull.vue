<template>
  <g-keyboard v-model="internalValue" :items="keyboardFull" :template="templateFull"></g-keyboard>
</template>

<script>
  export default {
    name: 'PosKeyboardFull',
    data() {
      return {
        keyboardFull: [
          { content: ['Tab'], img: '', style: 'grid-area: tab; background-color: #e0e0e0; font-size: 14px', action: (value) => (value + '  ') },
          { content: ['q', 'Q'], img: '', style: 'grid-area: q', action: (value, append) => (value + append) },
          { content: ['w', 'W'], img: '', style: 'grid-area: w', action: (value, append) => (value + append) },
          { content: ['e', 'E'], img: '', style: 'grid-area: e', action: (value, append) => (value + append) },
          { content: ['r', 'R'], img: '', style: 'grid-area: r', action: (value, append) => (value + append) },
          { content: ['t', 'T'], img: '', style: 'grid-area: t', action: (value, append) => (value + append) },
          { content: ['y', 'Y'], img: '', style: 'grid-area: y', action: (value, append) => (value + append) },
          { content: ['u', 'U'], img: '', style: 'grid-area: u', action: (value, append) => (value + append) },
          { content: ['i', 'I'], img: '', style: 'grid-area: i', action: (value, append) => (value + append) },
          { content: ['o', 'O'], img: '', style: 'grid-area: o', action: (value, append) => (value + append) },
          { content: ['p', 'P'], img: '', style: 'grid-area: p', action: (value, append) => (value + append) },
          {
            content: [''],
            img: 'delivery/key_delete',
            style: 'grid-area: del; background-color: #e0e0e0',
            action: (value) => value.substring(0, value.length - 1)
          },
          { content: ['Caps lock'], img: '', style: 'grid-area: caps; background-color: #e0e0e0; font-size: 14px' },
          { content: ['a', 'A'], img: '', style: 'grid-area: a', action: (value, append) => (value + append) },
          { content: ['s', 'S'], img: '', style: 'grid-area: s', action: (value, append) => (value + append) },
          { content: ['d', 'D'], img: '', style: 'grid-area: d', action: (value, append) => (value + append) },
          { content: ['f', 'F'], img: '', style: 'grid-area: f', action: (value, append) => (value + append) },
          { content: ['g', 'G'], img: '', style: 'grid-area: g', action: (value, append) => (value + append) },
          { content: ['h', 'H'], img: '', style: 'grid-area: h', action: (value, append) => (value + append) },
          { content: ['j', 'J'], img: '', style: 'grid-area: j', action: (value, append) => (value + append) },
          { content: ['k', 'K'], img: '', style: 'grid-area: k', action: (value, append) => (value + append) },
          { content: ['l', 'L'], img: '', style: 'grid-area: l', action: (value, append) => (value + append) },
          { content: [], img: 'delivery/key_enter', style: 'grid-area: enter; background-color: #e0e0e0', type: 'enter' },
          { content: [], img: 'delivery/key_shift', style: 'grid-area: shift1; background-color: #e0e0e0', type: 'shift', action: (isShift) => (!isShift) },
          { content: ['z', 'Z'], img: '', style: 'grid-area: z', action: (value, append) => (value + append) },
          { content: ['x', 'X'], img: '', style: 'grid-area: x', action: (value, append) => (value + append) },
          { content: ['c', 'C'], img: '', style: 'grid-area: c', action: (value, append) => (value + append) },
          { content: ['v', 'V'], img: '', style: 'grid-area: v', action: (value, append) => (value + append) },
          { content: ['b', 'B'], img: '', style: 'grid-area: b', action: (value, append) => (value + append) },
          { content: ['n', 'N'], img: '', style: 'grid-area: n', action: (value, append) => (value + append) },
          { content: ['m', 'M'], img: '', style: 'grid-area: m', action: (value, append) => (value + append) },
          { content: [','], img: '', style: 'grid-area: comma', action: (value) => (value + ',') },
          { content: ['.'], img: '', style: 'grid-area: dot', action: (value) => (value + '.') },
          { content: ['/'], img: '', style: 'grid-area: splash', action: (value) => (value + '/') },
          { content: [], img: 'delivery/key_shift', style: 'grid-area: shift2; background-color: #e0e0e0', type: 'shift', action: (isShift) => (!isShift) },
          { content: ['*#$'], img: '', style: 'grid-area: sym; background-color: #e0e0e0; font-size: 14px' },
          { content: ['&'], img: '', style: 'grid-area: amp', action: (value) => (value + '&') },
          { content: ['%'], img: '', style: 'grid-area: pct', action: (value) => (value + '%') },
          { content: ['€'], img: '', style: 'grid-area: pnd', action: (value) => (value + '€') },
          { style: 'grid-area: space', action: (value) => (value + ' ') },
          { content: ['@'], img: '', style: 'grid-area: at', action: (value) => (value + '@') },
          { content: ['EN'], img: '', style: 'grid-area: lang; background-color: #e0e0e0; font-size: 14px' },
          { content: ['&rarr;'], img: '', style: 'grid-area: rarr; background-color: #e0e0e0' },
          { content: ['&larr;'], img: '', style: 'grid-area: larr; background-color: #e0e0e0' },
          { content: ['7'], action: (value, append) => (value + append), style: 'grid-area: key7' },
          { content: ['8'], action: (value, append) => (value + append), style: 'grid-area: key8' },
          { content: ['9'], action: (value, append) => (value + append), style: 'grid-area: key9' },
          { content: ['4'], action: (value, append) => (value + append), style: 'grid-area: key4' },
          { content: ['5'], action: (value, append) => (value + append), style: 'grid-area: key5' },
          { content: ['6'], action: (value, append) => (value + append), style: 'grid-area: key6' },
          { content: ['1'], action: (value, append) => (value + append), style: 'grid-area: key1' },
          { content: ['2'], action: (value, append) => (value + append), style: 'grid-area: key2' },
          { content: ['3'], action: (value, append) => (value + append), style: 'grid-area: key3' },
          { content: ['0'], action: (value, append) => (value + append), style: 'grid-area: key0' },
          { content: ['.'], action: (value) => (value + '.'), style: 'grid-area: keyDot' },
        ],
        templateFull: 'grid-template-areas: "tab tab q q w w e e r r t t y y u u i i o o p p del del del del key7 key7 key8 key8 key9 key9" ' +
          '"caps caps caps a a s s d d f f g g h h j j k k l l enter enter enter enter enter key4 key4 key5 key5 key6 key6" ' +
          '"shift1 shift1 shift1 shift1 z z x x c c v v b b n n m m comma comma dot dot splash splash shift2 shift2 key1 key1 key2 key2 key3 key3" ' +
          '"sym sym amp amp pct pct pnd pnd space space space space space space space space space space at at lang lang larr larr rarr rarr key0 key0 key0 key0 keyDot keyDot";' +
          'grid-auto-columns: 1fr; grid-gap: 10px',
      }
    },
    props: {
      value: null,
    },
    computed: {
      internalValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    }
  }
</script>

<style scoped>
  .keyboard__template {
    height: 100%;
  }

  ::v-deep .key {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.216346);
    border-radius: 2px;
    font-size: 24px;
  }
</style>
