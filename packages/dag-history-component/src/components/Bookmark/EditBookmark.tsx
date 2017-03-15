import * as React from 'react';
import { StateId } from '@essex/redux-dag-history/lib/interfaces';
import './Bookmark.scss';
import * as classnames from 'classnames';
const { PropTypes } = React;
import DiscoveryTrail from '../DiscoveryTrail';

const CloseIcon = require('react-icons/lib/fa/caret-down');

const log = require('debug')('dag-history-component:components:Bookmark');

export interface IEditBookmarkProps {
  name: string;
  annotation: string;
  index: number;
  numLeadInStates?: number;
  active?: boolean;
  onClick?: Function;
  onBookmarkChange?: Function;
  onDoneEditing?: Function;
  shortestCommitPath?: StateId[];
  selectedDepth: number;
  onDiscoveryTrailIndexClicked?: Function;
  onSelectBookmarkDepth?: Function;

  // Injected by React DnD:
  isDragging?: boolean;
}
export interface IEditBookmarkState {}

export default class EditBookmark extends React.Component<IEditBookmarkProps, IEditBookmarkState> {
  private annotationComponent: HTMLTextAreaElement;
  private leadInComponent: HTMLSelectElement;

  public componentDidMount() {
    this.annotationComponent.focus();
  }

  private onDone() {
    const { onDoneEditing } = this.props;
    onDoneEditing();
  }

  private setAnnotationComponent(c) {
    this.annotationComponent = c;
  }

  private setLeadInComponent(c) {
    this.leadInComponent = c;
  }

  private onDoneEditing() {
    const {
      annotation: existingAnnotation,
      numLeadInStates: existingNumLeadInStates,
      onBookmarkChange,
    } = this.props;

    const annotation = this.annotationComponent.value;
    const isBookmarkUpdated = annotation !== existingAnnotation;

    if (isBookmarkUpdated && onBookmarkChange) {
      onBookmarkChange({
        name: this.props.name,
        data: {
          annotation,
          numLeadInStates: existingNumLeadInStates,
        },
      });
    }
  }

  private onLeadInSet(value?: number) {
    const {
      annotation: existingAnnotation,
      numLeadInStates: existingNumLeadInStates,
      onBookmarkChange,
    } = this.props;

    const annotation = this.annotationComponent.value;
    const isBookmarkUpdated = value !== existingNumLeadInStates || annotation !== existingAnnotation;

    if (isBookmarkUpdated && onBookmarkChange) {
      onBookmarkChange({
        name: this.props.name,
        data: {
          annotation,
          numLeadInStates: value,
        },
      });
    }
  }

  private onClick() {
    const {
      selectedDepth: depth,
      index: bookmarkIndex,
      onSelectBookmarkDepth,
      shortestCommitPath,
    } = this.props;

    if (onSelectBookmarkDepth) {
      const state = shortestCommitPath[depth || shortestCommitPath.length - 1];
      onSelectBookmarkDepth({ bookmarkIndex, depth, state });
    }
  }

  public render() {
    const {
      name,
      index,
      annotation,
      active,
      onClick,
      shortestCommitPath,
      selectedDepth,
      numLeadInStates,
      onDiscoveryTrailIndexClicked,
    } = this.props;

    const commitPathLength = shortestCommitPath.length;
    const leadInStatesValue = numLeadInStates !== undefined ? `${numLeadInStates}` : 'all';
    const isIntroSet = numLeadInStates !== undefined;

    log('rendering commitPathLength=%s, selectedDepth=%s', commitPathLength, selectedDepth);
    return (
      <div
        className={`history-bookmark ${active ? 'selected' : ''}`}
        data-index={index}
      >
        <div className="bookmark-details-editable">
          <div style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => this.onClick()}>
            <div
              className={classnames('bookmark-title', { active })}
              tabIndex={0}
            >
              {name}
            </div>
            <CloseIcon tabIndex={1} onClick={() => this.onDone()} />
          </div>
          <textarea
            tabIndex={2}
            style={{ marginTop: 5 }}
            className="bookmark-input bookmark-annotation"
            ref={c => this.setAnnotationComponent(c)}
            name="bookmarkAnnotation"
            cols={40}
            rows={5}
            placeholder="Enter caption for presentation"
            defaultValue={annotation}
            onFocus={() => onClick()}
            onBlur={() => this.onDoneEditing()}
          />
          <div>
            <div className="bookmark-controls-container" onClick={() => this.onClick()}>
              <span className="discovery-trail-label">Discovery trail</span>
              <button
                className="discovery-trail-intro-button"
                style={{marginLeft: 5}}
                tabIndex={3}
                onClick={(e) => this.onLeadInSet(commitPathLength - selectedDepth - 1)}
              >
                Set intro
              </button>
            </div>
            <DiscoveryTrail
              depth={commitPathLength - 1}
              highlight={selectedDepth}
              leadIn={numLeadInStates}
              active={active}
              onIndexClicked={idx => onDiscoveryTrailIndexClicked(idx)}
            />
          </div>
        </div>
      </div>
    );
  }
}
