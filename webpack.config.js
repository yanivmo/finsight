module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js'
    },
    module : {
        loaders : [
        {
            test: /\.jsx?/,
            loader: 'babel'
        },
        {
            test: /\.html$/,
            loader: 'file-loader',
            query: {name: '[name].[ext]'}
        }]
    },
    devtool: '#eval-source-map'
};
