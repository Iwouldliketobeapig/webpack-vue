module.exports = {
  debug: true,
  port: 8081,
  proxy: { // webpack dev
    target: 'http://localhost:7001',
    apiVersion: '/api/v1'
  },
  title: 'webpack-vue'
};
