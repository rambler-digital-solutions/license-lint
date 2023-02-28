import licenseChecker, {InitOpts, ModuleInfo} from 'license-checker'
import {Options} from './options'

export interface LicenseResult extends Omit<ModuleInfo, 'licenses'> {
  name: string
  licenses?: string
  error?: string
}

const matchLicense = (license: string) => (reference: string) =>
  license.match(new RegExp(reference, 'i'))

export const lint = (
  entry: string,
  options: Options
): Promise<LicenseResult[]> =>
  new Promise<LicenseResult[]>((resolve, reject) => {
    const {production, development, deny = [], allow = []} = options

    const checkerOptions: InitOpts = {
      start: entry,
      production,
      development
    }

    licenseChecker.init(checkerOptions, (error: Error, modulesInfo) => {
      if (error) {
        reject(error)
        return
      }

      const results = Object.entries(modulesInfo)
        .map<LicenseResult>(([name, {licenses, ...info}]) => ({
          name,
          ...info,
          licenses: Array.isArray(licenses)
            ? `(${licenses.join(' AND ')})`
            : licenses
        }))
        .map((result) => {
          if (allow.length > 0) {
            const isNotAllow = !allow.some(matchLicense(result.licenses ?? ''))
            if (isNotAllow) {
              result.error = `${result.licenses} is not allowed by \`allow\` list`
            }
          } else if (deny.length > 0) {
            const multipleLicenses = result.licenses?.split(' OR ')
            const isDeny = Array.isArray(multipleLicenses)
              ? multipleLicenses.every((license) =>
                  deny.some(matchLicense(license ?? ''))
                )
              : deny.some(matchLicense(result.licenses ?? ''))
            if (isDeny) {
              result.error = `${result.licenses} is denied by \`deny\` list`
            }
          }
          return result
        })

      resolve(results)
    })
  })
