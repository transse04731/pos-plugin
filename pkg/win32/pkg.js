require('giga-pkg-patches');
const { exec } = require('plugins/pos-plugin/pkg/win32/pkg');
const argv = ['--config', 'pkg.config.js', '--targets', 'node10-win32-x64', '--output', 'build/app-win32', 'win32/index.js', '--no-bytecode', '--public' , '--public-packages', '*'];
exec(argv);
