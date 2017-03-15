import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS as ImmutableFromJS,
} from 'immutable';
import {
  BranchId,
  StateId,
  StateHash,
} from './interfaces';

const log = require('debug')('redux-dag-history:DagGraph');
const treeify = require('treeify');

/**
 * A convenient wrapper around the ImmutableJS-based Dag-History data structure
 */
export default class DagGraph<T> {
  /**
   * Constructs a new instance
   * @param graph The immutableJS instance
   */
  constructor(public graph: ImmutableMap<any, any>) {
    if (!graph) {
      throw new Error('\'graph\' parameter must be defined');
    }
    if (!graph.getIn) {
      throw new Error('\'graph\' must be an immutablejs instance');
    }
  }

  /**
   * Print out the state graph in the console, for debug purposes
   */
  public print(): string {
    const graph = this.graph.toJS();
    let root: any = null;
    const states = {};
    const getOrCreateState = (stateId: StateId) => {
      let result = states[stateId];
      if (!result) {
        result = {
          id: stateId,
          name: this.stateName(stateId),
          children: [] as StateId[],
        };
        states[stateId] = result;
      }
      return result;
    };

    Object.keys(graph.states || {}).forEach(stateId => {
      const parentId = graph.states[stateId].parent;
      const state = getOrCreateState(stateId);
      if (!parentId) {
        root = state;
      }
      getOrCreateState(parentId).children.push(state);
      states[stateId] = state;
    });

    const tree = {
      current: graph.current,
      chronologicalStates: graph.chronologicalStates,
      branches: graph.branches,
      // states: graph.states,
      dag: root,
    };
    const result = treeify.asTree(tree, true);
    return result;
  }

  /**
   * Gets the current state ID
   */
  public get currentStateId(): StateId {
    return this.graph.getIn(['current', 'state']);
  }

  /**
   * Gets the start depth of the current branch
   * (i.e. how many commits it took from the dag root to reach the start of the current branch)
   * @param branch The BranchId to get the starting depth of
   */
  public branchStartDepth(branch: BranchId): number {
    return this.stateDepth(this.firstOn(branch));
  }

  /**
   * Gets the ending depth of the current branch
   * (i.e. how many commits it took from the dag root to reach the end of the current branch)
   * @param branch The BranchId to get the starting depth of
   */
  public branchEndDepth(branch: BranchId): number {
    return this.stateDepth(this.latestOn(branch));
  }

  /**
   * Gets the depth of a specific state
   * (i.e. how many commits it took from the root to reach the state)
   * @param branch The BranchId to get the starting depth of
   */
  public stateDepth(commit: StateId): number {
    return this.commitPath(commit).length - 1;
  }

  /**
   * Gets the depth of a commit on a branch
   * (i.e. how many commits it took from the root to reach the commit on the branch)
   * @param branch The branch to qualify the commit
   * @param commit The commit to get the depth of
   */
  public depthIndexOf(branch: BranchId, commit: StateId): number {
    const commits = this.branchCommitPath(branch);
    let foundIndex = commits.indexOf(commit);
    if (foundIndex === -1) {
      return undefined;
    } else {
      const start = this.branchStartDepth(branch);
      return start + foundIndex;
    }
  }

  /**
   * Gets the maximum depth of the graph
   */
  public get maxDepth(): number {
    const branches = this.branches;
    const branchDepths = branches.map(b => this.branchEndDepth(b));
    let max: number = -1;
    branchDepths.forEach(d => {
      if (d > max) {
        max = d;
      }
    });
    return max;
  }

  /**
   * Mutate the current state id
   * @param stateId The new state id
   */
  public setCurrentStateId(stateId: StateId) {
    this.graph = this.graph.setIn(['current', 'state'], stateId);
    this.logVisit(stateId);
    return this;
  }

  /**
   * Get the current branch id
   */
  public get currentBranch(): BranchId {
    return this.graph.getIn(['current', 'branch']);
  }

  /**
   * Get the last-generated state id
   */
  public get lastStateId(): StateId {
    return this.graph.get('lastStateId');
  }

