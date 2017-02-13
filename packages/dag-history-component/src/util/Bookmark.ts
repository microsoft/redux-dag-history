import DagGraph from '@essex/redux-dag-history/lib/DagGraph'; // eslint-disable-line

/**
 * Represents bookmark data for our bookmark
 */
export default class Bookmark {
  /**
   * Constructs a bookmark
   * @param bookmark - The bookmark item in the history graph
   * @param graph - The source graph for the bookmark
   */
  constructor( // eslint-disable-line
    private bookmark: any, // eslint-disable-line
    private graph: DagGraph<any>, // eslint-disable-line
  ) { // eslint-disable-line
  }

  public get numLeadInStates() {
    const { bookmark } = this;
    return bookmark && bookmark.data && bookmark.data.numLeadInStates;
  }

  public get annotation() {
    const { bookmark } = this;
    return bookmark && bookmark.data && bookmark.data.annotation;
  }

  public get name() {
    const { bookmark } = this;
    return bookmark.name;
  }

  public get stateId() {
    const { bookmark } = this;
    return bookmark.stateId;
  }

  public get slideText() {
    return this.annotation || this.name || 'No slide data';
  }

  public get commitPath() {
    return this.graph.shortestCommitPath(this.stateId);
  }

  public get presentedPath() {
    return this.commitPath.slice(this.hiddenPathLength);
  }

  public get commitPathLength() {
    return this.commitPath.length;
  }

  public get presentedPathLength() {
    // Lead in + final state
    return (this.numLeadInStates || 0) + 1;
  }

  public get hiddenPathLength() {
    return this.commitPathLength - this.presentedPathLength;
  }

  public startingDepth() {
    const isLeadInDefined = this.numLeadInStates !== undefined;
    return isLeadInDefined ? this.hiddenPathLength : undefined;
  }

  public isDepthAtEnd(depth: number) {
    return depth === undefined || depth >= this.commitPathLength - 1;
  }

  public isDepthAtStart(depth: number) {
    if (depth === 0) {
      return true;
    }
    if (depth === undefined) {
      return this.startingDepth === undefined;
    }

    let startingDepth = this.startingDepth();
    if (startingDepth === undefined) {
      startingDepth = this.commitPath.length - 1;
    }
    return depth === startingDepth;
  }

  public getStateAtDepth(depth?: number) {
    if (depth === undefined) {
      return this.commitPath[this.commitPath.length - 1];
    }
    return this.commitPath[depth];
  }

  public sanitizeDepth(depth?: number) {
    if (depth !== undefined) {
      return depth;
    }
    const { commitPathLength } = this;
    return commitPathLength > 0 ? commitPathLength - 1 : 0;
  }
}
