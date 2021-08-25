export default class Dispatch {
  constructor(invoke) {
    this.action = invoke
  }
  invoke(view) {
    this.action(view)
  }
}