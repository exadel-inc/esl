const FAST_BUILD = process.argv.includes('--fast');

module.exports = {
    FAST_BUILD
};

module.exports.printBuildStart = function() {
    console.log('=== Running Exadel Smart Library Build ===');
    console.log(`[SETTINGS]: Fast Build \t= ${FAST_BUILD}`);
};