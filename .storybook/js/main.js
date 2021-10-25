const config = require('../base/base');

module.exports = {
  ...config,
  "stories": [
    '../../packages/semi-ui/**/_story/*.stories.(js|jsx)',
  ],
  typescript: {
    check: false,
    checkOptions: {}
  },
};
