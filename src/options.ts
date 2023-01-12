import path from 'path'
import createDebug from 'debug'

const debug = createDebug('license-lint:options')

export interface Options {
  extends?: string
  production?: boolean
  development?: boolean
  deny?: string[]
  allow?: string[]
}

export const defaultOptions: Partial<Options> = {
  production: false,
  development: false,
  deny: [],
  allow: []
}

const defaultOptionsFileName = '.licenserc.json'

export const loadOptions = async (
  optionsFileName = defaultOptionsFileName,
  optionsFileDir = process.cwd()
): Promise<Partial<Options>> => {
  try {
    const optionsFilePath = optionsFileName.endsWith('.json')
      ? path.resolve(optionsFileDir, optionsFileName)
      : optionsFileName

    debug('optionsFileName: %o', optionsFileName)
    debug('optionsFilePath: %o', optionsFilePath)

    const {default: options} = await import(optionsFilePath)
    const {extends: extendsFileName, ...restOptions} = options
    let extendsOptions = {}

    if (extendsFileName) {
      const extendsFileDir = path.dirname(optionsFilePath)
      extendsOptions = await loadOptions(extendsFileName, extendsFileDir)
    }

    const resultOptions = {...defaultOptions, ...extendsOptions, ...restOptions}

    delete resultOptions.extends

    return resultOptions
  } catch (error) {
    const exception = error as NodeJS.ErrnoException

    if (exception.code === 'MODULE_NOT_FOUND') {
      exception.path ??= optionsFileName

      if (exception.path === defaultOptionsFileName) {
        return defaultOptions
      }
    }

    throw exception
  }
}
