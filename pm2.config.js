module.exports = {
    apps : [{
      name: "serve_proxy",
      script: "./server.js",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }
  