import fs from 'fs';
import color from 'kleur';

export default async (config) => {
  // Init all 11ty config modules
  const cfgFiles = fs.readdirSync('./11ty');
  for (const file of cfgFiles) {
    if (file.startsWith('_')) continue;
    try {
      console.info(color.blue(`Initializing module: ${file}`));
      const module = await import(`./11ty/${file}`);
      module.default(config);
      console.info(color.green(`Module ${file} initialized.`));
    } catch (e) {
      console.error(color.red(`Module ${file} initialization failed`));
      throw e;
    }
  }
  // Observe the config files for 11ty
  config.addWatchTarget('./11ty/**/*.js', {resetConfig: true});

  // Setup simple copy operations
  config.addPassthroughCopy({
    '../../docs/images': 'assets/docs-images',
    'static/assets': 'assets',
    'static/tools': '.'
  });

  config.setServerOptions({
    port: process.env.PORT || 3005,
    domDiff: false, // Disabled until https://github.com/11ty/eleventy-dev-server/issues/77 is fixed
    watch: [
      'dist/bundles/*.js',
      'dist/bundles/*.css'
    ],
  });

  return {
    dir: {
      input: 'views',
      output: 'dist',
      layouts: '_layouts'
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk']
  };
};
