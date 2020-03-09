const fs = require('fs');
const path = require('path');
const pack = require('tar-pack').pack;

pack(process.cwd())
    .pipe(fs.createWriteStream(path.join(__dirname, '/smart-library.tar')))
    .on('error', function (err) {
        console.error(err.stack);
    })
    .on('close', function () {
        console.log('done');
    });