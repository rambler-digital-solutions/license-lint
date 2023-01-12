import path from 'path'

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
  optionsFileName = defaultOptionsFileName
): Promise<Partial<Options>> => {
  try {
    const optionsFilePath = path.resolve(process.cwd(), optionsFileName)
    const {default: options} = await import(optionsFilePath)
    const {extends: extendsFileName, ...restOptions} = options
    let extendsOptions = {}

    if (options.extends) {
      const optionsFileDir = path.dirname(optionsFilePath)
      extendsOptions = await loadOptions(
        path.resolve(optionsFileDir, extendsFileName)
      )
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
