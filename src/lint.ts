import {promisify} from 'util'
import licenseChecker, {InitOpts, ModuleInfo} from 'license-checker'
import {Options} from './options'

const checkLicense = promisify(licenseChecker.init)

const matchLicense = (license: string) => (reference: string) =>
  // eslint-disable-next-line security/detect-non-literal-regexp
  license.match(new RegExp(reference, 'i'))

export interface LicenseResult extends Omit<ModuleInfo, 'licenses'> {
  name: string
  licenses?: string
  error?: string
}

export const lint = async (
  entry: string,
  options: Options
): Promise<LicenseResult[]> => {
  const {production, development, deny = [], allow = [], exclude = []} = options

  const checkerOptions: InitOpts = {
    start: entry,
    production,
    development,
    // NOTE fix wrong `exclude` type
    exclude: exclude.toString() as unknown as string[]
  }

  const modulesInfo = await checkLicense(checkerOptions)

  return Object.entries(modulesInfo)
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
}
