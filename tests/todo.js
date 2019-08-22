const test = require('../index.js')

test('todo: true', () => {}, { todo: true })

test('todo: true failing', () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: true })

test('todo: false', () => {}, { todo: false })

test('todo: false failing', () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: false })

test('todo: \'reason\'', () => {}, { todo: 'reason' })

test('todo: \'reason\' failing', () => {
  const error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: 'reason' })
