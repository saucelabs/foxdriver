module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: '10'
            }
        }]
    ],
    plugins: [
        'add-module-exports',
        'transform-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-class-properties'
    ]
}
