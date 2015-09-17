/* global describe, it, beforeEach */
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import compose from '../'

chai.use(sinonChai)
const { expect } = chai

/*
 * Mock task interface
 */
class Task {
  constructor (value = {}) {
    this.value = value
    this.resolve = sinon.spy()
    this.reject = sinon.spy()
  }
}

describe('qoo', () => {
  const identity = (id) => id
  const noop = function * () { this.result = this.value }

  let task
  beforeEach(() => {
    task = new Task({ foo: 'bar' })
  })

  it('interface', () => {
    expect(compose).to.be.a('function')
    expect(compose()).to.be.a('function')
  })

  it('should invoke middleware', () => {
    const fn = compose(identity, noop)
    return fn(task).then(() => {
      expect(task.resolve).to.have.been.calledWith({ foo: 'bar' })
    })
  })

  it('should reject errors', () => {
    const e = new Error('foobar')
    const fn = compose(identity, function * () { throw e })
    return fn(task).then(() => {
      expect(task.resolve).to.not.been.called
      expect(task.reject).to.have.been.calledWith(e)
    })
  })

  it('should invoke transform function', () => {
    const xf = sinon.spy(() => {
      return { transformed: true }
    })
    let ctx
    const fn = compose(xf, function * () { ctx = this })
    return fn({ input: true }).then(() => {
      expect(xf).to.have.been.calledWith({ input: true })
      expect(ctx).to.have.property('transformed', true)
    })
  })
})
