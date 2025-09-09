import {
  init,
  UIPJSRenderingPreprocessors,
  UIPRenderingTemplatesService
} from '@exadel/ui-playground';

// Add ESL lib alias
UIPJSRenderingPreprocessors.addRegexReplacer(
  'esl-alias',
  /["']@exadel\/esl["']/g,
  '"/bundles/lib.js"'
);

// Store default template as empty
UIPRenderingTemplatesService.add('empty', UIPRenderingTemplatesService.get('default')!);
// Inject ESL context to default template
UIPRenderingTemplatesService.add('default', `
  <html>
    <head>
      <title>{title}</title>
      <base href="${location.origin}"/>
      <style>
        html, body {
          overflow: clip;
          height: 100%;
          max-height: 100%;
        }
      </style>
      <link rel="stylesheet" href="/bundles/lib.css">
      <script type="module">{script}</script>
    </head>
    <body>
      <div uip-content-root>{content}</div>
    </body>
  </html>
`);

init({
  editor: {
    label: 'Source code',
    copy: true,
    collapsible: true,
  },
  settings: {
    label: 'Settings',
    themeToggle: true,
    collapsible: true,
    hideable: true,
    resizable: true
  }
});