  /**
   * Set the last-generated state id
   */
  public setLastStateId(value: StateId) {
    this.graph = this.graph.set('lastStateId', value);
    return this;
  }

  /**
   * Get the last-generated branch id
   */
  public get lastBranchId(): StateId {
    return this.graph.get('lastBranchId');
  }

  /**
   * Set the last-generated branch id
   */
  public setLastBranchId(value: BranchId) {
    this.graph = this.graph.set('lastBranchId', value);
    return this;
  }

  /**
   * Mutate the current branch id
   * @param branchId The new branch id
   */
  public setCurrentBranch(branchId: BranchId) {
    this.graph = this.graph.setIn(['current', 'branch'], branchId);
    return this;
  }

  /**
   * Gets the latest state id on a given branch
   * @param branch The branch to search on
   */
  public latestOn(branch: BranchId): StateId {
    return this.graph.getIn(['branches', `${branch}`, 'latest']);
  }

  /**
   * Gets the 'committed' state id on a given branch.
   * Pushing new states bumps the committed state id. The 'committed' state is the most recently visited in a branch.
   * @param branch The branch to search on
   */
  public committedOn(branch: BranchId): StateId {
    return this.graph.getIn(['branches', `${branch}`, 'committed']);
  }

  /**
   * Updates the latest state on the branch
   * @param branch The branch id
   * @param commit The new latest commit on the branchd
   */
  public setLatest(branch: BranchId, commit: StateId) {
    this.graph = this.graph.setIn(['branches', `${branch}`, 'latest'], commit);
    return this;
  }

  /**
   * Updates the committed state on the branch
   * @param branch The branch id
   * @param commit The committed state id
   */
  public setCommitted(branch: BranchId, commit: StateId) {
    this.graph = this.graph.setIn(['branches', `${branch}`, 'committed'], commit);
    return this;
  }

  /**
   * Each state is mapped to a single branch. This updates the branch for a state.
   * @param commit The state id
   * @param branch The branch that is now associated with the state.
   */
  public markStateForBranch(commit: StateId, branch: BranchId) {
    this.graph = this.graph.setIn(['states', `${commit}`, 'branch'], branch);
    return this;
  }

  /**
   * Sets the first state id of a branch
   * @param branch The branch id
   * @param commit The first state id on the branch
   */
  public setFirst(branch: BranchId, commit: StateId) {
    this.graph = this.graph.setIn(['branches', `${branch}`, 'first'], commit);
    return this;
  }

  /**
   * Gets the first state id on a branch
   * @param branch The branch to search on
   */
  public firstOn(branch: BranchId): StateId {
    return this.graph.getIn(['branches', `${branch}`, 'first']);
  }

  /**
   * Update the name of a state
   * @param commit The id of the state to rename
   * @param name The new name of the state
   */
  public renameState(commit: StateId, name: string) {
    this.graph = this.graph.setIn(['states', `${commit}`, 'name'], name);
    return this;
  }

  /**
   * Gets the name of a given state
   * @param commit The state id to get the name of
   */
  public stateName(commit: StateId) {
    return this.graph.getIn(['states', `${commit}`, 'name']);
  }

  /**
   * Gets the name of a branch
   * @param branch The branch to get the name of
   */
  public getBranchName(branch: BranchId): string {
    return this.graph.getIn(['branches', `${branch}`, 'name']);
  }

  /**
   * Sets the name of a branch
   * @param branch The branch to set the name of
   * @param name The new branch name
   */
  public setBranchName(branch: BranchId, name: string) {
    this.graph = this.graph.setIn(['branches', `${branch}`, 'name'], name);
    return this;
  }

  /**
   * Retrieve the physical state of a state id
   * @param commit The state id to get the physical state of
   */
  public getState(commit: StateId): T {
    return this.graph.getIn(['physicalStates', `${commit}`]);
  }

