const typescriptIsTransformer = require('typescript-is/lib/transform-inline/transformer').default;
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withTM = require('next-transpile-modules')([
  '@patternfly/react-core',
  '@patternfly/react-styles'
]);

module.exports = withPlugins([withTM, withImages, withBundleAnalyzer, withPWA], {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        getCustomTransformers: (program) => ({
          before: [typescriptIsTransformer(program)]
        })
      }
    });
    return config;
  },
  basePath: process.env.DEVFILE_VIEWER_ROOT ? process.env.DEVFILE_VIEWER_ROOT : '',
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    register: true,
    dest: 'public'
  }
});
