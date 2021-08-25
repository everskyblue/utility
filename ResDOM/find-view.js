import MutationObserver from './lib/mutation.js'
import View from './lib/view.js'
import * as handler from './lib/handler.js'


/**
 * @type {Set<View>}
 */
const views = new Set();
const filter = ['attributes', 'childList'];

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (filter.includes(mutation.type) && mutation.target) {
      updateId();
    }
  })
})

observer.observe(document.body, {
  subtree: true,
  attributeFilter: ['id']
})

function updateId() {
  for (let view of views) {
    if (typeof view.id === 'function') {
      const id = view.id();
      if (id) view.id = id;
    }
  }
}

export default class R {
  static get id() {
    return new Proxy({}, handler.viewID)
  }

  static findViewById(id) {
    const view = new View(id);

    view.watch('id', (id, oldValue, nwValue) => {
      setTimeout(() => view.queue.exec(), 0);
      return nwValue
    })
    
    views.add(view);
    
    return view;
  }
}