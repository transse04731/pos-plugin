<template>

</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PosOnlineOrderStore',
    domain: 'PosOnlineOrderStore',
    props: {},
    data: function () {
      return {
        orderItems: [],
        shippingFee: 1,
      }
    },
    computed: {},
    methods: {
      increaseOrAddNewItems(item) {
        const indexOfItem = _.findIndex(this.orderItems, i => i._id === item._id)
        console.log(indexOfItem)
        if (indexOfItem < 0) {
          this.orderItems.push({ ..._.cloneDeep(item), quantity: 1 })
        } else {
          this.orderItems[indexOfItem].quantity++
        }
      },
      decreaseOrRemoveItems(item) {
        const indexOfItem = _.findIndex(this.orderItems, i => i._id === item._id)
        if (indexOfItem < 0)
          return;
        if (this.orderItems[indexOfItem].quantity > 1)
          this.orderItems[indexOfItem].quantity--;
        else
          this.orderItems.splice(indexOfItem, 1)
      }
    },
    provide() {
      return {
        orderItems: this.orderItems,
        increaseOrAddNewItems: this.increaseOrAddNewItems,
        decreaseOrRemoveItems: this.decreaseOrRemoveItems
      }
    }
  }
</script>
