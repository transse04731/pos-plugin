const Vue = require('vue');
const dayjs = require('dayjs');
const _ = require('lodash');
const {renderer, print, getPrinter, getGroupPrinterInfo} = require('../print-utils/print-utils');

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printReport', async (reportType, args, device, callback) => {
      try {
        if (reportType === 'OrderReport') {
          const groupPrinters = await getGroupPrinterInfo(cms, device, 'invoice');

          for (const groupPrinter of groupPrinters) {
            const {escPOS} = groupPrinter.printers

            if (escPOS) {
              const printData = await getOrderReportData(args);
              const printer = await getPrinter(groupPrinter.printers);
              await printEscPos(printer, printData, reportType);
            } else {
              const printComponent = await getOrderReportComponent(args);
              renderer.renderToString(printComponent, {}, async (err, html) => {
                if (err) throw err;
                await print(html, groupPrinter.printers);
              });
            }
          }

          callback({success: true});
        } else {
          // TODO: support ESC mode for the other reports
          const reportComponent = await reportHandler(reportType, args)
          if (!reportComponent) return
          await printReport(reportComponent, device)
          callback({ success: true })
        }
      } catch (e) {
        console.error(e);
        callbackWithError(callback, e);
      }
    })
  });

  async function printEscPos(printer, printData, reportType) {
    if (reportType === 'OrderReport') {
      const {
        companyName,
        companyAddress,
        companyTel,
        companyVatNumber,
        orderDate,
        orderTime,
        orderNumber,
        orderProductList,
        orderSum,
        orderTax,
        orderTaxGroups,
        orderCashReceived,
        orderCashback,
        orderPaymentType,
        orderBookingNumber,
        discount
      } = printData;

      function convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      }

      printer.alignCenter();
      printer.setTextDoubleHeight();
      printer.bold(true);
      printer.println(companyName);

      printer.bold(false);
      printer.setTextNormal();
      printer.println(companyAddress);
      printer.println(`Tel: ${companyTel}`);
      printer.println(`VAT Reg No: ${companyVatNumber}`);

      printer.newLine();
      printer.setTextDoubleHeight();
      printer.bold(true);
      printer.println('Invoice');

      printer.newLine();
      printer.bold(false);
      printer.setTextNormal();
      printer.alignLeft();
      printer.println(`Date: ${orderDate}`);
      printer.println(`Time: ${orderTime}`);
      printer.println(`Invoice No: ${orderNumber}`);

      printer.newLine();
      printer.bold(true);
      printer.tableCustom([
        {text: 'Item', align: 'LEFT', width: 0.4},
        {text: 'Q.ty', align: 'RIGHT', width: 0.1},
        {text: 'Unit price', align: 'RIGHT', width: 0.25},
        {text: 'Total', align: 'RIGHT', width: 0.22},
      ]);
      printer.drawLine();

      printer.bold(false);
      orderProductList.forEach(product => {
        printer.tableCustom([
          {text: product.name, align: 'LEFT', width: 0.4},
          {text: product.quantity, align: 'RIGHT', width: 0.1},
          {text: convertMoney(product.originalPrice), align: 'RIGHT', width: 0.25},
          {text: convertMoney(product.quantity * product.originalPrice), align: 'RIGHT', width: 0.22},
        ]);
      });
      printer.drawLine();

      printer.leftRight('Subtotal', convertMoney(orderSum - orderTax));
      if (!isNaN(discount) && discount > 0) printer.leftRight('Discount', convertMoney(discount));
      orderTaxGroups.forEach(taxGroup => {
        printer.leftRight(`Tax (${taxGroup.taxType}%)`, convertMoney(taxGroup.tax));
      });
      printer.drawLine();

      printer.bold(true);
      printer.leftRight('Total', `$${convertMoney(orderSum)}`);
      printer.bold(false);
      printer.leftRight('Cash tend', `$${convertMoney(orderCashReceived)}`);
      printer.drawLine();

      printer.bold(true);
      printer.leftRight('Change due', `$${convertMoney(orderCashback)}`);
      printer.alignLeft();
      printer.bold(false);
      printer.println(`Payment method: ${orderPaymentType.charAt(0).toUpperCase() + orderPaymentType.slice(1)}`);
      printer.newLine();

      printer.alignCenter();
      // printer.printBarcode(orderBookingNumber);
      printer.println(`Invoice ID: ${orderBookingNumber}`);
      printer.newLine();
      printer.bold(true);
      printer.println(`Thank you for choosing ${companyName}`);
      await printer.print();
    }
  }

  async function reportHandler(reportType, args) {
    if (reportType === 'ZReport') {
      return await zReportHandler(args)
    } else if (reportType === 'MonthlyReport') {
      return await monthlyReportHandler(args)
    } else if (reportType === 'XReport') {
      return await xReportHandler(args)
    } else if (reportType === 'StaffReport') {
      return await staffReportHandler(args)
    }
  }

  async function getOrderReportData({orderId}) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const order = await cms.getModel('Order').findById(orderId)

    if (!order) return null

    const {name: companyName, address: companyAddress, telephone: companyTel, taxNumber: companyVatNumber} = posSetting.companyInfo
    const orderDate = dayjs(order.date).format('DD.MM.YYYY')
    const orderTime = dayjs(order.date).format('HH:mm:ss')
    const orderNumber = order.id
    const orderProductList = order.items
    const {
      vSum: orderSum,
      vTax: orderTax,
      vTaxGroups: orderTaxGroups,
      receive: orderCashReceived,
      cashback: orderCashback,
      bookingNumber: orderBookingNumber,
      payment,
      vDiscount: discount
    } = order
    const orderPaymentType = payment[0].type

    return {
      companyName,
      companyAddress,
      companyTel,
      companyVatNumber,
      orderDate,
      orderTime,
      orderNumber,
      orderProductList,
      orderSum,
      orderTax,
      orderTaxGroups,
      orderCashReceived,
      orderCashback,
      orderPaymentType,
      orderBookingNumber,
      discount
    }
  }

  async function getOrderReportComponent({orderId}) {
    const props = await getOrderReportData({orderId});

    const OrderReport = require('../../dist/OrderReport.vue')
    return new Vue({
      components: {OrderReport},
      render(h) {
        return h('OrderReport', {props})
      }
    })
  }

  async function zReportHandler({z}, callback) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const endOfDayReport = await cms.getModel('EndOfDay').findOne({z})

    if (!endOfDayReport) {
      callbackWithError(callback, `z report number ${z} not found`)
      return
    }

    const {begin} = endOfDayReport

    let reportData
    reportData = await new Promise((resolve, reject) => {
      cms.api.processData('OrderEOD', {z}, result => {
        if (result === 'string') {
          reject(result)
        } else {
          resolve(result)
        }
      })
    })

    const sortedOrders = _.sortBy(reportData.paidOrders, 'date')
    const firstOrderDate = _.first(sortedOrders).date
    const lastOrderDate = _.last(sortedOrders).date

    const {name: companyName, address: companyAddress, telephone: companyTel, taxNumber: companyVatNumber} = posSetting.companyInfo
    const reportDate = dayjs(begin).format('DD.MM.YYYY')
    const firstOrderDateString = dayjs(firstOrderDate).format('DD.MM.YYYY HH:mm')
    const lastOrderDateString = dayjs(lastOrderDate).format('DD.MM.YYYY HH:mm')
    const {net: subTotal, tax: taxTotal, sum: sumTotal, discount} = reportData.report
    const {reportByPayment} = reportData

    const reportGroups = _.groupBy(Object.keys(reportData.report), key => {
      const taxGroup2Chars = key.slice(key.length - 2, key.length) // 2 characters tax - for example 23%
      const taxGroup1Char = key.slice(key.length - 1, key.length) // 1 character tax - for example 5%

      if (!isNaN(Number.parseInt(taxGroup2Chars))) return taxGroup2Chars
      if (!isNaN(Number.parseInt(taxGroup1Char))) {
        return taxGroup1Char
      } else {
        return 'other'
      }
    })

    delete reportGroups.other

    // put sum, net, total in groups (for example: 0%, 7%, 19%)
    Object.keys(reportGroups).forEach(percentage => {
      if (_.isNil(percentage)) return

      const obj = {}
      reportGroups[percentage].forEach(data => {
        // data is sum, net, total, ...
        obj[data] = _.get(reportData.report, data)
      })

      reportGroups[percentage] = obj
    })

    const props = {
      companyName, companyAddress, companyTel, companyVatNumber, reportDate, firstOrderDateString, lastOrderDateString,
      subTotal, taxTotal, sumTotal, discount: discount || 0, reportByPayment, reportGroups, z
    }

    const ZReport = require('../../dist/ZReport.vue')
    return new Vue({
      components: {ZReport},
      render(h) {
        return h('ZReport', {props})
      }
    })
  }

  async function monthlyReportHandler(report) {
    const props = {...report}
    const MonthReport = require('../../dist/MonthReport.vue')
    return new Vue({
      components: {MonthReport},
      render(h) {
        return h('MonthReport', {props})
      }
    })
  }

  async function staffReportHandler(report) {
    const StaffReport = require('../../dist/StaffReport.vue')
    return new Vue({
      components: {StaffReport},
      render(h) {
        return h('StaffReport', {props: {orderSalesByStaff: report}})
      }
    })
  }

  async function xReportHandler({from, to}) {
    const report = await new Promise((resolve, reject) => {
      cms.api.processData('OrderXReport', {from, to}, result => {
        if (result === 'string') {
          reject(result)
        } else {
          resolve(result)
        }
      })
    })
    const reportDate = dayjs(from);
    const xReport = {
      ...report.report,
      ...report.dayReport[reportDate.format('DD-MM-YYYY')]
    }

    const posSettings = await cms.getModel('PosSetting').findOne()
    const companyInfo = posSettings && posSettings.companyInfo
    const props = {
      ...companyInfo,
      ...xReport,
      date: reportDate.format('DD/MM/YYYY')
    }

    const XReport = require('../../dist/XReport.vue')
    return new Vue({
      components: {XReport},
      render(h) {
        return h('XReport', {props})
      }
    })
  }

  function printReport(component, device) {
    renderer.renderToString(component, {}, async (err, html) => {
      if (err) throw err
      // get ip
      const groupPrinters = await cms.getModel('GroupPrinter').aggregate([
        { $unwind: { path: '$printers' } },
        { $match: { 'printers.hardwares': device, 'type': 'invoice' } },
      ])
      if (!groupPrinters) return

      for (const groupPrinter of groupPrinters) {
        await print(html, groupPrinter.printers)
      }
    })
  }

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}
