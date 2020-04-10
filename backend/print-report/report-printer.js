const Vue = require('vue');
const dayjs = require('dayjs')
const _ = require('lodash')
const { renderer, print } = require('../print-utils/print-utils')

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printReport', async (reportType, args, device, callback) => {
      try {
        const reportComponent = await reportHandler(reportType, args)
        if (!reportComponent) return
        await printReport(reportComponent, device)
        callback({ success: true })
      } catch (e) {
        callbackWithError(callback, e)
      }
    })
  })

  async function reportHandler(reportType, args) {
    if (reportType === 'OrderReport') {
      return await orderReportHandler(args)
    } else if (reportType === 'ZReport') {
      return await zReportHandler(args)
    } else if (reportType === 'MonthlyReport') {
      return await monthlyReportHandler(args)
    } else if (reportType === 'XReport') {
      return await xReportHandler(args)
    } else if (reportType === 'StaffReport') {
      return await staffReportHandler(args)
    }
  }

  async function orderReportHandler({ orderId }, callback) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const order = await cms.getModel('Order').findById(orderId)

    if (!order) {
      callbackWithError(callback, `Order with ID ${orderId} not found`)
      return
    }

    const { name: companyName, address: companyAddress, telephone: companyTel, taxNumber: companyVatNumber } = posSetting.companyInfo
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
    return new Vue({
      components: { OrderReport },
      render(h) {
        return h('OrderReport', { props })
      }
    })
  }

  async function zReportHandler({ z }, callback) {
    const posSetting = await cms.getModel('PosSetting').findOne({})
    const endOfDayReport = await cms.getModel('EndOfDay').findOne({ z })

    if (!endOfDayReport) {
      callbackWithError(callback, `z report number ${z} not found`)
      return
    }

    const { begin } = endOfDayReport

    let reportData
    reportData = await new Promise((resolve, reject) => {
      cms.api.processData('OrderEOD', { z }, result => {
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

    const { name: companyName, address: companyAddress, telephone: companyTel, taxNumber: companyVatNumber } = posSetting.companyInfo
    const reportDate = dayjs(begin).format('DD.MM.YYYY')
    const firstOrderDateString = dayjs(firstOrderDate).format('DD.MM.YYYY HH:mm')
    const lastOrderDateString = dayjs(lastOrderDate).format('DD.MM.YYYY HH:mm')
    const { net: subTotal, tax: taxTotal, sum: sumTotal, discount } = reportData.report
    const { reportByPayment } = reportData

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
      components: { ZReport },
      render(h) {
        return h('ZReport', { props })
      }
    })
  }

  async function monthlyReportHandler(report) {
    const props = { ...report }
    const MonthReport = require('../../dist/MonthReport.vue')
    return new Vue({
      components: { MonthReport },
      render(h) {
        return h('MonthReport', { props })
      }
    })
  }

  async function staffReportHandler(report) {
    const StaffReport = require('../../dist/StaffReport.vue')
    return new Vue({
      components: { StaffReport },
      render(h) {
        return h('StaffReport', { props: { orderSalesByStaff: report } })
      }
    })
  }

  async function xReportHandler({ from, to }) {
    const report = await new Promise((resolve, reject) => {
      cms.api.processData('OrderXReport', { from, to }, result => {
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
      components: { XReport },
      render(h) {
        return h('XReport', { props })
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
