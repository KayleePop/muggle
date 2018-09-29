const test = require('../index.js')

function sleep (delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay))
}

test('empty function', () => {})
test('empty async function', async () => {})

test('delayed async', async () => {
  await sleep(100)
})

test('fill an array (random work)', () => {
  const arr = []

  for (let i = 0; i < 100; i++) {
    arr.push(i)
  }
})
