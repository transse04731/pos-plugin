const fs = require('fs');
const PhantomUtil = require('../print-utils/phantom-util');
const phantomUtil = new PhantomUtil();
const EscPrinter = require('../print-utils/node-thermal-printer');

module.exports = {
  renderer: require('vue-server-renderer').createRenderer({
    template: fs.readFileSync(`${__dirname}/print-template.html`, 'utf-8')
  }),

  print:  async function(html, ip) {
    try {
      const png = await phantomUtil.render(html)

      const printer = new EscPrinter({
        printerType: 'ip',
        ip,
      });
      printer.printPng(png);
      await printer.print();
    } catch (e) {
      throw e
    }
  }
}