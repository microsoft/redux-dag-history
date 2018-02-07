import * as ReduxActions from 'redux-actions';

// Action Types
export const PICK_RANDOM_COLOR = 'PICK_RANDOM_COLOR';
export const INCREMENT = 'INCREMENT_VALUE';
export const DECREMENT = 'DECREMENT_VALUE';

// Action Creators
export const pickRandomColor = ReduxActions.createAction(PICK_RANDOM_COLOR);
export const increment = ReduxActions.createAction(INCREMENT);
export const decrement = ReduxActions.createAction(DECREMENT);
