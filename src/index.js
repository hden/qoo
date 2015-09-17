import co from 'co'
import compose from 'koa-compose'

const identity = (id) => id

/*
 * Trampoline, base middleware that ensure result is resolved.
 * @private
 * @param {generator function} next step
 */
function * trampoline (next) {
  this.result = this.result ? this.result : {}
  yield next
  this.resolve(this.result)
}

/*
 * Composition
 * @public
 * @param {function} transformer
 * @param {generator function} middlewares
 * @return {function} callback
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
