import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

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
  const dimensions = (width && height) ? `width="${width}" height="${height}"` : '';
  return `<img esl-image-container loading="lazy" class="img-fade" alt="${alt}" src="${src}" ${dimensions}/>`;
};

const resolveImage = (env, src) => {
  if (env?.basePath) {
    return path.resolve(path.dirname(env.basePath), src);
  }
  return src;
};

const plugin = (md) => {
  // Replace image processor rule
  md.renderer.rules.image = (tokens, index, opt, env) => {
    const attrs = extractAttrs(tokens[index]);

    const isLocal = attrs.src.startsWith('./docs/images/');
    if (!isLocal) return renderImage(attrs);

    const src = resolveImage(env, attrs.src);
    attrs.src = attrs.src.replace(/^\.?\/docs\/images\//g, '/assets/docs-images/');

    try {
      const buffer = fs.readFileSync(src);
      const {width, height} = sizeOf(buffer);
      attrs.width = width;
      attrs.height = height;
    } catch (e) {
      console.error(`Error processing image size: ${src} (originally: ${attrs.src})`);
    }
    return renderImage(attrs);
  };
};

const noop = () => void 0;
noop.plugin = plugin;

export default noop;
