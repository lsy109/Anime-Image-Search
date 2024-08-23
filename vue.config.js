const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: "https://wallhaven.cc",
  },
  configureWebpack: {
    resolve: {
      fallback: {
        timers: require.resolve("timers-browserify"),
      },
    },
  },
});
