const test = require('../index.js')

test('todo: true', () => {}, { todo: true })

test('todo: true failing', () => {
  let error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: true })

test('todo: false', () => {}, { todo: false })

test('todo: false failing', () => {
  let error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: false })

test(`todo: 'reason'`, () => {}, { todo: 'reason' })

test(`todo: 'reason' failing`, () => {
  let error = new Error('penguin')
  // the stack changes on each machine
  delete error.stack
  throw error
}, { todo: 'reason' })
