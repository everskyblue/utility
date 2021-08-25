export default class Queue {
  constructor(view) {
    this.store = [];
    this.view = view;
  }
  setStore(dispatch) {
    this.store.push(dispatch)
  }
  exec() {
    this.store.forEach(dispatch => {
      dispatch.invoke(this.view);
    });
  }
}