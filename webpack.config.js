const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

const env = process.env.NODE_ENV;

const config = {
	entry: {
		main: ['./src/index.js']
	},
	plugins: [],
	externals: {
		react: 'React',
		'react-dom': 'ReactDom',
		'styled-components': 'styled-components'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/, '/**/stories.js/'],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(png|gif|jpg|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 50000,
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.json', '.png', '.gif', '.jpg', '.svg'],
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '',
		filename: 'badger-components.js',
	},
	optimization: {
		minimize: true,
	}
};

if (env === 'analyse') {
	config.plugins.push(new BundleAnalyzerPlugin());
}
if (env === 'production') {
  config.mode = 'production';
}

module.exports = config;
