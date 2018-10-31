const yaml = require('js-yaml')
const encodeToYaml = (json) => {
  // ignore incompatible types instead of throwing
  return yaml.dump(json, { skipInvalid: true })
}
const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay))

// TAP version
// https://testanything.org/tap-version-13-specification.html#the-version
console.log('TAP Version 13')

let testQueue = []
let totalTests = 0

module.exports = async function queueTest (testName, testCallback) {
  totalTests++

  const thisTestNumber = totalTests

  testQueue.push({
    name: testName,
    callback: testCallback,
    number: thisTestNumber
  })

  // if 100ms pass without another test being queued, then run tests
  await sleep(100)
  if (thisTestNumber === totalTests) {
    // TAP plan
    // https://testanything.org/tap-version-13-specification.html#the-plan
    console.log(`1..${totalTests}`)

    // run tests one at a time in order
    for (const test of testQueue) {
      const testLine = await runTest(test) // hoisted from below

      console.log(testLine)
    }
  }
}

// returns TAP test line as string
// https://testanything.org/tap-version-13-specification.html#the-test-line
async function runTest (test) {
  try {
    // catch both rejections and exceptions thanks to await
    await test.callback()

    return `ok ${test.number} - ${test.name}`
  } catch (error) {
    const failingTestLine = `not ok ${test.number} - ${test.name}\n`

    const yamlErrorBlock = createYamlErrorBlock(error) // hoisted from below

    return failingTestLine + yamlErrorBlock
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

  let output = {}

  for (const key of outputKeys) {
    // ignore undefined properties
    if (error[key] === undefined) {
      continue
    }

    output[key] = error[key]
  }

  return output
}
