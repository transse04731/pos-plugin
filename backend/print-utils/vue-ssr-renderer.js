const fs = require('fs');

const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync(`${__dirname}/print-template.html`, 'utf-8')
});

module.exports = renderer;
