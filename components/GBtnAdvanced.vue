<template>
  <g-btn :width="buttonWidth" :height="buttonHeight" :background-color="buttonBgColor" :text-color="buttonTextColor">
    <g-icon :size="iconSize" :svg="iconSvg">{{props.textValue}}</g-icon>
    {{props.text}}
  </g-btn>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'GBtnAdvanced',
    components: { GIcon, GBtn },
    props: {
      icon: String,
      iconSize: String,
      buttonWidth: [String, Number],
      buttonHeight: [String, Number],
      buttonBgColor: String,
      buttonTextColor: String,
      textValue: String,
      iconSvg: Boolean
    }
  }
</script>

<style scoped>

</style>
