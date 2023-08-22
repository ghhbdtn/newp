const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  crossorigin: "use-credentials",
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      plugins: [new HtmlWebpackPlugin({inject: 'body'})]
    },
    menu: {
      entry: 'src/pages/menu/menu.ts',
      template: 'public/menu.html',
      filename: 'menu.html',
      chunks: ['chunk-vendors', 'chunk-common', 'menu'],
      plugins: [new HtmlWebpackPlugin({inject: 'body'})]
    }
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /\/index/, to: '/index.html' },
        { from: /\/menu/, to: '/menu.html' },
        { from: /^\/menu\//, to: '/menu.html' }
      ],
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8081,
  }
};


