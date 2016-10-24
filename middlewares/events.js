'use strict'

const compiler = require('@risingstack/nx-compile')
window.counter = 0
const secret = {
  handlers: Symbol('event handlers')
}

module.exports = function events (elem, state, next) {
  if (!(elem instanceof Element)) return
  elem.$require('code')
  elem.$using('events')

  elem[secret.handlers] = new Map()
  next()

  const attributes = elem.attributes
  for (let i = attributes.length; i--;) {
    const attribute = attributes[i]
    if (attribute.name[0] === '#') {
      const handler = elem.$compileCode(attribute.value)
      const names = attribute.name.slice(1).split(',')
      for (let name of names) {
        let handlers = elem[secret.handlers].get(name)
        if (!handlers) {
          handlers = new Set()
          elem[secret.handlers].set(name, handlers)
        }
        handlers.add(handler)
        elem.addEventListener(name, listener, true)
      }
      elem.removeAttribute(attribute.name)
    }
  }
}

function listener (event) {
  const handlers = this[secret.handlers].get(event.type)
  for (let handler of handlers) {
    handler({ $event: event })
  }
}
