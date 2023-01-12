#!/usr/bin/env node
import meow from 'meow'
import createDebug from 'debug'
import {lint} from './lint'
import {format} from './format'
import {loadOptions, Options} from './options'

const debug = createDebug('license-lint')

const defaultArray: string[] = []

const cli = meow<any>(
  `
  Usage
    license-lint [dirname]

  Options
    --production    Only lint production dependencies
    --development   Only lint development dependencies
    --deny          Fail on the first occurrence of the licenses of the deny list
    --allow         Fail on the first occurrence of the licenses not in the allow list
    --extends       Use custom configuration file

  Examples
    license-lint
    license-lint packages/foo
    license-lint --production
    license-lint --deny LGPL
    license-lint --allow MIT --allow ISC
    license-lint --extends shared/licenserc.json
`,
  {
    booleanDefault: undefined,
    flags: {
      production: {
        type: 'boolean'
      },
      development: {
        type: 'boolean'
      },
      extends: {
        type: 'string'
      },
      deny: {
        type: 'string',
        default: defaultArray,
        isMultiple: true
      },
      allow: {
        type: 'string',
        default: defaultArray,
        isMultiple: true
      }
    }
  }
)

const [entry = process.cwd()] = cli.input

const cliOptions: Options = Object.fromEntries(
  Object.entries(cli.flags).filter(([, value]) => value !== defaultArray)
)

loadOptions(cliOptions.extends)
  .then((baseOptions) => {
    const options = {...baseOptions, ...cliOptions}

    debug('entry: %o', entry)
    debug('options: %o', options)

    return options
  })
  .then((options) => lint(entry, options))
  .then((results) => {
    const errors = results.filter((result) => result.error)

    console.log(format(results))
    process.exit(errors.length > 0 ? 1 : 0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
