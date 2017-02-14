import * as React from 'react';
import State from '../State';
import isNumber from '../../util/isNumber';
import { IStateProps } from '../State/interfaces';
import { TransitionMotion, spring, presets } from 'react-motion';

export interface IStateListProps {
  states: IStateProps[];
  activeStateId?: number;
  onStateClick?: Function;
  onStateContinuationClick?: Function;
  renderBookmarks?: boolean;
  onStateBookmarkClick?: Function;
}

export interface IStateListState {
}

const FULL_HEIGHT = 30;
const springConfig = presets.stiff;

export default class StateList extends React.Component<IStateListProps, IStateListState> {
  private containerDiv: HTMLDivElement;

  static propTypes = {
    states: React.PropTypes.arrayOf(React.PropTypes.shape(State.propTypes)).isRequired,
    activeStateId: React.PropTypes.number,
    onStateClick: React.PropTypes.func,
    onStateContinuationClick: React.PropTypes.func,
    renderBookmarks: React.PropTypes.bool,
    onStateBookmarkClick: React.PropTypes.func,
  };

  public componentDidUpdate() {
    this.containerDiv.scrollTop = this.containerDiv.scrollHeight;
  }

  public render() {
    const {
      states,
      activeStateId,
      onStateClick,
      onStateContinuationClick,
      renderBookmarks,
      onStateBookmarkClick,
    } = this.props;

    const handleClick = (id) => {
      if (onStateClick) {
        onStateClick(id);
      }
    };

    const handleContinuationClick = (id) => {
      if (onStateContinuationClick) {
        onStateContinuationClick(id);
      }
    };

    const handleBookmarkClick = (id) => {
      if (onStateBookmarkClick) {
        onStateBookmarkClick(id);
      }
    };

    const stateWillEnter = () => ({
      height: 0,
      opacity: 1,
    });

    const stateWillLeave = (leaving) => {
      if (!leaving.data.startLeave) {
        leaving.data.startLeave = Date.now();
      } else if (Date.now() - leaving.data.startLeave >= 200) {
        return null;
      }
      return {
        opacity: spring(0, springConfig),
        height: spring(0, springConfig),
      };
    };

    const getDefaultStyles = () => states.map(s => ({
      key: `${s.id}`,
      data: s,
      style: {
        height: 0,
        opacity: 1,
      }
    }));
    const getStyles = () => states.map(s => ({
      key: `${s.id}`,
      data: s,
      style: {
        height: spring(FULL_HEIGHT, springConfig),
        opacity: spring(1, springConfig),
      },
    }));
    return (
      <TransitionMotion
        willEnter={stateWillEnter}
        willLeave={stateWillLeave}
        defaultStyles={getDefaultStyles()}
        styles={getStyles()}
      >
        {interpolatedStyles => (
          <div ref={(e) => (this.containerDiv = e)} className="state-list-container">
            {interpolatedStyles.map(config => {
              const s = config.data;
              return (
                <State
                  {...s}
                  {...{ renderBookmarks }}
                  style={{ ...config.style }}
                  key={config.key}
                  active={isNumber(activeStateId) && s.id === activeStateId}
                  onClick={(id) => handleClick(id)}
                  onContinuationClick={(id) => handleContinuationClick(id)}
                  onBookmarkClick={(id) => handleBookmarkClick(id)}
                />
              );
            })}
          </div>
        )}
      </TransitionMotion>
    );
  }
}