  /**
   * Inserts a new state
   * @param commit The new state id
   * @param parent The parent state id
   * @param state The physical state
   * @param name The name of the state
   */
  public insertState(commit: StateId, parent: StateId, state: T, name: string) {
    log('Inserting new commit', commit);
    if (this.graph.getIn(['states', `${commit}`])) {
      log('Commit %s is already present', this.getState(commit));
    }

    this.graph = this.graph
      .setIn(['states', `${commit}`], ImmutableFromJS({name, parent}))
      .setIn(['physicalStates', `${commit}`], state);
    return this;
  }

  /**
   * Logs a state visitation into the chronological state array
   */
  public logVisit(state: StateId) {
    const chronologicalStates = this.graph.get('chronologicalStates') as ImmutableList<any>;
    this.graph = this.graph.setIn(['chronologicalStates'], chronologicalStates.push(state));
    return this;
  }

  /**
   * Get child state ids of a given state id.
   * @param commit The parent state id
   */
  public childrenOf(commit: StateId): StateId[] {
    const states = this.graph.get('states');

    return states.toSeq()
      .filter((state: ImmutableMap<any, any>) => state.get('parent') === commit)
      .map((state: ImmutableMap<any, any>, key: string) => key)
      .toList().toJS();
  }

  /**
   * Gets the parent state id of a given state id
   * @param commit The state id to get the parent state id of
   */
  public parentOf(commit: StateId): StateId {
    return this.graph.getIn(['states', `${commit}`, 'parent']);
  }

  /**
   * Gets 'alternate parents' for a given state. As the graph is expanded,
   * and if state equality is enabled, then we can determine optimal paths to a given state as
   * it is re-discovered through alternative means.
   *
   * i.e. When this happens
   *
   * Original Visitiation
   *
   * a -> b -> c -> D // orginal path
   *      \--> D'     // branched path
   *
   * And D and D' are considered logically equivalent, then the parent state of D remains
   * 'c', but 'b' is added as an 'alternate parent'
   *
   * @param commit The state id to find "alternate parents" of
   */
  public alternateParentsOf(commit: StateId): StateId[] {
    const result = this.graph.getIn(['states', `${commit}`, 'alternateParents']);
    return result ? result.toJS() : [];
  }

  /**
   * Gets the shallowest parent of a commit. Compares the graph-depth of the parent and
   * alternate parents.
   * @param commit The state id to search on
   */
  public shallowestParentOf(commit: StateId): StateId {
    const allParents = [
      this.parentOf(commit),
      ...this.alternateParentsOf(commit),
    ];

    let result: StateId = undefined;
    let minDepth: number = undefined;
    allParents.forEach(t => {
      const depth = this.depthIndexOf(this.branchOf(t), t);
      if (minDepth === undefined || depth < minDepth) {
        minDepth = depth;
        result = t;
      }
    });
    return result;
  }

  /**
   * Replace the physical state of a stateId
   * @param commit The state ID to replace
   * @param state The new state
   */
  public replaceState(commit: StateId, state: T) {
    this.graph = this.graph.setIn(['physicalStates', `${commit}`], state);
    return this;
  }

  /**
   * Gets the state-id path of a state id
   * @param commit The state id to get the commit path of
   */
  public commitPath(commit: StateId): StateId[] {
    if (commit === undefined) {
      return [];
    }

    const path: StateId[] = [commit];
    let current = commit;
    do {
      const parent = this.parentOf(current);
      if (parent) {
        path.unshift(parent);
      }
      current = parent;
    } while (current);
    return path;
  }

  /**
   * Gets the shortest path of a state id, considering alternate parentage
   * @param commit The state id to get the commit path of
   */
  public shortestCommitPath(commit: StateId): StateId[] {
    if (commit === undefined) {
      return [];
    }
    const path: StateId[] = [commit];
    let current = commit;
    do {
      const parent = this.shallowestParentOf(current);
      if (parent) {
        path.unshift(parent);
      }
      current = parent;
    } while (current);
    return path;
  }

  /**
   * Gets a path of all state ids on a branch
   * @param branch The branch to get the commit path on
   */
  public branchCommitPath(branch: BranchId): StateId[] {
    if (branch === undefined) {
      return [];
    }
    const latest = this.latestOn(branch);
    const path = this.commitPath(latest);
    const firstCommitOnBranch = this.firstOn(branch);
    return path.slice(path.indexOf(firstCommitOnBranch));
  }

