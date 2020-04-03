const Vue = require('vue');
const dayjs = require('dayjs')
const _ = require('lodash')
const { renderer, print } = require('../print-utils/print-utils')

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printReport', reportHandler)
  })

  async function reportHandler(reportType, args, callback) {
    if (reportType === 'OrderReport') {
      await orderReportHandler(args, callback)
    } else if (reportType === 'ZReport') {
      await zReportHandler(args, callback)
    } else if (reportType === 'MonthlyReport') {
      await monthlyReportHandler(args, callback)
    } else if (reportType === 'XReport') {
      await xReportHandler(args, callback)
    }  else if (reportType === 'StaffReport') {
      await staffReportHandler(args, callback)
    }
  }

  async function orderReportHandler({orderId}, callback) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const order = await cms.getModel('Order').findById(orderId)

    if (!order) {
      callbackWithError(callback, `Order with ID ${orderId} not found`)
      return
    }

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
    // TODO: discount

    const props = {
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

    const OrderReport = require('../../dist/OrderReport.vue')
    const component = new Vue({
      components: {OrderReport},
      render(h) {
        return h('OrderReport', {props})
      }
    })

    printReport(component, callback)
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
    try {
      reportData = await new Promise((resolve, reject) => {
        cms.api.processData('OrderEOD', {z}, result => {
          if (result === 'string') reject(result)
          else resolve(result)
        })
      })
    } catch (err) {
      callbackWithError(callback, err)
      return
    }

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
      if (!isNaN(Number.parseInt(taxGroup1Char))) return taxGroup1Char
      else return 'other'
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
    const component = new Vue({
      components: {ZReport},
      render(h) {
        return h('ZReport', {props})
      }
    })

    printReport(component, callback)
  }

  async function monthlyReportHandler(report, callback) {
    const props = {...report }
    const MonthReport = require('../../dist/MonthReport.vue')
    const component = new Vue({
      components: { MonthReport },
      render(h) {
        return h('MonthReport', { props })
      }
    })

    printReport(component, callback)
  }

  async function staffReportHandler(report, callback) {
    const StaffReport = require('../../dist/StaffReport.vue')
    const component = new Vue({
      components: { StaffReport },
      render(h) {
        return h('StaffReport', { props: { orderSalesByStaff: report } })
      }
    })

    printReport(component, callback)
  }

  async function xReportHandler({from, to}, callback) {
    try {
      const report  = await new Promise((resolve, reject) => {
        cms.api.processData('OrderXReport', {from, to}, result => {
          if (result === 'string') reject(result)
          else resolve(result)
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
      const component = new Vue({
        components: { XReport },
        render(h) {
          return h('XReport', { props })
        }
      })

      printReport(component, callback)
    } catch (e) {
      callbackWithError(callback, e)
    }
  }

  function printReport(component, callback) {
    renderer.renderToString(component, {}, async (err, html) => {
      if (err) {
        callbackWithError(callback, err)
        return
      }
      // get ip
      const groupPrinters = await cms.getModel('GroupPrinter').aggregate([
        { $unwind: { path: '$printers' } },
        { $match: { 'printers.hardwares': device, 'type': 'kitchen' } },
      ])
      if (!groupPrinters) return
      const printerIp = printer.printers.ip
      await print(html, printerIp)

      callback({success: true})
    })
  }

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}
