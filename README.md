# Muggle

[![Greenkeeper badge](https://badges.greenkeeper.io/KayleePop/muggle.svg)](https://greenkeeper.io/)
[![Travis badge](https://travis-ci.org/KayleePop/muggle.svg?branch=master)](https://travis-ci.org/KayleePop/muggle)
[![standard badge](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/v/muggle-test.svg)](https://www.npmjs.com/package/muggle-test)

Muggle is a testing library without magic.

It outputs [TAP version 13](https://testanything.org/tap-version-13-specification.html), and supports any assertion library that throws an [AssertionError](https://nodejs.org/api/assert.html#assert_class_assert_assertionerror)

## Goals
- Predictable and simple behavior
- Simple and readable source code
- Intuitive and small API
- Encourage writing robust and readable tests
- Fully tested

## Install
`$ npm install muggle-test muggle-assert`

## Usage
A test passes if its callback finishes execution without throwing an error.

```js
const test = require('muggle-test')

// passing test
test('3 + 2 should equal 5', () => {
  if (3 + 2 !== 5) {
    throw new Error('3 + 2 !== 5')
  }
})

// failing test
test('3 + 10 should equal 5', () => {
  if (3 + 10 !== 5) {
    throw new Error('3 + 10 !== 5')
  }
})
```

Async functions work exactly the same way! `await` is used internally to catch both exceptions and rejections.

``` js
const test = require('muggle-test')

test('asyncAdd() should add correctly', async () => {
  const sum = await asyncAdd(3, 2)

  if (sum !== 5) {
    throw new Error('asyncAdd(3, 2) should resolve with 5')
  }
})
```

Use an assertion library like [muggle-assert](https://github.com/kayleepop/muggle-assert) to keep tests simple and readable. See [its readme](https://github.com/kayleepop/muggle-assert#readme) for details on its API.

``` js
const test = require('muggle-test')
const assert = require('muggle-assert')

test('numbers should add up to 5', async () => {
  const num1 = 3
  const num2 = 2

  // muggle-assert will throw an error if an assertion fails
  assert(typeof num1 === 'number', 'num1 should be a number')
  assert(typeof num2 === 'number', 'num2 should be a number')

  const sum = await asyncAdd(num1, num2)

  assert.equal(sum, 5)
})
```

### Running tests
To run tests simply execute the file

`$ node test.js`

and pipe to your favorite tap reporter

`$ node test.js | tap-spec`

To run in browser use [tape-run](https://github.com/juliangruber/tape-run)

`$ browserify test.js | tape-run`

### Assertions
Muggle is compatible with any assertion library that throws an error, but [muggle-assert](https://github.com/kayleepop/muggle-assert) is recommended.

The `name`, `message`, and `stack` properties of errors thrown in a test callback will be printed to the TAP output if they are defined.

The `actual`, `expected`, and `operator` properties from an [AssertionError](https://nodejs.org/api/assert.html#assert_class_assert_assertionerror) will also be included if defined.
