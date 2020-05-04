const yaml = require('js-yaml')
const encodeToYaml = (json) => {
  // ignore incompatible types instead of throwing
  return yaml.dump(json, { skipInvalid: true })
}

// TAP version
// https://testanything.org/tap-version-13-specification.html#the-version
console.log('TAP Version 13')

const testLinePromises = []
let numTests = 0
let printing = false

async function test (testName, testCallback) {
  numTests++

  testLinePromises.push(
    runTest({
      number: numTests,
      name: testName,
      callback: testCallback
    })
  )

  // wait a tick to make sure other tests get registered
  await Promise.resolve()

  if (!printing) { // only run once
    printing = true

    // TAP plan
    // https://testanything.org/tap-version-13-specification.html#the-plan
    console.log(`1..${numTests}`)

    // print tests in order as the callbacks resolve
    for (const testLinePromise of testLinePromises) {
      console.log(await testLinePromise)
    }
  }
}

// returns TAP test line as string
// https://testanything.org/tap-version-13-specification.html#the-test-line
async function runTest ({ number, name, callback }) {
  try {
    // catch both rejections and exceptions thanks to await
    await callback()

    return `ok ${number} - ${name}`
  } catch (error) {
    const failingTestLine = `not ok ${number} - ${name}`

    const yamlErrorBlock = createYamlErrorBlock(error) // hoisted from below

    return failingTestLine + '\n' + yamlErrorBlock
  }
}

// returns TAP yaml block as string
// https://testanything.org/tap-version-13-specification.html#yaml-blocks
function createYamlErrorBlock (error) {
  // Error instances can't be converted to yaml
  const errorJSON = errorToJSON(error) // hoisted from below

  // error.actual and error.expected might be error instances as well (assert.throws())
  if (errorJSON.expected instanceof Error) {
    errorJSON.expected = errorToJSON(errorJSON.expected)
  }
  if (errorJSON.actual instanceof Error) {
    errorJSON.actual = errorToJSON(errorJSON.actual)
  }

  let output = '---\n'
  output += encodeToYaml(errorJSON) // uses require('js-yaml').dump
  output += '...'

  // indent the entire block by 2 spaces
  output = output.replace(/^/mg, '  ')

  return output
}

// convert an error into a plain object
function errorToJSON (error) {
  // properties to include in the output
  // they will print in this order
  const outputKeys = [
    'operator',
    'actual',
    'expected',
    'name',
    'message',
    'stack'
  ]

  const output = {}

  for (const key of outputKeys) {
    // ignore undefined properties
    if (error[key] === undefined) {
      continue
    }

    output[key] = error[key]
  }

  return output
}

module.exports = function (testName, testCallback, opts = {}) {
  // TAP Skip directive
  // https://testanything.org/tap-version-13-specification.html#skipping-tests
  if (opts.skip) {
    const reason = typeof opts.skip === 'string'
      ? opts.skip
      : ''

    // ignore callback
    test(`${testName} # SKIP ${reason}`, () => {})
    return
  }

  // TAP Todo directive
  // https://testanything.org/tap-version-13-specification.html#todo-tests
  if (opts.todo) {
    const reason = typeof opts.todo === 'string'
      ? opts.todo
      : ''

    test(`${testName} # TODO ${reason}`, testCallback)
    return
  }

  // else
  test(testName, testCallback)
}
