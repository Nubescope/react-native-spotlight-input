const path = require('path')

module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['ts', 'tsx']
  },
  extraNodeModules: {
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  },
  getProjectRoots() {
    return [
      // Keep project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      path.resolve(__dirname, '..', '..', 'node_modules'),
      path.resolve(__dirname, '..', '..', 'packages/react-native-spotlight-input'),
    ]
  },
}
