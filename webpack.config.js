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
        },{
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass'],
        },{
            test: /\.html$/,
            loader: 'file-loader',
            query: {name: '[name].[ext]'}
        },{
            test: /\/fonts\/|\\fonts\\/,
            loader: 'file-loader',
            query: {name: 'fonts/[name].[ext]'}
        }]
    },
    devtool: '#eval-source-map'
};
