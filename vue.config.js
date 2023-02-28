const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    'index': {
      entry:'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    'menu': {
      entry: 'src/pages/menu/menu.ts',
      template: 'src/pages/menu/menu.html',
      filename: 'menu.html',
      chunks: ['chunk-vendors', 'chunk-common', 'menu']
    }
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /\/index/, to: '/index.html' },
        { from: /\/menu/, to: '/menu.html' }
      ]
    }
  }
})
