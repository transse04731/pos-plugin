const EscPrinter = require('../print-utils/node-thermal-printer');

module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('test-printer', async printerConfig => {
      const printer = new EscPrinter(printerConfig);
      printer.println('Test Drucker');
      await printer.print();
    })
  })
}