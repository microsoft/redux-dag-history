import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    pickRandomColor as doPickRandomColor,
    increment as doIncrement,
    decrement as doDecrement,
} from '../../state/Actions';

const { PropTypes } = React;

interface IVisualBStateProps {
  value: number;
}
interface IVisualBDispatchProps {
  actions: {
    increment: Function;
    decrement: Function;
  }
}
interface IVisualBProps extends IVisualBStateProps, IVisualBDispatchProps{
}

const RawVisualB: React.StatelessComponent<IVisualBProps> = ({ value, actions: { increment, decrement } }) => (
  <div className='visual-b'>
    <div>
      <h1>Value: {value}</h1>
    </div>
    <div>
      <button onClick={() => increment()}>Increment</button>
      <button onClick={() => decrement()}>Decrement</button>
    </div>
  </div>
);
RawVisualB.propTypes = {
  value: PropTypes.number,
  actions: PropTypes.shape({
    increment: PropTypes.func,
    decrement: PropTypes.func,
  }),
};

export default connect<IVisualBStateProps, IVisualBDispatchProps, {}>(
  ({ app: { current: { visuals: { value }}}}) => ({ value }),
  dispatch => ({
    actions: bindActionCreators({
      increment: doIncrement,
      decrement: doDecrement,
    }, dispatch),
  })
)(RawVisualB);
