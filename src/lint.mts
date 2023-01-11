import licenseChecker, {InitOpts, ModuleInfos} from 'license-checker'
import {Options} from './options.mjs'

const startPath = process.cwd()

export const lint = (options: Options): Promise<ModuleInfos> =>
  new Promise<ModuleInfos>((resolve, reject) => {
    const checkerOptions: InitOpts = {
      start: startPath,
      production: options.production,
      development: options.development,
      exclude: options.exclude?.join(',') as any,
      failOn: options.deny?.join(','),
      onlyAllow: options.allow?.join(',')
    }
    licenseChecker.init(checkerOptions, (error: Error, licensesInfo) => {
      if (error) {
        reject(error)
        return
      }

      resolve(licensesInfo)
    })
  })
