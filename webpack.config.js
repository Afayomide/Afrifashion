const webpack = require('webpack');

module.exports = {
  resolve: {
      fallback: {
          path: false,
          buffer: false,
          crypto: false
      },
  },
};