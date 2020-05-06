const Vue = require('vue');
const _ = require('lodash')
const {renderer, print, getEscPrinter, getGroupPrinterInfo} = require('../print-utils/print-utils')

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printKitchen', async ({order, device}, callback) => {
      let results = []

      try {
        const groupPrinters = await getGroupPrinterInfo(cms, device, 'kitchen');
        const printerInfos = groupPrinters.map(e => {
          return {name: e.name, ...e.printers}
        })
        const receipts = getReceiptsFromOrder(order);

        for (const printerInfo of printerInfos) {
          const {escPOS} = printerInfo
          const receiptsForPrinter = await getReceiptsForPrinter(receipts, printerInfo);
          const printData = await getPrintData(receiptsForPrinter, order, printerInfo);

          if (escPOS) results.push(await printEscPos(printData, printerInfo));
          else results.push(await printSsr(printData, printerInfo));
        }

        callback({success: true, results});
      } catch (e) {
        console.error(e);
        callbackWithError(callback, e);
      }
    });
  });

  function getReceiptsFromOrder(order) {
    return _.reduce(order.items, function (obj, item) {
      function addItem(i) {
        if (!item.groupPrinter) return;

        const groupPrinter = i === 1 ? item.groupPrinter : item.groupPrinter2;
        if (!groupPrinter) return;

        const receiptKey = JSON.stringify({
          groupPrinter: groupPrinter,
          course: item.course,
          takeout: item.takeout
        })

        if (!obj[receiptKey]) obj[receiptKey] = [];

        if (!_.find(item.modifiers, m => m.groupPrinter && m.groupPrinter !== groupPrinter)) {
          obj[receiptKey].push(item);
        } else {
          // case modifiers have another groupPrinter
          const modifierGroup = _.groupBy(item.modifiers, i => i.groupPrinter ? i.groupPrinter : groupPrinter);
          for (let _groupPrinter in modifierGroup) {
            const _item = {
              ...item,
              groupPrinter: _groupPrinter,
              modifiers: modifierGroup[_groupPrinter]
            }

            const _receiptKey = JSON.stringify({
              groupPrinter: _groupPrinter,
              course: item.course,
              takeout: item.takeout
            })

            if (!obj[_receiptKey]) obj[_receiptKey] = [];

            obj[_receiptKey].push(_item);
          }
        }
      }

      [1, 2].forEach(addItem);
      return obj;
    }, {});
  }

  function getReceiptsForPrinter(receipts, printer) {
    return Object.keys(receipts)
        .filter(key => {
          const {groupPrinter} = JSON.parse(key);
          return printer.name === groupPrinter;
        })
        .map(key => receipts[key]);
  }

  async function getPrintData(receipts, order, printer) {
    return _.map(receipts, (value, key) => {
      const {course, takeout} = JSON.parse(key)

      return {
        items: value,
        table: order.table,
        printer: printer.name,
        user: _.last(order.user) && _.last(order.user).name,
        time: dayjs(order.date).format('HH:mm'),
        fontSize: printer.fontSize,
        marginTop: printer.marginTop,
        isKitchenReceipt: true,
        course,
        takeout
      };
    });
  }

  async function printEscPos(printData, printerInfo) {
    const results = [];

    await Promise.all(printData.map(props => {
      return new Promise(async resolve => {
        const printer = await getEscPrinter(printerInfo);
        const {items, table, user, time, isKitchenReceipt, course, takeout} = props;

        function convertMoney(value) {
          return !isNaN(value) ? value.toFixed(2) : value
        }

        printer.alignLeft();
        printer.setTextQuadArea();
        printer.bold(true);
        if (takeout) printer.println('TAKE AWAY');
        if (table) printer.println(`Table: ${table}`);

        printer.alignRight();
        printer.setTextNormal();
        printer.bold(true);
        printer.println(time);
        printer.drawLine();

        printer.alignLeft();
        items.forEach((item, index) => {
          printer.bold(false);
          const quantityColumnWidth = item.quantity.toString().length * 0.05;
          const itemsColumnWidth = 0.92 - item.quantity.toString().length * 0.05;

          printer.setTextQuadArea();
          printer.tableCustom([
            {text: item.quantity, align: 'LEFT', width: quantityColumnWidth, bold: true},
            {text: 'x', align: 'LEFT', width: 0.05, bold: true},
            {text: `${item.id}. ${item.name}`, align: 'LEFT', width: itemsColumnWidth},
          ], {textDoubleWith: true});

          if (item.modifiers) {
            printer.setTextDoubleWidth();

            item.modifiers.forEach(mod => {
              let modifierText = `* ${mod.name}`
              if (mod.price) modifierText += ` ${convertMoney(mod.price)}`;

              printer.tableCustom([
                {text: '', align: 'LEFT', width: quantityColumnWidth},
                {text: '', align: 'LEFT', width: 0.05},
                {text: modifierText, align: 'LEFT', width: itemsColumnWidth},
              ], {textDoubleWith: true});
            });
          }

          if (index < items.length - 1) {
            printer.setTextNormal();
            if (item.separate) {
              printer.println('************************');
            } else {
              printer.newLine();
              printer.newLine();
            }
          }
        });

        printer.setTextNormal();
        printer.bold(true);
        printer.drawLine();

        printer.setTextNormal();
        printer.bold(true);
        printer.alignCenter();
        if (course && course > 1) printer.println(`Course ${course}`);
        if (isKitchenReceipt) printer.println(`${printerInfo.name} Printer${user ? ` - ${user}` : ''}`);
        else printer.println('Entire Receipt');

        await printer.print();

        results.push({
          items: props.items,
          printer: printerInfo,
          name: printerInfo.name,
        });
        resolve();
      });
    }));

    return results;
  }

  async function printSsr(printData, printerInfo) {
    const results = [];

    await Promise.all(printData.map(props => {
      return new Promise((resolve, reject) => {
        const KitchenReport = require('../../dist/Kitchen.vue')

        const component = new Vue({
          components: {KitchenReport},
          render(h) {
            return h('KitchenReport', {props})
          }
        })

        renderer.renderToString(component, {}, async (err, html) => {
          if (err) reject(err);
          await print(html, printerInfo);

          results.push({
            items: props.items,
            printer: printerInfo,
            name: printerInfo.name,
          });
          resolve();
        })
      });
    }));

    return results;
  }

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}
