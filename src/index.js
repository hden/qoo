import co from 'co'
import compose from 'koa-compose'

const identity = (id) => id

/*
 * Trampoline, base middleware that ensure result is resolved.
 */
function * trampoline (next) {
  this.result = this.result ? this.result : {}
  yield next
  this.resolve(this.result)
}

/*
 * Composition
 */
export default (xf = identity, ...middlewares) => {
  const fn = co.wrap(compose([trampoline, ...middlewares]))
  return (...args) => {
    const task = xf(...args)
    return fn.call(task).catch((e) => {
      if (task && typeof task.reject === 'function') {
        task.reject(e)
      }
    })
  }
}
