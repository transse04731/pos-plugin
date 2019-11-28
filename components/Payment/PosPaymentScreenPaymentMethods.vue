<template>
  <div>
    <g-btn x-large flat background-color="blue accent 3" text-color="white">
      <g-icon svg>icon-cash</g-icon>
      <span class="ml-2">Cash</span>
    </g-btn>
    <g-btn x-large outlined text-color="#1271ff" class="ml-3">
      <g-icon svg>icon-credit_card</g-icon>
      <span class="ml-2 text-black">Card</span>
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenPaymentMethods',
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .main {
    flex-grow: 1;
    flex-basis: 0;
    padding: 12px;
    display: flex;
  }
</style>