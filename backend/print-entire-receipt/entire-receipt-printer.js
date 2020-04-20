const Vue = require('vue');
const _ = require('lodash');
const {renderer, print, groupArticles, getPrinter} = require('../print-utils/print-utils');

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printEntireReceipt', async function ({order, device}, callback) {
      try {
        const results = await printHandler(order, device)
        callback({success: true, results})
      } catch (e) {
        callbackWithError(callback, e)
      }
    })
  })

  async function printHandler(order, device) {
    // get device printers
    const groupPrinters = await cms.getModel('GroupPrinter').aggregate([
      {$unwind: {path: '$printers'}},
      {$match: {'printers.hardwares': device, 'type': 'entire'}},
    ])

    const _groupPrinters = _.reduce(groupPrinters, (acc, printer) => {
      const {includes, groupArticles: _groupArticles, oneReceiptForOneArticle} = printer.printers
      let items = order.items
      if (_groupArticles) items = groupArticles(items)

      items = _.filter(items, function ({groupPrinter, groupPrinter2}) {
        if (!groupPrinter) return
        if (!includes.length) return true
        return includes.includes(groupPrinter) || printer.printers.includes.includes(groupPrinter2)
      });

      if (oneReceiptForOneArticle) {
        _.forEach(items, function (article) {
          acc.push({...printer, items: [article]})
        })
      } else {
        acc.push({...printer, items})
      }

      return acc
    }, [])

    let results = []
    //render report
    await Promise.all(_.map(_groupPrinters, printer => {
      return new Promise(async resolve => {
        const props = {
          items: printer.items,
          table: order.table,
          // printer: printer.name, // not needed, these 2 depends on isKitchenReceipt (refer to Kitchen.vue)
          // user: _.last(order.user).name,
          time: dayjs(order.date).format('HH:mm'),
          fontSize: printer.printers.fontSize,
          marginTop: printer.printers.marginTop
        }

        const {escPOS} = printer.printers;

        if (escPOS) {
          results.push(await printEsc(props, printer));
        } else {
          results.push(await printSsr(props, printer));
        }

        resolve();
      })

    }))

    return results
  }

  async function printEsc(props, {printers: printerInfo}) {
    const printer = await getPrinter(printerInfo);
    const {items, table, time} = props;

    function convertMoney(value) {
      return !isNaN(value) ? value.toFixed(2) : value
    }

    printer.alignLeft();
    printer.setTextQuadArea();
    printer.bold(true);
    if (table) printer.println(`Table: ${table}`);

    printer.alignRight();
    printer.setTextNormal();
    printer.bold(true);
    printer.println(time);
    printer.drawLine();

    printer.setTextQuadArea();
    printer.alignLeft();
    items.forEach(item => {
      printer.setTextQuadArea();
      printer.bold(true);
      printer.printText(`${item.quantity} x ${item.id}. ${item.name}`);

      printer.setTextNormal();
      printer.bold(true);
      if (item.modifiers) item.modifiers.forEach(mod => {
        printer.text(`        * ${mod.name}`);
        if (mod.price) printer.text(` $${convertMoney(mod.price)}`);

        printer.newLine();
      });
      if (item.separate) printer.println('************************');
    });

    printer.drawLine();

    printer.setTextNormal();
    printer.bold(true);
    printer.alignCenter();
    printer.println('Entire Receipt');

    await printer.print();

    return {
      items: props.items,
      printer: printerInfo,
      name: printerInfo.name,
    }
  }

  function printSsr(props, printer) {
    return new Promise((resolve, reject) => {
      const KitchenReport = require('../../dist/Kitchen.vue')

      const component = new Vue({
        components: {KitchenReport},
        render(h) {
          return h('KitchenReport', {props})
        }
      });

      renderer.renderToString(component, {}, async (err, html) => {
        if (err) reject(err);
        await print(html, printer.printers);

        resolve({
          items: printer.items,
          printer: printer.printer,
          name: printer.name,
        });
      });
    });
  }

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}
