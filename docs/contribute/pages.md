# Development: Pages

Demo site built with [Eleventy](https://www.11ty.dev/docs/) - a simple static site generator. 

[Nunjucks](https://mozilla.github.io/nunjucks/getting-started.htmlх) was picked as a template language. 

Project deploys to GitHub pages.

## Syntax highlighting to Nunjucks template files

In case you are using JetBrains IDE (IDEA or WebStorm) you need to follow these steps:
1. add [Twig Support plugin](https://plugins.jetbrains.com/plugin/7303-twig) if necessary
2. go to File -> Settings -> Editor -> File Types
3. find Twig and add the custom pattern `*.njk`.
Now all *.njk files are parsed as Twig so you have support for Nunjucks.

For Visual Studio Code you can use this [plugin](https://marketplace.visualstudio.com/items?itemName=eseom.nunjucks-template) to support syntax highlighting.
