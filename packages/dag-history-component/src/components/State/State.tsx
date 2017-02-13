import * as React from 'react';
import * as classnames from 'classnames';
import Continuation from '../Continuation';
import colors from '../../palette';
import './State.scss';
import { IStateProps } from './interfaces';

const Bookmark = require('react-icons/lib/io/bookmark');
const { PropTypes } = React;

const coloring = {
  current: {
    active: colors.CURRENT_ACTIVE,
    nonactive: colors.CURRENT,
  },
  legacy: {
    active: colors.LEGACY_ACTIVE,
    nonactive: colors.ANCESTOR,
  },
};

function getBackgroundColor(branchType, active) {
  let result = null;
  result = coloring[branchType][active ? 'active' : 'nonactive'];
  return result;
}

function continuationColor(isActive, isPinned) {
  let result = colors.CONT_BLANK;
  if (isPinned) {
    result = colors.CONT_PINNED;
  } else if (isActive) {
    result = colors.CONT_ACTIVE;
  }
  return result;
}

const State: React.StatelessComponent<IStateProps> = ({
  id,
  source,
  label,
  branchType,
  active,
  renderBookmarks,
  bookmarked,
  numChildren,
  onClick,
  onContinuationClick,
  onBookmarkClick,
  showContinuation,
  pinned,
}) => {
  const backgroundColor = getBackgroundColor(branchType, active);

  const handleClick = (e) => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleContinuationClick = (e) => {
    if (onContinuationClick) {
      onContinuationClick(id);
    }
  };

  const handleBookmarkClick = (e) => {
    if (onBookmarkClick) {
      onBookmarkClick(id);
    }
  };

  return (
    <div
      className="history-state"
      style={{ backgroundColor }}
      onClick={e => handleClick(e)}
    >
      <Continuation
        count={numChildren}
        color={continuationColor(active, pinned)}
        onClick={(e) => handleContinuationClick(e)}
      />
      <div className="state-detail">
        <div className={classnames('state-source', { active })}>
          {source || ''}
        </div>
        <div className={classnames('state-name', { active })}>
          {label || ''}
        </div>
      </div>
      {
        renderBookmarks &&
          <Bookmark
            size={25}
            color={bookmarked ? 'gold' : 'white'}
            onClick={e => handleBookmarkClick(e)}
          />
      }
    </div>
  );
};

State.propTypes = {
  id: PropTypes.number.isRequired,
  source: PropTypes.string,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  pinned: PropTypes.bool,
  bookmarked: PropTypes.bool,
  renderBookmarks: PropTypes.bool,
  numChildren: PropTypes.number,
  branchType: PropTypes.oneOf(['current', 'legacy']),
  onBookmarkClick: PropTypes.func,
  onClick: PropTypes.func,
  onContinuationClick: PropTypes.func,
  showContinuation: PropTypes.bool,
};
State.defaultProps = {
  id: undefined,
  source: undefined,
  showContinuation: true,
  label: '',
  branchType: 'current',
  numChildren: 0,
};

export default State;
