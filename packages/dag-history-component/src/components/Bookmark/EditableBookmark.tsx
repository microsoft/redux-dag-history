import * as React from 'react';
import * as classnames from 'classnames';
import './Bookmark.scss';
import EditBookmark from './EditBookmark';
import {default as Bookmark, IBookmarkProps } from './Bookmark';
import DiscoveryTrail from '../DiscoveryTrail';
const { PropTypes } = React;

export interface IEditableBookmarkProps extends IBookmarkProps {
  index: number;
  numLeadInStates?: number;
  onBookmarkChange?: Function;
  shortestCommitPath?: number[];
  selectedDepth?: number;
  onSelectBookmarkDepth?: Function;
}

export interface IEditableBookmarkState {
  editMode: boolean;
  focusOn?: string;
}

export default class EditableBookmark extends React.PureComponent<IEditableBookmarkProps, IEditableBookmarkState> {
  public static propTypes = {
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    annotation: PropTypes.string.isRequired,
    numLeadInStates: PropTypes.number,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    onBookmarkChange: PropTypes.func,
    onDiscoveryTrailIndexClicked: PropTypes.func,
    shortestCommitPath: PropTypes.arrayOf(PropTypes.number),
    selectedDepth: PropTypes.number,
    onSelectBookmarkDepth: PropTypes.func,
  };

  public static defaultProps = {
    shortestCommitPath: [],
  };

  constructor() {
    super();
    this.state = { editMode: false };
  }

  onClickEdit(focusOn) {
    this.setState({ editMode: true, focusOn });
  }

  onDoneEditing() {
    this.setState({ editMode: false });
  }

  render() {
    const {
      editMode,
      focusOn,
    } = this.state;

    const innerBookmark = editMode ? (
      <EditBookmark
        {...this.props}
        focusOn={focusOn}
        onDoneEditing={() => this.onDoneEditing()}
      />
    ) : (
      <Bookmark
        {...this.props}
        onClickEdit={t => this.onClickEdit(t)}
      />
    );
    return (
      <div>
        {innerBookmark}
      </div>
    );
  }
}
