const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: './src/popup/popup.ts',
        background: './src/background/background.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/popup/popup.html', to: 'popup.html' },
                { from: 'src/popup/styles.css', to: 'styles.css' },
                { from: 'manifest.json', to: 'manifest.json' },
            ],
        }),
    ],
};
