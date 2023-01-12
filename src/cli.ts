#!/usr/bin/env node
import meow from 'meow'
import createDebug from 'debug'
import {lint} from './lint'
import {format} from './format'
import {loadOptions, Options} from './options'

const debug = createDebug('license-lint')

loadOptions()
  .then((options) =>
    meow<any>(
      `
  Usage
    license-lint

  Options
    --production    Only lint production dependencies
    --development   Only lint development dependencies
    --deny          Fail on the first occurrence of the licenses of the deny list
    --allow         Fail on the first occurrence of the licenses not in the allow list

  Examples
    license-lint
    license-lint --production
    license-lint --deny LGPL
`,
      {
        flags: {
          production: {
            type: 'boolean',
            default: options.production
          },
          development: {
            type: 'boolean',
            default: options.development
          },
          deny: {
            type: 'string',
            default: options.deny,
            isMultiple: true
          },
          allow: {
            type: 'string',
            default: options.allow,
            isMultiple: true
          }
        }
      }
    )
  )
  .then((cli) => {
    const options: Options = {
      ...cli.flags,
      entry: process.cwd()
    }

    debug('options: %o', options)

    return options
  })
  .then((options) => lint(options))
  .then((results) => {
    const errors = results.filter((result) => result.error)

    console.log(format(results))
    process.exit(errors.length > 0 ? 1 : 0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
