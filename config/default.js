module.exports = {
  debug: true,
  port: 8080,
  proxy: { // webpack dev
    target: "http://localhost:7001"
  }
};

