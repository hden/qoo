# qoo [![Circle CI](https://circleci.com/gh/hden/qoo.svg?style=svg)](https://circleci.com/gh/hden/qoo)
Expressive middleware for queue workers

## Task

A task is exposed to the middleware chain as `this`. A task **must** implement
the following interface.

- value
- resolve `function (result) { /* ... */ }`
- reject `function (error) { /* ... */ }`

Optional methods can be attached to a task e.g.

- progress ([firebase-queue](https://github.com/firebase/firebase-queue))
- touch ([nsq.js](https://github.com/segmentio/nsq.js))

## Example

### firebase-queue

```js
import compose from 'qoo'
import Firebase from 'firebase'
import Queue from 'firebase-queue'

const xf = (value, progress, resolve, reject) => {
  return { value, progress, resolve, reject }
}

function * logger (next) {
  const start = new Date()
  yield next
  const ms = new Date() - start
  console.log('%s %s - %s', this.method, this.url, ms)
}

function * processor (next) {
  this.result = { foo: 'bar' }
  yield next
}

const ref = new Firebase('https://<your-firebase>.firebaseio.com/queue')
const queue = new Queue(ref, compose(xf, logger, processor))
```

### nsq.js

```js
import nsq from 'nsq.js'
import compose from 'qoo'

const xf = (msg) => {
  return {
    value: msg.json(),
    resolve: msg.finish.bind(msg),
    reject: msg.requeue.bind(msg)
  }
}

function * logger (next) {
  const start = new Date()
  yield next
  const ms = new Date() - start
  console.log('%s %s - %s', this.method, this.url, ms)
}

function * processor (next) {
  this.result = { foo: 'bar' }
  yield next
}

const reader = nsq.reader()
reader.on('message', compose(xf, logger, processor))
```

## Badges

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
