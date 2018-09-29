const test = require('../')

test('function', () => {
  const error = new Error('penguin')

  error.expected = () => {}
  error.actual = function () {}
  throw error
})

test('regexp', () => {
  const error = new Error('penguin')

  error.expected = /[0-9]/
  throw error
})

test('date', () => {
  const error = new Error('penguin')

  error.expected = new Date()
  throw error
})

test('set', () => {
  const error = new Error('penguin')

  error.expected = new Set([0, 1, 2, 3])
  throw error
})

test('map', () => {
  const error = new Error('penguin')

  error.expected = new Map([[0, 'first'], [1, 'second']])
  throw error
})

test('error', () => {
  const error = new Error('penguin')

  error.expected = new Error('nested error')
  throw error
})

test('instance', () => {
  const error = new Error('penguin')

  class Penguin {
    constructor (name) {
      this.name = name
    }
  }
  error.expected = new Penguin('Tux')
  throw error
})
