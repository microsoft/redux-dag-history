import * as React from 'react';
import Branch, { IBranchProps } from '../Branch';
import './BranchList.scss';

const { PropTypes } = React;

export interface IBranchListProps {
  activeBranch?: number;
  branches: IBranchProps[];
  onBranchClick?: (branchId: number) => void;
}

const BranchList: React.StatelessComponent<IBranchListProps> = ({
  activeBranch,
  branches,
  onBranchClick,
}) => {
  const branchViews = branches.map(s => (
    <Branch
      {...s}
      key={`branch:${s.id}`}
      onClick={() => onBranchClick ? onBranchClick(s.id) : undefined}
      active={activeBranch === s.id}
    />
  ));
  return (
    <div className="history-branch-list">
      <div className="history-branch-list-inner">
        {branchViews}
      </div>
    </div>
  );
};

BranchList.propTypes = {
  activeBranch: React.PropTypes.number,
  branches: React.PropTypes.arrayOf(React.PropTypes.shape(Branch.propTypes)),
  onBranchClick: React.PropTypes.func,
};

export default BranchList;
