'use strict'

module.exports = function onNodeRemoved (node) {
  const parent = node.parentNode
  if (!parent || parent.$lifecycleStage === 'detached') {
    cleanupNodeAndChildren(node)
  }
}

function cleanupNodeAndChildren (node) {
  if (node.$lifecycleStage !== 'attached') return
  node.$lifecycleStage = 'detached'

  const cleanupFunctions = node.$cleanupFunctions
  if (cleanupFunctions) {
    for (let cleanupFunction of cleanupFunctions) {
      cleanupFunction(node)
    }
  }

  let child = node.firstChild
  while (child) {
    cleanupNodeAndChildren(child)
    child = child.nextSibling
  }
}
