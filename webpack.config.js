const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

const env = process.env.NODE_ENV;

const config = {
	entry: {
		main: ['@babel/polyfill','./src/index.js']
	},
	plugins: [],
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react',
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom',
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(png|gif|jpg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 50000,
					},
				},
			},
			{
				test: /\.svg/,
				use: {
					loader: 'svg-url-loader',
					options: {},
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
		filename: 'badgerComponents.js',
		libraryTarget: 'umd',
	},
};

if (env === 'analyse') {
	config.plugins.push(new BundleAnalyzerPlugin());
}
if (env === 'production') {
  config.mode = 'production';
}

module.exports = config;
