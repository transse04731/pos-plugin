<template>
  <div class="function">
    <div v-for="(btn, i) in btns" :key="i"
         :style="getStyleBtn(btn)"
         class="function-btn"
         @click="changePath(btn.path)">
      <g-icon size="60">{{btn.icon}}</g-icon>
      <span class="mt-3 ta-center">{{btn.title}}</span>
    </div>
    <g-divider color="#9e9e9e" style="grid-area: divider"/>
  </div>
</template>

<script>
  export default {
    name: "PosDashboardFunction",
    data() {
      return {
        btns: [
          {title: 'Fast Checkout', icon: 'icon-fast-checkout', path: '/pos-order-2', area: 'btn1'},
          {title: 'Delivery', icon: 'icon-delivery', path: '/pos-delivery', area: 'btn2'},
          {title: 'Staff Report', icon: 'icon-staff-report', path: '/pos-staff-report', area: 'btn6'},
          {title: 'Settings', icon: 'icon-dashboard', path: '/pos-settings', area: 'btn7'},
          {title: 'End Of Day', icon: 'icon-calendar', path: '/pos-eod-report', area: 'btn8'},
          {title: 'Order History', icon: 'icon-history', path: '/pos-order-history', area: 'btn9'},
          {title: 'Month', icon: 'icon-month_report', path: '/pos-month-report', area: 'btn11'},
          {title: 'Support', icon: 'icon-support-2', path: '/pos-support', area: 'btn12'},
          {title: 'Edit Table Plan', icon: 'icon-edit-table-plan', path: '/pos-edit-table-plan', area: 'btn13'},
          {title: 'Edit Menu Card', icon: 'icon-edit-menu-card', path: '/pos-edit-menu-card', area: 'btn14'},
          {title: 'Printer Setting', icon: 'icon-printer-setting', path: '/pos-printer-setting', area: 'btn15'},
        ]
      }
    },
    methods: {
      getStyleBtn(btn) {
        return {
          'grid-area': btn.area
        }
      },
      changePath(path) {
        if(path)
          this.$router.push({path})
      }
    }
  }
</script>

<style scoped lang="scss">
  .function {
    display: grid;
    width: 100%;
    height: 100%;
    background-image: url("/plugins/pos-plugin/assets/out.png");
    grid-template-areas: "btn1 btn2 btn3 btn4 btn5" "divider divider divider divider divider" "btn6 btn7 btn8 btn9 btn10" "btn11 btn12 btn13 btn14 btn15";
    grid-template-rows: 1fr 1px 1fr 1fr;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 40px 10px;
    padding: 24px;

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
