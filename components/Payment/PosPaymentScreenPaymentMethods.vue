<template>
  <div>
    <g-grid-select return-object :grid="false" :items="listPayments" v-model="activePaymentMethod" mandatory>
      <template #default="{toggleSelect, item, index}">
        <g-btn :uppercase="false" x-large outlined text-color="#1271ff"
               @click.stop="toggleSelect(item)"
               style="flex-basis: 30%; margin: 0 0 12px 12px">
          <img :src="item.icon" style="width: 20px; height: 20px"/>
          <span class="ml-2 text-black">{{item.name | capitalize}}</span>
        </g-btn>
      </template>
      <template #selected="{toggleSelect, item, index}">
        <g-btn :uppercase="false" x-large flat background-color="blue accent 3" text-color="white"
               @click.stop="toggleSelect(item)"
               style="flex-basis: 30%; margin: 0 0 12px 12px">
          <img :src="item.icon" style="width: 20px; height: 20px"/>
          <span class="ml-2">{{item.name | capitalize}}</span>
        </g-btn>
      </template>
    </g-grid-select>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenPaymentMethods',
    injectService: [
      'PosStore:currentOrder',
      'PosStore:listPayments',
      'PosStore:getListPayments',
      'PosStore:selectedPayment',
    ],
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    data() {
      return {
      }
    },
    async created() {
      await this.getListPayments();
      this.activePaymentMethod = this.listPayments[0]
    },
    async activated(){
      this.activePaymentMethod = this.listPayments[0]
    },
    computed: {
      activePaymentMethod: {
        get() {
          return this.selectedPayment
        },
        set(val) {
          this.selectedPayment = val
          if(this.selectedPayment)
            this.currentOrder.payment = { type: this.selectedPayment.name }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .main {
    display: flex;
    flex-grow: 1;
    flex-basis: 0;
    padding: 12px 0;

    .g-row {
      align-content: flex-start;
    }
  }
</style>

<style lang="scss">
  .payment {
    .layout__right {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    }
  }
</style>