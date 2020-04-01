<template>
  <div class="cs-text">
    <div class="mb-2" style="font-size: 15px;">{{ label }}</div>
    <div class="cs-text__input row-flex align-items-center br-2">
      <cs-input ref="input" :type="internalType" :value="value" @input="oninput" @inputdebounce="onInputDebounce" :placeholder="internalPlaceHolder" @enterpressed="onenter"/>
      <span v-if="password" class="cs-text__toggle">
        <img draggable="false" :src="toogleImageSource" @click="toggleShowHidePassword"/>
      </span>
    </div>
  </div>
</template>
<script>
  import CsInput from './CsInput';

  export default {
    name: 'CsText',
    components: { CsInput },
    props: {
      label: String,
      value: String,
      type: {
        type: String,
        default: 'text'
      },
      password: {
        type: Boolean,
        default: false
      },
      placeholder: String
    },
    data: function () {
      return {
        internalType: this.password ? 'password' : this.type,
        internalPlaceHolder: this.password ? null : this.placeholder
      }
    },
    computed: {
      toogleImageSource() {
        const image = this.internalType === 'password' ? 'hide' : 'show'
        return `/plugins/cloud-signage-plugin/assets/${image}-password.svg`
      }
    },
    methods: {
      oninput(value) {
        this.$emit('input', value)
      },
      onInputDebounce(value) {
        this.$emit('inputdebounce', value)
      },
      toggleShowHidePassword() {
        if (this.internalType === 'password')
          this.internalType = 'text'
        else
          this.internalType = 'password'
      },
      onenter() {
        this.$emit('enterpressed')
      }
    }
  }
</script>
<style scoped lang="scss">
 .cs-text {
   color: #343B3D;

   &__input {
     border: 1px solid #BDBDBD;
     height: 45px;
     padding: 10px;
     background-color: #FFFFFF;

     & > input {
       font-style: normal;
       font-weight: 300;
       font-size: 15px;
       width: 100%;
       border: none;
     }
   }

   &__toggle {
     height: 16px;
     width: 16px;
     line-height: 16px;
   }
 }
</style>
