import * as Actions from '../../Actions';

const INITIAL_STATE = {
  value: 0,
  color: '#FF0000',
};

function randomColor() {
  return `#${Math.floor((Math.random() * 0xFFFFFF)).toString(16)}`;
}

export default function reduce(state = INITIAL_STATE, action) {
  let result = state;
  if (action.type === Actions.INCREMENT) {
    result = { ...state, value: state.value + 1 };
  } else if (action.type === Actions.DECREMENT) {
    result = { ...state, value: state.value - 1 };
  } else if (action.type === Actions.PICK_RANDOM_COLOR) {
    result = { ...state, color: randomColor() };
  }
  return result;
}
