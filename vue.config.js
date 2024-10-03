const { defineConfig } = require("@vue/cli-service");

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://prismatic-snickerdoodle-033dc5.netlify.app/",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
