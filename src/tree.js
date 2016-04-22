import * as React from 'react';

export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}

export let Tree = React.createClass({
    render: function() {
        let treeNode = this.props.data;
        let children = treeNode.children.map(function (child) { 
            return (
                <li key={child.id}>
                    <i className="fa-li fa fa-check-square"></i>
                    <Tree data={child} />
                </li>);
        });
        return (
            <div className="treeNode" id={treeNode.id}>
                <div className="treeNodeName">{treeNode.name}</div>
                <ul className="fa-ul">{children}</ul>
            </div>
        );
    }
});
