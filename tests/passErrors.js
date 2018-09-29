const test = require('../index.js')

const hardCodedStack =
`at Object.test [as callback] (/muggle/test/passErrors.js:5:62)
at function (/muggle/index.js:100:100)`

test('error instance as error.actual', () => {
  const error = new Error('')
  const innerError = new Error('innerError')

  error.stack = hardCodedStack
  innerError.stack = hardCodedStack

  error.actual = innerError
  throw error
})

test('error instance as error.expected', () => {
  const error = new Error('')
  const innerError = new Error('innerError')

  error.stack = hardCodedStack
  innerError.stack = hardCodedStack

  error.expected = innerError
  throw error
})
