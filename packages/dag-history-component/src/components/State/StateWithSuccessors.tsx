import * as React from 'react';
import State from './State';
import { IStateWithSuccessorsProps } from './interfaces';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './animate-expand.scss';

const StateWithSuccessors: React.StatelessComponent<IStateWithSuccessorsProps> = (props) => {
  const children = props.childStates.map((child, index) => {
    return (
      <li key={index}>
        <State {...child} />
      </li>
    );
  });
  const childList = children.length === 0 ? null : (
    <ul className="successor-state-container">
      {children}
    </ul>
  );

  return (
    <div>
      <State {...props} />
      <ReactCSSTransitionGroup
        transitionName="show-state"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {childList}
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default StateWithSuccessors;
