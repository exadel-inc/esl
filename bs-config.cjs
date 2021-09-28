module.exports = {
    files: [
        './bundles/*.js',
        './bundles/*.css'
    ],
    watch: true,
    server: ['pages', 'bundles'],
    open: 'local',
    browser: 'default'
};
