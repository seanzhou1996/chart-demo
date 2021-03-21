const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(
  common,
  {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ],
    },  
    devServer: {
      contentBase: path.resolve(__dirname, '../')
    },
  }
);