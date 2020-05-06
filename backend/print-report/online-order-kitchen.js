const { convertHtmlToPng } = require('../print-utils/print-utils');
const vueSsrRenderer = require('../print-utils/vue-ssr-renderer');
const Vue = require('vue');
const dayjs = require('dayjs')

async function makePrintData(cms, { orderId }) {
  const order = await cms.getModel('Order').findById(orderId).lean();

  if (!order) return null;

  const {
    customer: { name, phone, address, zipCode },
    note,
    items,
    shippingFee,
    vSum: orderSum,
    date
  } = order;


  return {
    orderNumber: order.id,
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    customerZipCode: zipCode,
    note,
    items,
    shippingFee,
    orderSum,
    date: dayjs(date).format('MMM DD, YYYY, HH:mm')
  };
}

async function printEscPos(escPrinter, printData, groupPrinter) {
  const {
    orderNumber,
    customerName,
    customerPhone,
    customerAddress,
    customerZipCode,
    note,
    items,
    shippingFee,
    orderSum,
    date
  } = printData;

  let filteredItems = items.filter(item => item.groupPrinter === groupPrinter || item.groupPrinter2 === groupPrinter)
  if (!filteredItems.length) return

  escPrinter.alignCenter();
  escPrinter.setTextDoubleHeight();
  escPrinter.bold(true);
  escPrinter.println(`Liefer #${orderNumber}`)

  escPrinter.alignLeft()
  escPrinter.setTextNormal()
  escPrinter.println(customerName)
  customerAddress && escPrinter.println(customerAddress)
  customerZipCode && escPrinter.println(customerZipCode)
  escPrinter.println(customerPhone)
  note && escPrinter.println(note)
  escPrinter.newLine()

  escPrinter.bold(true);
  escPrinter.drawLine()
  filteredItems.forEach((item, index) => {
    escPrinter.bold(false);
    const quantityColumnWidth = item.quantity.toString().length * 0.05;
    const itemsColumnWidth = 0.92 - item.quantity.toString().length * 0.05;

    escPrinter.setTextQuadArea();
    escPrinter.tableCustom([
      {text: item.quantity, align: 'LEFT', width: quantityColumnWidth, bold: true},
      {text: 'x', align: 'LEFT', width: 0.05, bold: true},
      {text: `${item.id}. ${item.name}`, align: 'LEFT', width: itemsColumnWidth},
    ], {textDoubleWith: true});

    if (item.modifiers) {
      escPrinter.setTextNormal();
      escPrinter.setTextDoubleWidth();

      item.modifiers.forEach(mod => {
        let modifierText = `* ${mod.name}`

        escPrinter.tableCustom([
          {text: '', align: 'LEFT', width: quantityColumnWidth},
          {text: '', align: 'LEFT', width: 0.05},
          {text: modifierText, align: 'LEFT', width: itemsColumnWidth},
        ], {textDoubleWith: true});
      });
    }

    if (index < items.length - 1) {
      escPrinter.setTextNormal();
      escPrinter.newLine();
      escPrinter.newLine();
    }
  })
  escPrinter.setTextNormal()
  escPrinter.bold(true);
  escPrinter.drawLine()
  escPrinter.newLine()
  escPrinter.alignCenter()
  escPrinter.setTextNormal()
  escPrinter.println(date)

  await escPrinter.print()
}

async function printSsr(printer, printData, groupPrinter) {
  const KitchenDelivery = require('../../dist/KitchenDelivery.vue');

  let filteredItems = printData.items.filter(item => item.groupPrinter === groupPrinter || item.groupPrinter2 === groupPrinter)
  if (!filteredItems.length) return

  const component = new Vue({
    components: { KitchenDelivery },
    render(h) {
      return h('KitchenDelivery', {
        props: {
          ...Object.assign({}, printData, {
            items: filteredItems
          }),
          fontSize: printer.fontSize,
          marginTop: printer.marginTop
        }
      })
    }
  })

  vueSsrRenderer.renderToString(component, {}, async (err, html) => {
    if (err) throw err

    const reportPng = await convertHtmlToPng(html)
    printer.printPng(reportPng)
    await printer.print()
  })
}

module.exports = {
  makePrintData,
  printEscPos,
  printSsr
}
