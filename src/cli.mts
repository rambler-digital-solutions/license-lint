#!/usr/bin/env node
import meow, {Flag, AnyFlags} from 'meow'
import {lint} from './lint.mjs'
import {loadOptions, Options} from './options.mjs'

interface Flags extends AnyFlags {
  production: Flag<'boolean', boolean>
  development: Flag<'boolean', boolean>
  exclude: Flag<'string', string[], true>
  deny: Flag<'string', string[], true>
  allow: Flag<'string', string[], true>
}

const options = await loadOptions()

const cli = meow<Flags>(`
  Usage
    license-lint

  Options
    --production    Only lint production dependencies
    --development   Only lint development dependencies
    --exclude       Exclude modules which licenses are in the exclude list
    --deny          Fail on the first occurrence of the licenses of the deny list
    --allow         Fail on the first occurrence of the licenses not in the allow list

  Examples
    license-lint
    license-lint --production
    license-lint --deny LGPL
`, {
  importMeta: import.meta,
  flags: {
    production: {
      type: 'boolean',
      default: options.production
    },
    development: {
      type: 'boolean',
      default: options.development
    },
    exclude: {
      type: 'string',
      default: options.exclude,
      isMultiple: true
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
})

const result = await lint(cli.flags as Options)
console.log(result)
