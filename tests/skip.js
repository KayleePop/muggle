const test = require('../index.js')

test('skip: true', () => {
  console.log('this should not be logged')
}, { skip: true })

test('skip: false', () => {}, { skip: false })

test('skip: false failing', () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { skip: false })

test('skip: \'reason\'', () => {
  console.log('this should not be logged')
}, { skip: 'reason' })
