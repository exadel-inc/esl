const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpEach = require('gulp-each');

const IMPORT_REGEXP = /@import\s+['"](.*)['"]\s*;?/gm;
const LESS_FILE_REGEX = /.less$/;
const CSS_FILE_REGEX = /.css$/;

const cache = new Map();

function resolveImportPath(url, filePath) {
    if (!(LESS_FILE_REGEX.test(url) || CSS_FILE_REGEX.test(url))) {
        url += '.less';
    }
    if (url.charAt(0) === '~') {
        return path.resolve(process.cwd(), 'node_modules', url.substr(1));
    } else {
        return path.resolve(filePath, '..', url);
    }
}

function resolveImports(content, filePath) {
    return (content || '').replace(IMPORT_REGEXP, function (importStatement, url) {
        url = (url || '').trim();

        if (!url) return '';

        const resolvedPath = resolveImportPath(url, filePath);
        try {
            if (cache.has(resolvedPath)) {
                return cache.get(resolvedPath);
            }

            const fileContent = fs.readFileSync(resolvedPath, 'utf8').toString();
            if (!fileContent) {
                throw new Error(`Can't read file ${resolvedPath}`);
            }

            const resolvedContent = resolveImports(fileContent, resolvedPath);
            cache.set(resolvedPath, resolvedContent);
            return resolvedContent;
        } catch (e) {
            console.error(e);
            return importStatement;
        }
    });
}

module.exports = function buildLessBundleStream(src) {
    return gulp.src(src)
        .pipe(gulpEach((content, file, cb) => {
            cb(null, resolveImports(content, file.path));
        }));
};
