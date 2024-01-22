const path = require('path');
const sizeOf = require('image-size');

const extractAttrs = (token) => {
  const attrs = token.attrs.reduce((acc, current) => {
    const trimmedLowerCasedKey = current[0].toLowerCase().trim();
    acc[trimmedLowerCasedKey] = current[1];
    return acc;
  }, {});
  attrs.alt = token.content;
  return attrs;
};

const renderImage = (attrs) => {
  const {src, alt, width, height} = attrs;
  const style = width * height ? `aspect-ratio: ${width} / ${height};` : '';
  return `<div class="img-container" style="${style}">
    <esl-image lazy container-class mode="fit" alt="${alt}" data-src="${src}"></esl-image>
  </div>`;
};

const plugin = (md) => {
  // Replace image processor rule
  md.renderer.rules.image = (tokens, index, ...rest) => {
    const attrs = extractAttrs(tokens[index]);

    const isLocal = attrs.src.startsWith('./docs/images/');
    if (!isLocal) return renderImage(attrs);

    const src = path.resolve('..', attrs.src );
    attrs.src = attrs.src.replace(/^\.?\/docs\/images\//g, '/assets/docs-images/');
    try {
      const {width, height} = sizeOf(src);
      attrs.width = width;
      attrs.height = height;
    } catch (e) {
      console.error(`Error processing image size: ${attrs.src}`);
    }
    return renderImage(attrs);
  };
};

module.exports = () => void 0;
module.exports.plugin = plugin;
