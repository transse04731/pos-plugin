const _ = require('lodash');
const {getEscPrinter, getGroupPrinterInfo} = require('../print-utils/print-utils');

module.exports = async function (cms) {
  cms.socket.on('connect', socket => {
    socket.on('printReport', async (reportType, args, device, callback) => {
      let report;

      switch (reportType) {
        case 'OrderReport':
          report = require('./order-report');
          break;
        case 'ZReport':
          report = require('./z-report');
          break;
        case 'MonthlyReport':
          report = require('./monthly-report');
          break;
        case 'StaffReport':
          report = require('./staff-report');
          break;
        case 'XReport':
          report = require('./x-report');
          break;
        default:
          return callbackWithError(callback, new Error(`Report type ${reportType} is not supported`));
      }

      try {
        const printData = await report.makePrintData(cms, args);
        const groupPrinters = await getGroupPrinterInfo(cms, device, 'invoice');
        const printers = _.flatten(groupPrinters.map(group => group.printers));

        for (const printerInfo of printers) {
          const escPrinter = await getEscPrinter(printerInfo);
          const {escPOS} = printerInfo

          if (escPOS) await report.printEscPos(escPrinter, printData);
          else await report.printSsr(escPrinter, printData);
        }

        callback({success: true});
      } catch (e) {
        console.error(e);
        callbackWithError(callback, e);
      }
    })
  });

  function callbackWithError(callback, error) {
    callback({
      success: false,
      message: error.toString()
    })
  }
}
