module.exports = function({config}) {
	config.module.rules.push({
		test: /stories\.jsx?$/,
		loaders: [
			{
				loader: require.resolve('@storybook/addon-storysource/loader'),
			},
		],
		enforce: 'pre',
	});

	return config;
};