const Vue = require('vue');
const _ = require('lodash');
const { renderer, print, groupArticles } = require('../print-utils/print-utils');

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printEntireReceipt', async function ({ order, device }, callback) {
      try {
        const results = await printHandler(order, device)
        callback({ success: true, results })
      } catch (e) {
        callbackWithError(callback, e)
      }
    })
  })

  async function printHandler(order, device) {
    // get device printers
    const groupPrinters = await cms.getModel('GroupPrinter').aggregate([
      { $unwind: { path: '$printers' } },
      { $match: { 'printers.hardwares': device, 'type': 'entire' } },
    ])

    const _groupPrinters = _.reduce(groupPrinters, (acc, printer) => {
      const { includes, groupArticles: _groupArticles, oneReceiptForOneArticle } = printer.printers
      let items = order.items
      if (_groupArticles) items = groupArticles(items)

      items = _.filter(items, function ({ groupPrinter, groupPrinter2 }) {
        if (!groupPrinter) return
        if (!includes.length) return true
        return includes.includes(groupPrinter) || printer.printers.includes.includes(groupPrinter2)
      });

      if (oneReceiptForOneArticle) {
        _.forEach(items, function (article) {
          acc.push({ ...printer, items: [article] })
        })
      } else {
        acc.push({ ...printer, items })
      }

      return acc
    }, [])

    let results = []
    //render report
    await Promise.all(_.map(_groupPrinters, (printer) => {
      return new Promise((resolve, reject) => {
        const ip  = printer.printers.ip

        const KitchenReport = require('../../dist/Kitchen.vue')
        const props = {
          items: printer.items,
          table: order.table,
          printer: printer.name,
          user: _.last(order.user).name,
          time: dayjs(order.date).format('HH:mm'),
          fontSize: printer.printers.fontSize,
          marginTop: printer.printers.marginTop
        }

        const component = new Vue({
          components: { KitchenReport },
          render(h) {
            return h('KitchenReport', { props })
          }
        })

        renderer.renderToString(component, {}, async (err, html) => {
          if (err) reject(err)
          await print(html, ip)

          results.push({
            items: printer.items,
            printer: printer.printer,
            name: printer.name,
            ip
          })
          resolve()
        })
      })

    }))

    return results
  }

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}