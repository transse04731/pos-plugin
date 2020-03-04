module.exports = {
  files: [
    {
      loader: {
        type: 'vue-singleton'
      },
      path: 'components/PosStore.vue',
    },
    {
      loader: {
        type: 'backend-api'
      },
      path: 'backend/print-report/report-printer.js',
      type: 'backend'
    },
    {
      loader: {
        type: 'css-loader'
      },
      path: 'style/pos.css'
    },
    {
      loader: {
        type: 'backend-api'
      },
      path: 'backend/initDemoData/initDemoData.js'
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'components/Report/MonthReport.vue'
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'components/Report/OrderReport.vue'
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'components/Report/StaffReport.vue'
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'components/Report/XReport.vue'
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'components/Report/ZReport.vue'
    }
  ]
};
