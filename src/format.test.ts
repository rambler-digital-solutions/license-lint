import chalk from 'chalk'
import {format} from './format'

const results = [
  {
    name: 'foo@1.0.0',
    licenses: 'MIT'
  },
  {
    name: 'bar@1.0.0',
    licenses: 'ISC'
  },
  {
    name: 'baz@1.0.0',
    licenses: 'MIT'
  }
]

test('format success results', () => {
  const output = format(results, {})

  expect(output).toContain(`foo@1.0.0  ${chalk.dim('MIT')}`)
  expect(output).toContain(`bar@1.0.0  ${chalk.dim('ISC')}`)
  expect(output).toContain(`baz@1.0.0  ${chalk.dim('MIT')}`)
})

test('format error results', () => {
  const resultsWithError = [
    ...results.slice(0, 2),
    {
      name: 'baz@1.0.0',
      licenses: 'GPL',
      error: 'GPL is denied by `deny` list'
    }
  ]
  const output = format(resultsWithError, {})

  expect(output).toContain(`foo@1.0.0  ${chalk.dim('MIT')}`)
  expect(output).toContain(`bar@1.0.0  ${chalk.dim('ISC')}`)
  expect(output).toContain(`1 error`)
  expect(output).toContain(`baz@1.0.0  ${chalk.dim('GPL')}  GPL is denied`)
})

test('format summary success results', () => {
  const output = format(results, {summary: true})

  expect(output).toContain(`MIT  ${chalk.dim('2')}`)
  expect(output).toContain(`ISC  ${chalk.dim('1')}`)
})

test('format summary error results', () => {
  const resultsWithError = [
    ...results.slice(0, 2),
    {
      name: 'baz@1.0.0',
      licenses: 'GPL',
      error: 'GPL is denied by `deny` list'
    }
  ]
  const output = format(resultsWithError, {summary: true})

  expect(output).toContain(`MIT  ${chalk.dim('1')}`)
  expect(output).toContain(`ISC  ${chalk.dim('1')}`)
  expect(output).toContain(`1 error`)
  expect(output).toContain(`baz@1.0.0  ${chalk.dim('GPL')}  GPL is denied`)
})
