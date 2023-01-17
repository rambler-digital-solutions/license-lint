# License Lint

A linter for NPM package licenses to avoid dependencies that not compatible with license of your software. It can check licenses automatically on CI or on NPM `postinstall`.

![](./screenshot.png)

## Install

```sh
npm install -D @rambler-digital-solutions/licenselint
```

or 

```sh
yarn add -D @rambler-digital-solutions/licenselint
```

## Usage

```sh
licenselint --help

  Lint NPM package licenses

  Usage
    licenselint [dirname]

  Options
    --production    Only lint production dependencies
    --development   Only lint development dependencies
    --summary       Output a summary of the license usage
    --deny          Fail on an occurrence of the licenses of the deny list
    --allow         Fail on an occurrence of the licenses not in the allow list
    --extends       Use custom configuration file

  Examples
    licenselint
    licenselint packages/foo
    licenselint --production
    licenselint --deny LGPL
    licenselint --allow MIT --allow ISC
    licenselint --extends shared/licenserc.json
```

Then use it for automatically check in CI

```yaml
...
lint deps:
  stage: test
  script:
    - npm install
    - licenselint
...
```

Or on NPM `postinstall`

```json
{
  "name": "app",
  "description": "...",
  "version": "0.1.2",
  "scripts": {
    "...": "...",
    "postinstall": "licenselint"
  },
  "...": "..."
}
```

## Configuration

Create `.licenserc.json` configuration file:

```json
{
  "production": true,
  "deny": [
    "GPL",
    "LGPL"
  ]
}
```

Configuration file supports all CLI flags.

Also you can extends your local setup with shared configuration:

```json
{
  "extends": "@shared/licenserc",
  "summary": true
}
```

## License

MIT
