import chalk from 'chalk'
import pluralize from 'numd'
import logSymbols from 'log-symbols'
import stringWidth from 'string-width'
import {LicenseResult} from './lint'

export interface FormatLine {
  name: string
  nameWidth: number
  license: string
  licenseWidth: number
  error?: string
}

const formatLines = (
  lines: FormatLine[],
  maxNameWidth: number,
  maxLicenseWidth: number
): string =>
  lines
    .map((line) =>
      [
        '',
        logSymbols[line.error ? 'error' : 'success'],
        line.name + ' '.repeat(maxNameWidth - line.nameWidth),
        chalk.dim(line.license) +
          ' '.repeat(maxLicenseWidth - line.licenseWidth),
        line.error
      ].join('  ')
    )
    .join('\n')

export const format = (results: LicenseResult[]): string => {
  const errorLines: FormatLine[] = []
  const successLines: FormatLine[] = []
  let maxNameWidth = 0
  let maxLicenseWidth = 0

  results.forEach((result) => {
    const nameWidth = stringWidth(result.name)
    const licenseWidth = stringWidth(result.licenses ?? '')

    maxNameWidth = Math.max(nameWidth, maxNameWidth)
    maxLicenseWidth = Math.max(licenseWidth, maxLicenseWidth)

    const lines = result.error ? errorLines : successLines

    lines.push({
      name: result.name,
      license: result.licenses ?? '',
      nameWidth,
      licenseWidth,
      error: result.error
    })
  })

  let output = '\n'
  output += formatLines(successLines, maxNameWidth, maxLicenseWidth)
  output += '\n'

  if (errorLines.length > 0) {
    output +=
      '\n  ' +
      chalk.red(pluralize(errorLines.length, 'error', 'errors')) +
      '\n\n'
    output += formatLines(errorLines, maxNameWidth, maxLicenseWidth)
    output += '\n'
  }

  return output
}
