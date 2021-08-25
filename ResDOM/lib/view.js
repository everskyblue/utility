import Dispatch from './dispatch.js'
import Queue from './queue.js'
import action from './action.js'

export default class View {
  constructor(id) {
    this.id = id() || id;
    this.queue = new Queue(this);
  }
  setViewOnListener(on) {
    if (typeof this.id !== 'function') {
      action(this, on);
    } else {
      this.queue.setStore( new Dispatch(() => action(this, on)) );
    }
    return this;
  }
}