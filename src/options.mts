import fs from 'fs'
import path from 'path'

export interface Options {
  production?: boolean
  development?: boolean
  exclude?: string[]
  deny?: string[]
  allow?: string[]
}

const defaultOptions: Options = {
  production: false,
  development: false,
  exclude: [],
  deny: [],
  allow: []
}

const optionsFile = path.resolve(process.cwd(), '.licenserc.json')

export const loadOptions = async (): Promise<Options> => {
  try {
    const data = await fs.promises.readFile(optionsFile, 'utf-8')
    const options = JSON.parse(data)
    const resultOptions = {...defaultOptions, ...options}
    return resultOptions
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return defaultOptions
    }
    throw error
  }
}
