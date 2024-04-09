import {init, UIPJSRenderingPreprocessors, UIPRenderingTemplatesService} from '@exadel/ui-playground';

// Add ESL lib alias
UIPJSRenderingPreprocessors.addRegexReplacer(
  'esl-alias',
  /["']@exadel\/esl["']/g,
  '"/bundles/lib.js"'
);

// Add template
UIPRenderingTemplatesService.add('default', `
  <html>
    <head>
      <title>{title}</title>
      <base href="${location.origin}"/>
      <link rel="stylesheet" href="/bundles/lib.css">
      <script type="module">{script}</script>
    </head>
    <body style="overflow: hidden;">
      <div uip-content-root>{content}</div>
    </body>
  </html>
`);

init();
