<template>
  <g-toolbar height="100%" elevation="0" color="#eee">
    <g-btn-bs icon="icon-back" @click="back">Back</g-btn-bs>
    <g-menu top nudge-top="5" v-model="showMenu">
      <template v-slot:activator="{toggleContent}">
        <g-btn-bs icon="icon-menu" @click="toggleContent">More</g-btn-bs>
      </template>
      <div class="col-flex bg-white">
        <g-btn-bs icon="icon-dinner_copy">More items</g-btn-bs>
        <g-btn-bs icon="icon-promotion">Discount</g-btn-bs>
      </div>
    </g-menu>
    <g-btn-bs icon="icon-cashier">Cashier drawer</g-btn-bs>
    <g-btn-bs icon="icon-printer-setting" @click.stop="print">Print</g-btn-bs>
    <g-spacer/>
    <g-btn-bs class="col-2" background-color="#4CAF50" :disabled="!enablePayBtn" @click.stop="quickCash(false)">Cash & Dine In</g-btn-bs>
    <g-btn-bs class="col-2" background-color="#4CAF50" :disabled="!enablePayBtn" @click.stop="quickCash(true)">Cash & Take Away</g-btn-bs>
    <g-btn-bs class="col-2" icon="icon-pay" :disabled="!enablePayBtn" @click="pay">Pay</g-btn-bs>
  </g-toolbar>
</template>

<script>
  export default {
    name: "PosQuickOrderToolbar",
    props: {
      currentOrder: null
    },
    data() {
      return {
        showMenu: false
      }
    },
    computed: {
      enablePayBtn() {
        if (this.currentOrder && this.currentOrder.items) return this.currentOrder.items.length > 0
      }
    },
    methods: {
      back() {
        this.$emit('resetOrderData')
        this.$router.push({path: '/view/pos-dashboard'})
      },
      pay() {
        this.$router.push({path: '/view/pos-payment'})
      },
      quickCash(isTakeout = false) {
        this.currentOrder.takeOut = isTakeout
        this.$emit('quickCash')
      },
      print() {
        this.$emit('printKitchen')
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-btn-bs {
    background-color: white;
    font-size: 14px;
  }
</style>
