import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    pickRandomColor as doPickRandomColor,
    increment as doIncrement,
    decrement as doDecrement,
} from '../../state/Actions';

const { PropTypes } = React;

interface IVisualAStateProps {
  backgroundColor: string;
}
interface IVisualADispatchProps {
  actions: {
    pickRandomColor: Function;
  }
}
interface IVisualAProps extends IVisualAStateProps, IVisualADispatchProps {
}

const RawVisualA: React.StatelessComponent<IVisualAProps> = ({ backgroundColor, actions: { pickRandomColor } }) => (
  <div
    className='visual-a'
    style={{ backgroundColor }}
     onClick={() => pickRandomColor()}
  >
    <h1>Color: {backgroundColor}</h1>
  </div>
);
RawVisualA.propTypes = {
  backgroundColor: PropTypes.string,
  actions: PropTypes.shape({
    pickRandomColor: PropTypes.func,
  }),
};

export default connect<IVisualAStateProps, IVisualADispatchProps, {}>(
  ({ app: { current: { visuals: { color: backgroundColor }}}}) => ({ backgroundColor }),
  dispatch => ({ actions: bindActionCreators({ pickRandomColor: doPickRandomColor }, dispatch) })
)(RawVisualA);
