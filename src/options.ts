import fs from 'fs'
import path from 'path'

export interface Options {
  entry: string
  production?: boolean
  development?: boolean
  deny?: string[]
  allow?: string[]
}

const defaultOptions: Partial<Options> = {
  production: false,
  development: false,
  deny: [],
  allow: []
}

const optionsFile = path.resolve(process.cwd(), '.licenserc.json')

export const loadOptions = async (): Promise<Partial<Options>> => {
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
