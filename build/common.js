const gulp = require('gulp');

function print(...logArgs) {
  return (cb) => {
    console.log(...logArgs);
    (typeof cb === 'function') && cb();
  };
}
module.exports.print = print;

module.exports.srcExt = function (src) {
  if (typeof src === 'string' || Array.isArray(src)) {
    return gulp.src(src);
  }
  const options = Object.assign({}, src);
  delete options.src;
  return gulp.src(src.src, options);
}

/** ========================
 * It's too boring without any fun ;)
 * =========================*/
const MIN_WIDTH = 30;
const ANSI_CATS = [
  ' ((      /|_/|\n  \\\\.._.\'  , ,\\\n  /\\ | \'.__ v /\n (_ .   /   "        \n  ) _)._  _ /\n \'.\\ \\|( / ( mur\n   \'\' \'\'\\\\ \\\\',
  ' _._     _,-\'""`-._\n(,-.`._,\'(       |\\`-/|\n    `-.-\' \\ )-`( , o o)\n          `-    \\`_`"\'-',
  '  /\\_/\\  (\n ( ^.^ ) _)\n   \\"/  (\n ( | | )\n(__d b__)',
  '      /^--^\\     /^--^\\     /^--^\\\n\\____/     \\____/     \\____/\n     /      \\   /      \\   /      \\\n    |        | |        | |        |\n     \\__  __/   \\__  __/   \\__  __/\n|^|^|^|^\\ \\^|^|^|^/ /^|^|^|^|^\\ \\^|^|^|^|^|\n| | | | |\\ \\| | |/ /| | | | | | \\ \\ | | | |\n| | | | / / | | |\\ \\| | | | | |/ /| | | | |\n| | | | \\/| | | | \\/| | | | | |\\/ | | | | |\n###########################################'
];
function center(text, width, textWidth = text.length) {
  const pad = Math.max(0, Math.floor(.5 * (width - textWidth) ));
  const padString = ''.padEnd(pad, ' ');
  return padString + text + padString;
}
module.exports.catLog = (text) => {
  const index = Math.floor(Math.random() * ANSI_CATS.length);
  const catLines = ANSI_CATS[index].split('\n');
  const catWidth = Math.max(...catLines.map((line) => line.length));
  const width = Math.max(text.length, catWidth, MIN_WIDTH) + 2;
  const result = catLines.map((line) => center(line, width, catWidth));
  result.push('#' + center(text, width - 2) + '#');
  return print(result.join('\n'));
};
