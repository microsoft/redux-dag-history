import * as Actions from '../../Actions';

const DEFAULT_STATE = {
  name: 'INIT',
  historyIndex: 0,
  source: null,
};

export default function reduce(state = DEFAULT_STATE, action) {
  if (action.type === Actions.INCREMENT) {
    return {
      name: 'Increment Value',
      source: 'Incrementer',
      historyIndex: state.historyIndex + 1,
    };
  } else if (action.type === Actions.DECREMENT) {
    return {
      name: 'Decrement Value',
      source: 'Incrementer',
      historyIndex: state.historyIndex + 1,
    };
  } else if (action.type === Actions.PICK_RANDOM_COLOR) {
    return {
      name: 'Pick Random Color',
      source: 'Color Picker',
      historyIndex: state.historyIndex + 1,
    };
  }
  return state;
}
