<template>
  <div class="function">
    <div class="function--up" v-show="computedBtnGroup1.length" >
      <div v-for="(btn, i) in computedBtnGroup1" :key="`up_${i}`"
           class="function-btn"
           @click="changePath(btn.path)">
        <g-icon size="60">{{btn.icon}}</g-icon>
        <span class="mt-3 ta-center">{{btn.title}}</span>
      </div>
    </div>
    <g-divider color="#9e9e9e"/>
    <div class="function--down">
      <div v-for="(btn, i) in computedBtnGroup2" :key="`down_${i}`"
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
    props: {
      enabledFeatures: Array,
      user: null
    },
    data() {
      const i18n = this.$i18n;
      const { dashboard: { delivery, editMenuCard, editTablePlan, endOfDay, fastCheckout, monthlyReport, orderHistory, printerSettings, settings, staffReport, support } } = i18n.messages[i18n.locale] || i18n.messages[i18n.fallbackLocale]

      return {
        btnUp: [
          {title: fastCheckout, feature: 'fastCheckout',icon: 'icon-fast-checkout', path: '/pos-order-2'},
          {title: delivery, feature: 'delivery', icon: 'icon-delivery', path: '/pos-delivery'}
        ],
        btnDown: [
          {title: staffReport, feature: 'staffReport', icon: 'icon-staff-report', path: '/pos-staff-report'},
          {title: settings, feature: 'settings', icon: 'icon-dashboard', path: '/pos-settings'},
          {title: endOfDay, feature:'eodReport', icon: 'icon-calendar', path: '/pos-eod-report'},
          {title: orderHistory, icon: 'icon-history', path: '/pos-order-history'},
          {title: monthlyReport, feature: 'monthlyReport', icon: 'icon-month_report', path: '/pos-month-report'},
          {title: support, icon: 'icon-support-2', path: '/pos-support'},
          {title: editTablePlan, feature: 'editTablePlan', icon: 'icon-edit-table-plan', path: '/pos-edit-table-plan'},
          {title: editMenuCard, feature: 'editMenuCard', icon: 'icon-edit-menu-card', path: '/pos-edit-menu-card'},
          {title: printerSettings, feature: 'printerSettings', icon: 'icon-printer-setting', path: '/pos-printer-setting'},
        ]
      }
    },
    computed: {
      computedBtnGroup1() {
        if (!this.enabledFeatures || !this.enabledFeatures.length) return

        return this.btnUp.filter(item => {
          if (!item.feature) return true
          return (this.enabledFeatures.includes(item.feature))
        })
      },
      computedBtnGroup2() {
        if (!this.enabledFeatures || !this.enabledFeatures.length) return

        return this.btnDown.filter(item => {
          if (!item.feature) return true
          if (this.user && this.user.role !== 'admin')
            if (item.feature === 'settings' || item.feature === 'printerSettings') return false
          return (this.enabledFeatures.includes(item.feature))
        })
      },

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
      grid-template-columns: repeat(5, calc(20% - 8px));
      grid-column-gap: 10px;
      grid-row-gap: 40px;
    }

    &--up {
      grid-template-rows: 100%;
      margin-bottom: 40px;
      flex: 0 0 calc(33.33% - 40px);
    }

    &--down {
      grid-template-rows: repeat(2, calc(50% - 20px));
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
      padding: 0 8px;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

      & > span {
        word-break: break-word;
      }
    }
  }
</style>
