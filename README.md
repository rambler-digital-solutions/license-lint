# License Lint

Lint NPM package licenses

![](./screenshot.png)

## Install

```sh
npm install -D license-lint
```

or 

```sh
yarn add -D license-lint
```

## Usage

```sh
license-lint --help

  Lint NPM package licenses

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
  "production": true
}
```

## License

MIT
