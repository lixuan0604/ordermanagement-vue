const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // proxy: {
    //   '/api': {
    //     context: ['/api'],
    //     target: 'http://172.16.10.7:8000'
    //   },
    // }
    host: '0.0.0.0',
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws'
    },
  },

  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
