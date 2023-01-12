import {lint} from './lint'

test('lint licenses', async () => {
  const options = {
    entry: process.cwd(),
    production: true
  }
  const results = await lint(options)
  const failed = results.filter((result) => result.error)
  expect(failed).toEqual([])
})

test('lint licenses with deny list', async () => {
  const options = {
    entry: process.cwd(),
    production: true,
    deny: ['Apache-2.0', 'BSD-2-Clause']
  }
  const results = await lint(options)
  const errors = results.filter((result) => result.error)
  expect(errors.map((result) => result.licenses)).toContain('Apache-2.0')
  expect(errors.map((result) => result.licenses)).toContain('BSD-2-Clause')
})

test('lint licenses with allow list', async () => {
  const options = {
    entry: process.cwd(),
    production: true,
    allow: ['MIT', 'ISC']
  }
  const results = await lint(options)
  const errors = results.filter((result) => result.error)
  expect(errors.map((result) => result.licenses)).not.toContain('MIT')
  expect(errors.map((result) => result.licenses)).not.toContain('ISC')
})
