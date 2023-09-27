import {lint} from './lint'

const entry = process.cwd()

const APACHE = 'Apache-2.0'
const BSD = 'BSD-2-Clause'
const MIT = 'MIT'
const ISC = 'ISC'
const CC0 = 'CC0-1.0'

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
    deny: [APACHE, BSD, CC0]
  }
  const results = await lint(entry, options)
  const errors = results.filter((result) => result.error)

  expect(errors.map((result) => result.licenses)).toContain(APACHE)
  expect(errors.map((result) => result.licenses)).toContain(BSD)
  expect(errors.map((result) => result.licenses)).toContain(CC0)
  expect(errors.map((result) => result.licenses)).not.toContain(
    `(${MIT} OR ${CC0})`
  )
})

test('lint licenses with allow list', async () => {
  const options = {
    production: true,
    allow: [MIT, ISC]
  }
  const results = await lint(entry, options)
  const errors = results.filter((result) => result.error)

  expect(errors.map((result) => result.licenses)).not.toContain(MIT)
  expect(errors.map((result) => result.licenses)).not.toContain(ISC)
})

test('lint licenses with exclude list', async () => {
  const options = {
    production: true,
    exclude: [APACHE]
  }
  const results = await lint(entry, options)

  expect(results.map((result) => result.licenses)).not.toContain(APACHE)
})
