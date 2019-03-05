const fs = require('fs');
const url = require('url');
const path = require('path');

function renderFile(res, pathFile) {
    res.render(pathFile.replace(/\.html$/i, '').replace(/^(\/|\\)/i, ''));
}
function renderDir(res, pathDir, fsPath) {
    const fileNames = fs.readdirSync(fsPath);
    const links = fileNames.filter((fn) => !/^_/.test(fn))
        .map((fn) => ({
            name: fn,
            link: path.join(pathDir, fn)
        }));
    res.render('__renderdir', { links });
}

module.exports = function (config) {
    return function (req, res, next) {
        const pathname = url.parse(req.url).pathname;

        if (/\.(js|css|ico|png|jpg|gif|woff|woff2)$/.test(pathname)) {
            next();
            return;
        }
        if (/\.(html)$/.test(pathname)) {
            renderFile(res, pathname);
            return;
        }
        const fsPath = path.join(config.viewPath, pathname);
        const stat = fs.lstatSync(fsPath);
        if (stat.isDirectory()) {
            renderDir(res, pathname, fsPath);
            return;
        }
        if (stat.isFile()) {
            renderFile(res, pathname);
            return;
        }
        next();
    }
};