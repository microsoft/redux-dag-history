import * as React from 'react';
const MdExpandMore = require('react-icons/lib/md/expand-more');
const MdExpandLess = require('react-icons/lib/md/expand-less');
const { PropTypes } = React;

export interface IExpandCollapseToggleProps {
  isExpanded?: boolean;
  onClick: Function;
}

const ExpandCollapseToggle: React.StatelessComponent<IExpandCollapseToggleProps> = ({ isExpanded, onClick }) => (
  isExpanded ?
    <MdExpandLess onClick={onClick} /> :
    <MdExpandMore onClick={onClick} />
);
ExpandCollapseToggle.propTypes = {
  isExpanded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
export default ExpandCollapseToggle;
