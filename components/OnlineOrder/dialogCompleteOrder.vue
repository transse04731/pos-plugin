<template>
  <g-dialog v-if="order" v-model="dialog" width="50%">
    <g-card>
      <g-card-title>Order Details</g-card-title>
      <g-card-text>
        <g-icon v-if="order.type === 'delivery'">icon-delivery-man</g-icon>
        <g-icon v-if="order.type === 'pickup'">icon-pickup</g-icon>
        <span class="fs-small-2 ml-1">
          <span class="text-indigo-accent-2">#{{order.id}}</span>
          {{order.customer ? order.customer.name : 'No customer name'}} - {{order.customer ? order.customer.phone : 'No customer phone'}}
        </span>
        <g-spacer/>
        <span class="fw-700 fs-small">{{order.date}}</span>

        <div class="row-flex" v-if="order.customer">
          <div class="col-1">
            <g-icon color="#9E9E9E" size="20">icon-place</g-icon>
          </div>
          <div class="col-10">{{`${order.customer.address} ${order.customer.zipCode}`}}</div>
        </div>

        <div v-if="order.items">
          <div class="row-flex" v-for="item in order.items">
            <div class="col-1 fw-700">{{item.quantity}}x</div>
            <div class="col-8 fs-small-2">
              {{item.name}}
              <template v-if="item.modifiers.length > 0">
                <span class="i text-grey">(<span v-for="modifier in item.modifiers">{{modifier}}</span>)</span>
              </template>
            </div>
            <div class="col-3 fs-small-2 ta-right">€{{item.price.toFixed(2)}}</div>
          </div>
        </div>

        <g-divider dashed/>
        <div class="row-flex">
          <div>Total</div>
          <g-spacer/>
          <div>{{order.vSum}}</div>
        </div>
      </g-card-text>
      <g-card-actions>
        <g-btn-bs background-color="#E57373" text-color="white" @click.stop="declineOrder(order)">Cancel & move to declined orders</g-btn-bs>
        <g-btn-bs background-color="#4CAF50" text-color="white" @click.stop="setPendingOrder(order)">Return to pending orders</g-btn-bs>
        <g-btn-bs background-color="#2979FF" text-color="white" @click.stop="completeOrder(order)">Complete order & Print receipt</g-btn-bs>
      </g-card-actions>
    </g-card>
  </g-dialog>
</template>

<script>
  export default {
    name: 'dialogCompleteOrder',
    props: {
      value: Boolean
    },
    data() {
      return {
        order: null
      }
    },
    computed: {
      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      showDialog(order) {
        if (order) {
          this.order = order
          this.dialog = true
        }
      },
      declineOrder(order) {
        this.$emit('declineOrder', order)
        this.dialog = false
      },
      setPendingOrder(order) {
        this.$emit('setPendingOrder', order)
        this.dialog = false
      },
      completeOrder(order) {
        this.$emit('completeOrder', order)
        this.dialog = false
      }
    }
  }
</script>

<style scoped>

</style>
