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
    }
  ]
};