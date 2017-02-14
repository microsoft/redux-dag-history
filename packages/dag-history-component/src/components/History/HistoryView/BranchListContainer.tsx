import * as React from 'react';
import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import BranchList from '../../BranchList';
import isNumber from '../../../util/isNumber';

const { PropTypes } = React;

const log = require('debug')('dag-history-component:components:HistoryView');

function getCurrentCommitPath(historyGraph) {
  const { currentBranch } = historyGraph;
  const latestCommitOnBranch = historyGraph.latestOn(currentBranch);
  return historyGraph.commitPath(latestCommitOnBranch);
}

export interface IBranchListContainerProps {
  history: IDagHistory<any>;
  pinnedStateId: number;
  onRenameBranch: Function;
  onBranchSelect: (id: number) => void;
}

export interface IBranchListContainerState {
}

export default class BranchListContainer extends React.Component<IBranchListContainerProps, IBranchListContainerState> {
  public static propTypes = {
    history: PropTypes.object.isRequired,
    pinnedStateId: PropTypes.number,
    onBranchSelect: PropTypes.func,
    onRenameBranch: PropTypes.func,
  };

  getBranchList(historyGraph, commitPath) {
    const {
      branches,
      currentBranch,
      currentStateId,
    } = historyGraph;
    const {
      pinnedStateId: pinnedState,
      onRenameBranch,
    } = this.props;
    const pinnedStateBranch = historyGraph.branchOf(pinnedState);

    // Determine what branches are on the commit path
    const branchPaths = {};
    const branchPath = commitPath.map(commit => historyGraph.branchOf(commit));
    branchPath.forEach((branch, index) => {
      if (branchPaths[branch]) {
        branchPaths[branch].end = index;
      } else {
        branchPaths[branch] = { start: index, end: index };
      }
    });

    // This is a hash of branchId -> stateId
    const selectedSuccessorsByBranch = {};
    if (isNumber(pinnedState)) {
      historyGraph.childrenOf(pinnedState).forEach((child) => {
        const branch = historyGraph.branchOf(child);
        selectedSuccessorsByBranch[branch] = child;
      });
    }

    const getSuccessorDepth = (branch) => {
      const successorId = selectedSuccessorsByBranch[branch];
      return successorId ?
        historyGraph.depthIndexOf(branch, successorId) :
        null;
    };

    const getPinnedStateDepth = (branch) => {
      if (!isNumber(pinnedState) || pinnedStateBranch !== branch) {
        return null;
      }
      return historyGraph.depthIndexOf(branch, pinnedState);
    };

    const activeStateBranch = historyGraph.branchOf(currentStateId);
    const activeStateIndex = historyGraph.depthIndexOf(activeStateBranch, currentStateId);

    let maxDepth = 0;
    const branchData = {};
    branches.forEach((branch) => {
      const startsAt = historyGraph.branchStartDepth(branch);
      const endsAt = historyGraph.branchEndDepth(branch);
      const length = (endsAt - startsAt);
      maxDepth = Math.max(maxDepth, length);
      branchData[branch] = {
        startsAt,
        endsAt,
        length,
      };
    });

    return branches.sort((a, b) => a - b).reverse().map((branch) => {
      const { startsAt, endsAt } = branchData[branch];
      const branchType = currentBranch === branch ? 'current' : 'legacy';
      const label = historyGraph.getBranchName(branch);
      const showActiveStateIndex = currentBranch === branch || activeStateBranch === branch;

      // Figure out where this branch intersects the commit path
      const myBranchPath = branchPaths[branch];
      const currentBranchStart = myBranchPath ? myBranchPath.start : null;
      const currentBranchEnd = myBranchPath ? myBranchPath.end : null;
      const successorDepth = !isNumber(pinnedState) ?
        null :
        getSuccessorDepth(branch);
      const pinnedStateIndex = getPinnedStateDepth(branch);
      return {
        id: branch,
        active: currentBranch === branch,
        label,
        activeStateIndex: showActiveStateIndex ? activeStateIndex : null,
        startsAt,
        endsAt,
        maxDepth,
        branchType,
        currentBranchStart,
        currentBranchEnd,
        successorDepth,
        pinnedStateIndex,
        onRename: name => onRenameBranch({ branch, name }),
      };
    })
    .filter(branch => (
      !pinnedState ||
      branch.active ||
      isNumber(branch.successorDepth)
    ));
  }

  render() {
    const {
      history: {
        graph,
      },
    } = this.props;
    const historyGraph = new DagGraph(graph);
    const commitPath = getCurrentCommitPath(historyGraph);
    const { currentBranch } = historyGraph;
    const { onBranchSelect } = this.props;
    const onBranchContinuationClick = id => log('branch continuation clicked', id);
    const branchList = this.getBranchList(historyGraph, commitPath);
    return (
      <BranchList
        activeBranch={currentBranch}
        branches={branchList}
        onBranchClick={onBranchSelect}
      />
    );
  }
}
