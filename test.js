const assert = require('assert').strict || require('assert') // only use strict mode if available
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk')

async function runFile (fileName) {
  const filePath = path.join(__dirname, 'tests', fileName)
  const { stdout, stderr } = await exec(`node ${filePath}`)

  if (stderr) throw stderr

  // return array of lines to allow better diffing
  return stdout.split('\n')
}

// print a colorized test description
let testNum = 1
function printTest (description) {
  console.log(chalk.yellow(`#${testNum}`), chalk.blue(description))
  testNum++
}

// print indication that previous test passed
function printOk () {
  console.log(chalk.green('  ok!'))
}

main()
  .then(() => console.log(chalk.green('All OK!')))
  .catch((err) => {
    console.error(err)
    console.log(chalk.red('Error!'))
    process.exit(1)
  })

async function main () {
  printTest('Thrown Errors should fail tests')
  const throwErrorExpected = [
    'TAP Version 13',
    '1..2',
    'not ok 1 - thrown error fails',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    'not ok 2 - thrown error in async function fails',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    ''
  ]
  assert.deepStrictEqual(await runFile('throwError.js'), throwErrorExpected)
  printOk()

  printTest('tests should pass if execution finishes with no errors')
  const passingExpected = [
    'TAP Version 13',
    '1..4',
    'ok 1 - empty function',
    'ok 2 - empty async function',
    'ok 3 - delayed async',
    'ok 4 - fill an array (random work)',
    ''
  ]
  assert.deepStrictEqual(await runFile('passing.js'), passingExpected)
  printOk()

  printTest('error properties should be included in the yaml error block of the TAP output')
  const errorPropertiesExpected = [
    'TAP Version 13',
    '1..2',
    'not ok 1 - error properties are included in output',
    '  ---',
    '  operator: penguin equal',
    '  actual: polar bear',
    '  expected: penguin',
    '  name: PenguinError',
    '  message: does not equal penguin',
    '  stack: |-',
    '    at Object.test [as callback] (/muggle/test/errorProperties.js:4:17)',
    '    at runTest (/muggle/index.js:54:16)',
    '    at startRunningTests (/muggle/index.js:38:11)',
    '    at queueTest (/muggle/index.js:28:5)',
    '  ...',
    'not ok 2 - error properties are included in output async',
    '  ---',
    '  operator: penguin equal',
    '  actual: polar bear',
    '  expected: penguin',
    '  name: PenguinError',
    '  message: does not equal penguin',
    '  stack: |-',
    '    at Object.test [as callback] (/muggle/test/errorProperties.js:4:17)',
    '    at runTest (/muggle/index.js:54:16)',
    '    at startRunningTests (/muggle/index.js:38:11)',
    '    at queueTest (/muggle/index.js:28:5)',
    '  ...',
    ''
  ]
  assert.deepStrictEqual(await runFile('errorProperties.js'), errorPropertiesExpected)
  printOk()

  printTest('passing an error as error.expected or error.actual should output as expected')
  const passErrorsExpected = [
    'TAP Version 13',
    '1..2',
    'not ok 1 - error instance as error.actual',
    '  ---',
    '  actual:',
    '    name: Error',
    '    message: innerError',
    '    stack: |-',
    '      at Object.test [as callback] (/muggle/test/passErrors.js:5:62)',
    '      at function (/muggle/index.js:100:100)',
    '  name: Error',
    '  message: \'\'',
    '  stack: |-',
    '    at Object.test [as callback] (/muggle/test/passErrors.js:5:62)',
    '    at function (/muggle/index.js:100:100)',
    '  ...',
    'not ok 2 - error instance as error.expected',
    '  ---',
    '  expected:',
    '    name: Error',
    '    message: innerError',
    '    stack: |-',
    '      at Object.test [as callback] (/muggle/test/passErrors.js:5:62)',
    '      at function (/muggle/index.js:100:100)',
    '  name: Error',
    '  message: \'\'',
    '  stack: |-',
    '    at Object.test [as callback] (/muggle/test/passErrors.js:5:62)',
    '    at function (/muggle/index.js:100:100)',
    '  ...',
    ''
  ]
  assert.deepStrictEqual(await runFile('passErrors.js'), passErrorsExpected)
  printOk()

  printTest('passing unsupported values to yaml should not throw')
  await runFile('yaml.js')
  printOk()

  printTest('skip directive')
  const skipExpected = [
    'TAP Version 13',
    '1..4',
    'ok 1 - skip: true # SKIP ',
    'ok 2 - skip: false',
    'not ok 3 - skip: false failing',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    'ok 4 - skip: \'reason\' # SKIP reason',
    ''
  ]
  assert.deepStrictEqual(await runFile('skip.js'), skipExpected)
  printOk()

  printTest('todo directive')
  const todoExpected = [
    'TAP Version 13',
    '1..6',
    'ok 1 - todo: true # TODO ',
    'not ok 2 - todo: true failing # TODO ',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    'ok 3 - todo: false',
    'not ok 4 - todo: false failing',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    'ok 5 - todo: \'reason\' # TODO reason',
    'not ok 6 - todo: \'reason\' failing # TODO reason',
    '  ---',
    '  name: Error',
    '  message: penguin',
    '  ...',
    ''
  ]
  assert.deepStrictEqual(await runFile('todo.js'), todoExpected)
  printOk()
}
