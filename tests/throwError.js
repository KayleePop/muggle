const test = require('../index.js')

test('thrown error fails', () => {
  let error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
})

test('thrown error in async function fails', async () => {
  let error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
})
