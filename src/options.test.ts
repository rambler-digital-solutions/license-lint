import {loadOptions, defaultOptions} from './options'

test('load default options', async () => {
  const options = await loadOptions()

  expect(options).toEqual({
    ...defaultOptions,
    summary: true,
    production: true,
    deny: [
      'MPL.+1.1',
      'MPL.+2',
      'EPL.+1.0',
      'EPL.+2',
      'IPL.+1',
      'GPL.+2',
      'GPL.+3',
      'AGPL.+3',
      'LGPL.+2.1',
      'CDDL.+1.0',
      'UNKNOWN',
      'CUSTOM'
    ]
  })
})

test('load custom options', async () => {
  const options = await loadOptions('./test/options.json')

  expect(options).toEqual({...defaultOptions, development: true})
})

test('load extended options', async () => {
  const options = await loadOptions('./test/options-extended.json')

  expect(options).toEqual({
    ...defaultOptions,
    development: true,
    production: true
  })
})
