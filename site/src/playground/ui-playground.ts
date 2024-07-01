import {ESLEventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {init, UIPJSRenderingPreprocessors, UIPRenderingTemplatesService, UIPEditor} from '@exadel/ui-playground';


// Add ESL lib alias
UIPJSRenderingPreprocessors.addRegexReplacer(
  'esl-alias',
  /["']@exadel\/esl["']/g,
  '"/bundles/lib.js"'
);

// Store default template as empty
UIPRenderingTemplatesService.add('empty', UIPRenderingTemplatesService.get('default')!);
// Add default template with ESL context
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
