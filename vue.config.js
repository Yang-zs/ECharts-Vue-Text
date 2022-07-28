module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    host: 'localhost',
    port: 8989,
    https: false,
    proxy: {
      [process.env.VUE_APP_CROSS_DOMAIN_NAME]: {
        target: process.env.VUE_APP_CROSS_DOMAIN_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_CROSS_DOMAIN_NAME]: '',
        },
      },
    },
  },
}
