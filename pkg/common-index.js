const path = require('path');
const fs = require('fs');
process.env.CONFIG_PATH = path.resolve(__dirname, '../../../config/config.js');
require('../../../cms/backend/use');
