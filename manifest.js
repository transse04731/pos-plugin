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
        type: 'vue-singleton'
      },
      path: 'components/test/TestSingleton.vue'
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
        type: 'backend-ssr'
      },
      path: 'components/Report/MonthReport.vue'
    },
    {
      loader: {
        type: 'backend-ssr'
      },
      path: 'components/Report/OrderReport.vue'
    },
    {
      loader: {
        type: 'backend-ssr'
      },
      path: 'components/Report/StaffReport.vue'
    },
    {
      loader: {
        type: 'backend-ssr'
      },
      path: 'components/Report/XReport.vue'
    },
    {
      loader: {
        type: 'backend-ssr'
      },
      path: 'components/Report/ZReport.vue'
    }
  ]
};
