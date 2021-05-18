module.exports = (config) => {
    config.addPassthroughCopy({
        'pages/static/bundles': '/bundles',
        'pages/static/assets': '/assets'
    });

    return {
        dir: {
            input: 'pages/views-11ty',
            output: 'pages/dist'
        },
        templateFormats: [
            'html'
        ],
    };
};