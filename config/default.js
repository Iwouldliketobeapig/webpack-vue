module.exports = {
  debug: true,
  port: 8081,
  proxy: { // webpack dev
    target: "http://localhost:7001"
  }
};

