const TypeDoc = require('typedoc');

module.exports = async(entryPoints, output) => {
  const app = new TypeDoc.Application();

  app.options.addReader(new TypeDoc.TSConfigReader());

  app.bootstrap({
    entryPoints: [entryPoints]
  });

  const project = app.convert();

  if (project) {
    return await app.generateJson(project, output);
  } else {
    throw new Error ('Failed to load project')
  }
}
