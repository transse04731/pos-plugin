<template>
  <div class="order-progress">
    <div class="order-progress__circular">
      <g-progress-circular v-if="inprogress" :rotate="-90" size="80" width="40" :value="progress" color="#536DFE"/>
      <div v-else :style="actResultDivStyle">
        <img draggable="false" v-if="confirmed" src="/plugins/pos-plugin/assets/order-progress--confirmed.svg">
        <img draggable="false" v-else-if="cancelled" src="/plugins/pos-plugin/assets/order-progress--cancelled.svg">
      </div>
    </div>
    <div style="font-size: 18px; margin-top: 13px; margin-bottom: 30px; max-width: 350px">
      <div v-if="inprogress">Please wait while we proceed your order!</div>
      <div v-else-if="confirmed">
        <div>Your order is confirmed for </div>
        <div style="font-weight: bold">{{ deliveryTime }}</div>
      </div>
      <div v-else-if="cancelled">
        <div style="color: #E57373">Sorry, your order has been cancelled!</div>
        <div style="color: #747474">Reason: {{ cancelledReason }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OrderProgress',
    props: {
      deliveryTime: String,
      cancelledReason: String
    },
    data: function () {
      return {
        orderProcessTimeOut: 300, // 5 minutes
        waited: 0,
        status: 'inProgress' // kitchen, declined, completed
      }
    },
    computed: {
      progress() {
        return Math.floor(100 * this.waited / this.orderProcessTimeOut)
      },
      inprogress() {
        return this.status === 'inProgress'
      },
      confirmed() {
        return this.status === 'kitchen'
      },
      cancelled() {
        return this.status === 'declined' || this.waited > this.orderProcessTimeOut
      },
      actResultDivStyle() {
        return {
          width: '80px',
          height: '80px',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'border-radius': '50%',
          'background-color': this.confirmed ? '#536DFE' : '#E57373',
        }
      }
    },
    created() {
      this.intervalId = setInterval(() => {
        this.waited++
        if (this.waited > this.orderProcessTimeOut)
          clearInterval(this.intervalId)
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.intervalId)
    },
    methods: {}
  }
</script>
<style scoped lang="scss">
  .order-progress {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &__circular {
      padding: 4px;
      background-color: #EEEEEE;
      border-radius: 50%;
      display: inline-block;
    }
  }
  
  ::v-deep {
    .g-progress-circular__underlay {
      stroke: transparent;
    }
  }
</style>
