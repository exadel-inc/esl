import { Application, ArgumentsReader, TSConfigReader, TypeDocReader } from 'typedoc'
import { getOptionsHelp } from 'typedoc/dist/lib/utils/options/help'
import { readFileSync } from 'fs'

const ExitCodes = {
  Ok: 0,
  OptionError: 1,
  NoEntryPoints: 2,
  CompileError: 3,
  OutputError: 4,
  ExceptionThrown: 5,
}

const app = new Application()

app.options.addReader(new ArgumentsReader(0))
app.options.addReader(new TypeDocReader())
app.options.addReader(new TSConfigReader())
app.options.addReader(new ArgumentsReader(300))

app.bootstrap()

run(app)
  .catch((error) => {
    console.error('TypeDoc exiting with unexpected error:')
    console.error(error)
    return ExitCodes.ExceptionThrown
  })
  .then((exitCode) => (process.exitCode = exitCode))

/** @param {Application} app */
async function run(app) {
  if (app.options.getValue('version')) {
    console.log(app.toString())
    return ExitCodes.Ok
  }

  if (app.options.getValue('help')) {
    console.log(getOptionsHelp(app.options))
    return ExitCodes.Ok
  }

  if (app.options.getValue('showConfig')) {
    console.log(app.options.getRawValues())
    return ExitCodes.Ok
  }

  if (app.logger.hasErrors()) {
    return ExitCodes.OptionError
  }
  if (
    app.options.getValue('treatWarningsAsErrors') &&
    app.logger.hasWarnings()
  ) {
    return ExitCodes.OptionError
  }

  if (
    app.options.getValue('entryPoints').length === 0 &&
    app.options.getValue('packages').length === 0
  ) {
    app.logger.error('No entry points or packages provided')
    return ExitCodes.NoEntryPoints
  }

  if (app.options.getValue('watch')) {
    app.convertAndWatch(async (project) => {
      const out = app.options.getValue('out')
      if (out) {
        await app.generateDocs(project, out)
      }
      const json = app.options.getValue('json')
      if (json) {
        await app.generateJson(project, json)
      }

      if (!out && !json) {
        await app.generateDocs(project, './docs')
      }
    })
    return ExitCodes.Ok
  }

  const project = app.convert()
  if (!project) {
    return ExitCodes.CompileError
  }

  const out = app.options.getValue('out')
  if (out) {
    console.log(1)
    await app.generateDocs(project, out)
  }
  const json = app.options.getValue('json')
  if (json) {
    await app.generateJson(project, json)
    const data = readFileSync(json, 'utf8')
    console.log(JSON.parse(data))

  }

  if (!out && !json) {
    console.log(3)
    await app.generateDocs(project, './docs')
  }

  if (app.logger.hasErrors()) {
    return ExitCodes.OutputError
  }
  if (
    app.options.getValue('treatWarningsAsErrors') &&
    app.logger.hasWarnings()
  ) {
    return ExitCodes.OutputError
  }
  return ExitCodes.Ok
}
