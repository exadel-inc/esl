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

const ANSI_CATS = [
  '\t\t\t ((      /|_/|\n\t\t\t  \\\\.._.\'  , ,\\\n\t\t\t  /\\ | \'.__ v /\n\t\t\t (_ .   /   "        \n\t\t\t  ) _)._  _ /\n\t\t\t \'.\\ \\|( / ( mrf\n\t\t\t   \'\' \'\'\\\\ \\\\',
  '\t\t\t _._     _,-\'""`-._\n\t\t\t(,-.`._,\'(       |\\`-/|\n\t\t\t    `-.-\' \\ )-`( , o o)\n\t\t\t          `-    \\`_`"\'-',
  '\t\t\t  /\\_/\\  (\n\t\t\t ( ^.^ ) _)\n\t\t\t   \\"/  (\n\t\t\t ( | | )\n\t\t\t(__d b__)',
  '      /^--^\\     /^--^\\     /^--^\\\n\\____/     \\____/     \\____/\n     /      \\   /      \\   /      \\\n    |        | |        | |        |\n     \\__  __/   \\__  __/   \\__  __/\n|^|^|^|^\\ \\^|^|^|^/ /^|^|^|^|^\\ \\^|^|^|^|^|\n| | | | |\\ \\| | |/ /| | | | | | \\ \\ | | | |\n| | | | / / | | |\\ \\| | | | | |/ /| | | | |\n| | | | \\/| | | | \\/| | | | | |\\/ | | | | |\n###########################################'
];

module.exports.catLog = (text) => {
  const cat = ANSI_CATS[Math.floor(Math.random() * ANSI_CATS.length)];
  return print(cat + '\n\t\t\t' + text);
};
