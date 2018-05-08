const path = require('path');

const withSass = require('@zeit/next-sass');

const config =  withSass({
	cssModules       : true,
	cssLoaderOptions : {
		modules        : true,
		sourceMap      : true,
		importLoaders  : 1,
		localIdentName : '[name]__[local]___[hash:base64:5]',
	},
});

module.exports = config;

