export default function action(view, actions) {
  const e = view.id;
  for (var prop in actions) {
    if (e.addEventListener) e.addEventListener(prop, actions[prop], false);
    else e.detachEvent(`on${prop}`, actions[prop]);
  }
}