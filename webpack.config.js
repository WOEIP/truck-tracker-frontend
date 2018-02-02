var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        'main': [
            'babel-polyfill',
            'react-hot-loader/patch',
            './src/index'
        ]
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module : {
        rules: [
            {
                test: /\.js$/,
                include: __dirname + '/src',
                loader: 'babel-loader' }
        ]
    }
};
