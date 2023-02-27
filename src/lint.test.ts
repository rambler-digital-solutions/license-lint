import {lint} from './lint'

const entry = process.cwd()

test('lint licenses', async () => {
  const options = {
    production: true
  }
  const results = await lint(entry, options)
  const failed = results.filter((result) => result.error)
  expect(failed).toEqual([])
})

test('lint licenses with deny list', async () => {
  const options = {
    production: true,
    deny: ['Apache-2.0', 'BSD-2-Clause', 'CC0-1.0']
  }
  const results = await lint(entry, options)
  const errors = results.filter((result) => result.error)
  expect(errors.map((result) => result.licenses)).toContain('Apache-2.0')
  expect(errors.map((result) => result.licenses)).toContain('BSD-2-Clause')
  expect(errors.map((result) => result.licenses)).toContain('CC0-1.0')
  expect(errors.map((result) => result.licenses)).not.toContain(
    '(MIT OR CC0-1.0)'
  )
})

test('lint licenses with allow list', async () => {
  const options = {
    production: true,
    allow: ['MIT', 'ISC']
  }
  const results = await lint(entry, options)
  const errors = results.filter((result) => result.error)
  expect(errors.map((result) => result.licenses)).not.toContain('MIT')
  expect(errors.map((result) => result.licenses)).not.toContain('ISC')
})
