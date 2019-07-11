const test = require('../index.js')

test('thrown error fails', () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
})

test('thrown error in async function fails', async () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
})
