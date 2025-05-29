import {format} from '@exadel/esl/modules/esl-utils/misc';

interface UIPRenderingTemplateParams {
  title?: string;
  script?: string;
  content: string;
  [additional: string]: string | number | boolean | undefined | null;
}

export class UIPRenderingTemplatesService {
  /** Template storage */
  protected static templates = new Map<string, string>();

  /** Register template */
  public static add(name: string, template: string): void {
    this.templates.set(name, template);
  }
  /** Get template */
  public static get(name: string): string | undefined {
    return this.templates.get(name);
  }

  /** Render template */
  public static render(name: string, params: UIPRenderingTemplateParams): string {
    const template = this.get(name);
    if (!template) return params.content;
    return format(template, params);
  }
}

UIPRenderingTemplatesService.add('default', `
  <html>
    <head>
      <title>{title}</title>
      <base href="${location.origin}"/>
      <script type="module">{script}</script>
    </head>
    <body style="overflow: hidden;">
      <div uip-content-root>{content}</div>
    </body>
  </html>
`);
