module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.(otf|ttf|woff|woff2)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          }
        ]
      }
    }
  }
}; 