  /**
   * Sets the parent state id of a child state
   * @param commit The child state id
   * @param parent The parent state id
   */
  public setParent(commit: StateId, parent: StateId) {
    this.graph = this.graph.setIn(['states', `${commit}`, 'parent'], parent);
  }

  /**
   * Adds an alternate parent to a state id
   * @param commit The state id
   * @param parent The new alternate parent
   */
  public setAlternateParent(commit: StateId, parent: StateId) {
    if (this.parentOf(commit) !== parent) {
      return;
    }
    const path = ['states', `${commit}`, 'alternateParents'];
    const parentList: ImmutableList<StateId> =
      this.graph.getIn(path) as ImmutableList<StateId> ||
      ImmutableList<StateId>();

    if (!parentList.contains(parent)) {
      this.graph = this.graph.setIn(path, parentList.push(parent));
    }
  }

  /**
   * Gets the list of branch ids available
   */
  public get branches(): BranchId[] {
    const branches = this.graph.get('branches');
    return Array.from(branches.keys()) as BranchId[];
  }

  /**
   * Gets the branch a state is associated with
   * @param commit The state id
   */
  public branchOf(commit: StateId): BranchId {
    return this.graph.getIn(['states', `${commit}`, 'branch']);
  }

  /**
   * Gets all of the branches that a given state id is ancestral for.
   *
   * i.e. search all children and aggregate branch ids
   *
   * @param commit The state id to search on
   */
  public branchesOf(commit: StateId): BranchId[] {
    if (!commit) {
      throw new Error('commit must be defined');
    }
    const children = this.childrenOf(commit);
    if (children.length === 0) {
      const branches: BranchId[] = [];
      for (let branch of this.branches) {
        if (this.latestOn(branch) === commit) {
          branches.push(branch);
        }
      }
      return branches;
    } else {
      let result: BranchId[] = [];
      let childrenBranches = children.map(child => this.branchesOf(child));
      childrenBranches.forEach(cb => result = result.concat(...cb));
      return result;
    }
  }

  /**
   * Remove a state from the graph
   * @param commit The state to remove
   */
  private remove(commit: StateId) {
    // TODO: we should remove this from the branch list and other metadata as well.
    // This will be how we keep the DAG pruned to a fixed size.
    this.graph = this.graph
      .deleteIn(['states', `${commit}`])
      .deleteIn(['physicalStates', `${commit}`]);
  }

  /**
   * Squash a branch down to one commit
   */
  public squashCurrentBranch() {
    const toSquash: StateId[] = [];
    const branch = this.branchOf(this.currentStateId);
    let current = this.parentOf(this.currentStateId);
    let keepSquashing = true;

    do {
      if (current && this.branchOf(current) === branch) {
        toSquash.push(current);
        current = this.parentOf(current);
      } else {
        keepSquashing = false;
      }
    } while (keepSquashing);

    log('squashing %s states on branch %s => ', toSquash.length, branch, current, toSquash);
    if (toSquash.length > 0) {
      toSquash.forEach(c => this.remove(c));
      this.setParent(this.currentStateId, current);
    }

    return this;
  }

  /**
   * Search for a state by hash code
   * @param hash The hash code to search for
   */
  public getStateForHash(hash: StateHash): StateId {
    return this.graph.getIn(['stateHash', hash]);
  }

  /**
   * Registers a state with a hash code. Existing hashes are removed
   * @param hash The hash code to register.
   */
  public setHashForState(hash: StateHash, state: StateId): void {
    const stateHashPath = ['states', state, 'hash'];
    const existingHash = this.graph.getIn(stateHashPath);

    // Remove the hash from the state description and the hash->state map
    if (existingHash) {
      this.graph = this.graph
        .removeIn(stateHashPath)
        .deleteIn(['stateHash', existingHash]);
    }

    this.graph = this.graph
      .setIn(stateHashPath, hash)
      .setIn(['stateHash', hash], state);
  }
}
