/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const npath = require('path')
const pkg = require(npath.resolve(process.cwd(), './package.json'))

function fillZero(value) {
  return value < 10 ? `0${value}` : `${value}`
}

function getVersion() {
  const date = new Date()

  return `${date.getFullYear() - 2010}.${date.getMonth()}${fillZero(
    date.getDay(),
  )}.${date.getHours()}${fillZero(date.getMinutes())}`
}
pkg.version = getVersion()

fs.writeFileSync(
  npath.resolve(process.cwd(), './package.json'),
  JSON.stringify(pkg, null, 2),
)
