<template>
  <div class="order-progress">
    <!-- dashed line -->
    <div class="order-progress__dashed-line"></div>
    <div class="order-progress__steps">
      <div v-if="receivedTime" class="order-progress__step">
        <div class="order-progress__step__icon">
          <img draggable="false" src="/plugins/pos-plugin/assets/order-progress--received.svg">
        </div>
        <span>Received</span>
        <span>{{ receivedTime | toTime }}</span>
      </div>
      <div v-if="preparingTime" class="order-progress__step">
        <div class="order-progress__step__icon">
          <img draggable="false" src="/plugins/pos-plugin/assets/order-progress--preparing.svg">
        </div>
        <span>Preparing</span>
        <span>{{ preparingTime | toTime }}</span>
      </div>
      <div v-if="cancelledTime" class="order-progress__step-cancelled">
        <div class="order-progress__step__icon">
          <img draggable="false" src="/plugins/pos-plugin/assets/order-progress--preparing.svg">
        </div>
        <span>Cancelled</span>
        <span>{{ cancelledTime | toTime }}</span>
      </div>
      <div class="order-progress__step">
        <div class="order-progress__step__icon">
          <img v-if="pickup" draggable="false" src="/plugins/pos-plugin/assets/order-progress--redy4pickup.svg">
          <img v-else draggable="false" src="/plugins/pos-plugin/assets/order-progress--completed.svg">
        </div>
        <span> {{ completedText }} </span>
        <span>{{ completedTime | toTime }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OrderProgress',
    props: {
      receivedTime: String,
      preparingTime: String,
      completedTime: String,
      cancelledTime: String,
      status: String,
      type: String,
    },
    filters: {
      toTime(val) {
        return dayjs(val).format('HH:mm')
      }
    },
    data: function () {
      return {}
    },
    computed: {
      completed() {
        return this.status === 'completed'
      },
      cancelled() {
        return this.status === 'declined'
      },
      preparing() {
        return this.status === 'kitchen'
      },
      pickup() {
        return this.type === 'pickup'
      },
      completedText() {
        return pickup ? 'Ready for pickup' : 'On the way'
      }
    },
    methods: {}
  }
</script>
<style scoped lang="scss">
  .order-progress {
    position: relative;
    
    &__dashed-line {
      height: 1px;
      width: 100%;
      border-top: 1px dashed gray;
      z-index: 0;
      position: absolute;
      top: 25px;
      left: 0;
    }
    
    &__steps {
      display: flex;
      justify-content: space-between;
    }
    
    &__step {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      
      &__icon {
        width: 55px;
        height: 55px;
        background: #536DFE;
        border-radius: 50%;
        text-align: center;
        line-height: 55px;
      }
    }
  }
</style>
