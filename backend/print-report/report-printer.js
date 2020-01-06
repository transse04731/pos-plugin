const fs = require('fs');
const Vue = require('vue');
const vueRuntimeHelpers = require('vue-runtime-helpers');
const PhantomUtil = require('./phantom-util');
const phantomUtil = new PhantomUtil();
const EscPrinter = require("./node-thermal-printer");
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync(`${__dirname}/template.html`, 'utf-8')
});

vueRuntimeHelpers.createInjector = vueRuntimeHelpers.createInjectorSSR;
global['vue'] = Vue;
global['vue-runtime-helpers'] = vueRuntimeHelpers;

module.exports = async (cms) => {
  cms.socket.on('connect', socket => {
    socket.on('printReport', handler)
  })

  async function handler(orderId, callback) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const order = await cms.getModel('Order').findById(orderId)

    if (!order) return

    const timeLocale = 'de-DE'

    const companyName = posSetting.companyInfo.name
    const companyAddress = posSetting.companyInfo.address
    const companyTel = posSetting.companyInfo.telephone
    const companyVatNumber = posSetting.companyInfo.taxNumber

    const orderDate = order.date.toLocaleDateString(timeLocale)
    const orderTime = order.date.toLocaleTimeString(timeLocale)
    const orderNumber = order.id
    const orderProductList = order.items
    // TODO: discount
    const orderSum = order.vSum
    const orderTax = order.vTax
    const orderTaxGroups = order.vTaxGroups
    const orderCashReceived = order.receive
    const orderCashback = order.cashback
    const orderPaymentType = order.payment[0].type
    const orderBookingNumber = order.bookingNumber

    const props = {
      companyName, companyAddress, companyTel, companyVatNumber, orderDate, orderTime, orderNumber, orderProductList,
      orderSum, orderTax, orderTaxGroups, orderCashReceived, orderCashback, orderPaymentType, orderBookingNumber
    }

    const ReportTest = require('../../dist/OrderReport.vue')

    const component = new Vue({
      components: {ReportTest},
      render(h) {
        return h('ReportTest', {props})
      }
    })

    renderer.renderToString(component, {}, async (err, html) => {
      if (err) callback(err)

      fs.writeFile(`${__dirname}/test.html`, html, 'utf-8', console.log);
      const png = await phantomUtil.render(html); //TODO: remove fs.writeFile in render when testing is done

      const printer = new EscPrinter({
        printerType: 'ip',
        ip: '192.168.10.60', //TODO: extract ip as constant
      });
      printer.printPng(png);
      await printer.print();
    })
  }
}
