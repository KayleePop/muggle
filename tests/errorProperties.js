const test = require('../index.js')

test('error properties are included in output', () => {
  const error = new Error('does not equal penguin')

  error.name = 'PenguinError'
  const hardCodedStack =
`at Object.test [as callback] (/muggle/test/errorProperties.js:4:17)
at runTest (/muggle/index.js:54:16)
at startRunningTests (/muggle/index.js:38:11)
at queueTest (/muggle/index.js:28:5)`

  error.stack = hardCodedStack

  error.expected = 'penguin'
  error.actual = 'polar bear'
  error.operator = 'penguin equal'
  throw error
})

test('error properties are included in output async', async () => {
  const error = new Error('does not equal penguin')

  error.name = 'PenguinError'
  const hardCodedStack =
`at Object.test [as callback] (/muggle/test/errorProperties.js:4:17)
at runTest (/muggle/index.js:54:16)
at startRunningTests (/muggle/index.js:38:11)
at queueTest (/muggle/index.js:28:5)`

  error.stack = hardCodedStack

  error.expected = 'penguin'
  error.actual = 'polar bear'
  error.operator = 'penguin equal'
  throw error
})
