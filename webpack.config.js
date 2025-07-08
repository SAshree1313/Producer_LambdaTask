const path = require("path");

module.exports = {
  entry: "./src/index.ts",                     // Entry point of your app
  target: "node",                              // Targeting Node.js (important for Lambda)
  mode: "production",                          // 'production' enables optimizations
  devtool: "source-map",                       // Helps in debugging (generates .map files)
  module: {
    rules: [
      {
        test: /\.ts$/,                         // All .ts files
        use: "babel-loader",                   // Use babel-loader (since you're using Babel)
        exclude: /node_modules/,               // Do not process node_modules
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],                // Resolve .ts and .js imports
  },
  output: {
    filename: "index.js",                      // Output filename
    path: path.resolve(__dirname, "dist"),     // Output directory
    clean: true                                // Clean old files on build
  },
  externals: {
    // AWS SDK is already available in Lambda environment, exclude it from bundle
    "aws-sdk": "commonjs aws-sdk",
  },
  optimization: {
    minimize: true,                            // Minify code
  },
};
