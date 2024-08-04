const path = require('path');
module.exports = {
  entry: './src/index.js', // Entry point of call your mother application

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    // contentBase: path.join(__dirname, "public"), // Serve files from this directory
    static: path.resolve(__dirname, 'dist'),
    port: 3000, // Port for the development server
    open: true, // Open the default web browser when the server starts
  },
};
