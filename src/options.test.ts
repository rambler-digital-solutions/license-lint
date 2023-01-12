import {loadOptions, defaultOptions} from './options'

test('load default options', async () => {
  const options = await loadOptions()
  expect(options).toEqual({
    ...defaultOptions,
    production: true,
    deny: ['GPL', 'LGPL']
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
