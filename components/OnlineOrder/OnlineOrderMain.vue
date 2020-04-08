<template>
  <div class="main">
    <g-row><g-btn @click="addOrder">Add order</g-btn></g-row>
    <div class="pending-orders pa-3">
      <div class="header mb-3">Pending Orders</div>
      <div class="content">
        <g-card elevation="0">
          <g-card-title>
            <span>No. 123</span>
            <g-spacer/>
            <span>15:45</span>
          </g-card-title>
          <g-card-text>
            <div>
              <span style="font-weight: 700;">Payment: </span>
              <span>Cash - $123</span>
            </div>
            <div>
              <span style="font-weight: 700;">Address: </span>
              <span>address</span>
            </div>
            <div>
              <span style="font-weight: 700;">Details: </span>
              <div class="pl-3">1x Banana</div>
              <div class="pl-3">1x Banana</div>
              <div class="pl-3">1x Banana</div>
            </div>
          </g-card-text>
          <g-card-actions>
            <g-btn flat style="border: 1px solid #C4C4C4;">No</g-btn>
            <g-btn flat style="flex-grow: 1; background: #E0E0E0;">Yes</g-btn>
          </g-card-actions>
        </g-card>

        <g-card elevation="0" v-for="order in pendingOrders">
          <g-card-title>
            <span>No. 123</span>
            <g-spacer/>
            <span>15:45</span>
          </g-card-title>
          <g-card-text>
            <div>
              <span style="font-weight: 700;">Payment: </span>
              <span></span>
            </div>
            <div>
              <span style="font-weight: 700;">Address: </span>
              <span></span>
            </div>
            <div>
              <span style="font-weight: 700;">Details: </span>
<!--              <div class="pl-3" v-for="item in order.items">{{item.quantity}}x {{item.name}}</div>-->
              <span>{{order}}</span>
            </div>
          </g-card-text>
          <g-card-actions>
            <g-btn flat style="border: 1px solid #C4C4C4;">No</g-btn>
            <g-btn flat style="flex-grow: 1; background: #E0E0E0;">Yes</g-btn>
          </g-card-actions>
        </g-card>
      </div>
    </div>
    <div class="kitchen-orders">
      <div class="header pa-3">Sent to kitchen</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OnlineOrderMain',
    props: {
      pendingOrders: Array,
      kitchenOrders: Array,
    },
    injectService: ['OrderStore:addOrder'],
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .main {
    background-image: url('/plugins/pos-plugin/assets/out.png');
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;

    .g-card {
      border-radius: 4px;
      border: solid #9e9e9e 0.05em;

      .g-btn {
        border-radius: 2px;
      }
    }
  }

  .pending-orders {
    width: 50%;
  }

  .kitchen-orders {
    width: 50%;
  }

</style>