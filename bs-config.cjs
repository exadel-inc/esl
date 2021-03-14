module.exports = {
    files: [
        './dist/*.js',
        './dist/*.css'
    ],
    watch: true,
    server: ['docs', 'dist'],
    open: 'local',
    browser: 'default'
};