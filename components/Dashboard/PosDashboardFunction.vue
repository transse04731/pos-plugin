<template>
  <div class="function">
    <div class="function--up">
      <div v-for="(btn, i) in btnUp" :key="`up_${i}`"
           class="function-btn"
           @click="changePath(btn.path)">
        <g-icon size="60">{{btn.icon}}</g-icon>
        <span class="mt-3 ta-center">{{btn.title}}</span>
      </div>
    </div>
    <g-divider color="#9e9e9e"/>
    <div class="function--down">
      <div v-for="(btn, i) in btnDown" :key="`down_${i}`"
           class="function-btn"
           @click="changePath(btn.path)">
        <g-icon size="60">{{btn.icon}}</g-icon>
        <span class="mt-3 ta-center">{{btn.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PosDashboardFunction",
    data() {
      return {
        btnUp: [
          {title: 'Fast Checkout', icon: 'icon-fast-checkout', path: '/pos-order-2'},
          {title: 'Delivery', icon: 'icon-delivery', path: '/pos-delivery'}
        ],
        btnDown: [
          {title: 'Staff Report', icon: 'icon-staff-report', path: '/pos-staff-report'},
          {title: 'Settings', icon: 'icon-dashboard', path: '/pos-settings'},
          {title: 'End Of Day', icon: 'icon-calendar', path: '/pos-eod-report'},
          {title: 'Order History', icon: 'icon-history', path: '/pos-order-history'},
          {title: 'Month', icon: 'icon-month_report', path: '/pos-month-report'},
          {title: 'Support', icon: 'icon-support-2', path: '/pos-support'},
          {title: 'Edit Table Plan', icon: 'icon-edit-table-plan', path: '/pos-edit-table-plan'},
          {title: 'Edit Menu Card', icon: 'icon-edit-menu-card', path: '/pos-edit-menu-card'},
          {title: 'Printer Setting', icon: 'icon-printer-setting', path: '/pos-printer-setting'},
        ]
      }
    },
    methods: {
      changePath(path) {
        if(path)
          this.$router.push({path})
      }
    }
  }
</script>

<style scoped lang="scss">
  .function {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-image: url("/plugins/pos-plugin/assets/out.png");
    padding: 24px;

    &--up,
    &--down {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 10px;
      grid-row-gap: 40px;
    }

    &--up {
      grid-template-rows: 1fr;
      margin-bottom: 40px;
      flex: 0 0 calc(33.33% - 40px);
    }

    &--down {
      grid-template-rows: 1fr 1fr;
      margin-top: 40px;
      flex: 0 0 calc(66.67% - 40px)
    }

    &-btn {
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0 16px;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }
  }
</style>
