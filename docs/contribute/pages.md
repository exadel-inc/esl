# Development: Pages

The demo site is built with [Eleventy](https://www.11ty.dev/docs/) - a simple static site generator. 

[Nunjucks](https://mozilla.github.io/nunjucks/) and [Markdown](https://www.markdownguide.org/) are picked as template languages.

The project is deployed to GitHub Pages using a GitHub workflow.

## Syntax highlighting to Nunjucks template files

In case you are using JetBrains IDE (IDEA or WebStorm) you need to follow these steps:
1. add [Twig Support plugin](https://plugins.jetbrains.com/plugin/7303-twig) if necessary
2. go to File -> Settings -> Editor -> File Types
3. find Twig and add the custom pattern `*.njk`.
Now all *.njk files are parsed as Twig so you have support for Nunjucks.

For Visual Studio Code you can use this [plugin](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks) to support syntax highlighting.
