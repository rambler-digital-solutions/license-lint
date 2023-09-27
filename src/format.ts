import chalk from 'chalk'
import pluralize from 'numd'
import logSymbols from 'log-symbols'
import stringWidth from 'string-width'
import {Options} from './options'
import {LicenseResult} from './lint'

export interface FormatLine {
  name: string
  nameWidth: number
  license: string
  licenseWidth: number
  error?: string
}

const formatFullLines = (
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

const formatSummaryLines = (
  lines: FormatLine[],
  _maxNameWidth: number,
  maxLicenseWidth: number
): string => {
  const summaryLines: Record<string, FormatLine[]> = {}

  lines.forEach((line) => {
    summaryLines[line.license] ??= []
    summaryLines[line.license].push(line)
  })

  return Object.values(summaryLines)
    .sort((a, b) => b.length - a.length)
    .map((line) =>
      [
        '',
        logSymbols['success'],
        line[0].license + ' '.repeat(maxLicenseWidth - line[0].licenseWidth),
        chalk.dim(line.length)
      ].join('  ')
    )
    .join('\n')
}

export const format = (results: LicenseResult[], options: Options): string => {
  const errorLines: FormatLine[] = []
  const successLines: FormatLine[] = []
  let maxNameWidth = 0
  let maxLicenseWidth = 0
  let maxErrorNameWidth = 0
  let maxErrorLicenseWidth = 0

  results.forEach((result) => {
    const nameWidth = stringWidth(result.name)
    const licenseWidth = stringWidth(result.licenses ?? '')

    if (result.error && options.summary) {
      maxErrorNameWidth = Math.max(nameWidth, maxErrorNameWidth)
      maxErrorLicenseWidth = Math.max(licenseWidth, maxErrorLicenseWidth)
    } else {
      maxNameWidth = Math.max(nameWidth, maxNameWidth)
      maxLicenseWidth = Math.max(licenseWidth, maxLicenseWidth)
    }

    const lines = result.error ? errorLines : successLines

    lines.push({
      name: result.name,
      license: result.licenses ?? '',
      nameWidth,
      licenseWidth,
      error: result.error
    })
  })

  const formatLines = options.summary ? formatSummaryLines : formatFullLines
  let output = '\n'

  output += formatLines(successLines, maxNameWidth, maxLicenseWidth)
  output += '\n'

  if (errorLines.length > 0) {
    output +=
      '\n  ' +
      chalk.red(pluralize(errorLines.length, 'error', 'errors')) +
      '\n\n'
    output += formatFullLines(
      errorLines,
      maxErrorNameWidth || maxNameWidth,
      maxErrorLicenseWidth || maxLicenseWidth
    )
    output += '\n'
  }

  return output
}
