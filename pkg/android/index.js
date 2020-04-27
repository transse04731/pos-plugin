const path = require('path');
global.phantomPath = path.resolve(process.argv[0], '../phantomjs');
console.log('current version: ', require('../../package').version);
require('../common-index');
