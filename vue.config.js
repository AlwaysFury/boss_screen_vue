const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    proxy: { // 代理配置
      '/api': { // 匹配所有以 '/api' 开头的请求
        target: 'http://120.25.154.29:8992', // 目标服务器的基础URL
        changeOrigin: true, // 是否改变源，开启后服务器接收到的请求头中Host为target的值
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    client: {
      overlay: false
    }
  },
})
