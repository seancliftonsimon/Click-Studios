const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
				__VUE_OPTIONS_API__: true,
				__VUE_PROD_DEVTOOLS__: false,
			}),
		],
	},
	pluginOptions: {
		vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
	},
});
