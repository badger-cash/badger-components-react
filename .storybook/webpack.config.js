module.exports = function (baseConfig, env, defaultConfig) {
  defaultConfig.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
      }
    ],
    enforce: 'pre',
  });

  return defaultConfig;
};