const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      //名字可以自定义，这里我用的是api
      '/api': {
        target: 'http://localhost:8083/',//设置你调用的接口域名和端口号
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
