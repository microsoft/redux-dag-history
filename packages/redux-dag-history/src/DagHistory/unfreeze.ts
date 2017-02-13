export default function unfreeze(state: any) {
  return state && state.toJS ? state.toJS() : state;
}
