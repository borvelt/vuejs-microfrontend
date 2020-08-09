module.exports = {
  chainWebpack: config => {
    config.merge({
      externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
      },
    });
  },
  css: {
    extract: false,
    sourceMap: true
  },
  pluginOptions: {
    externals: {
      common: [{
        id: 'vendors',
        assets: [
          {
            path: process.env.VENDORS,
            type: 'js'
          }
        ],
      }]
    }
  },
}
