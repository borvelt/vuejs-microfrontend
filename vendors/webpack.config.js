const path = require('path');

module.exports = {
    mode: 'production',
    entry: './vendors.js',
    performance: {
        hints: 'error', // stop building process!!!!!!
        maxEntrypointSize: 250000, // default value
        maxAssetSize: 250000, // default value
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'vendors.js',
        chunkFilename: '[id].js',
        publicPath: '/',
        globalObject: 'this',
        libraryTarget: 'umd',
    },
};
