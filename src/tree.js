import * as React from 'react'

// import './style.scss'

export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}

export let Tree = React.createClass({
    render: function() {
        let treeNode = this.props.data;
        let children = treeNode.children.map((child) =>
            <li key={child.id}>
                <Tree data={child} />
            </li>
        );
        return (
            <div className="tree-node" id={"node-" + treeNode.id}>
                <input type="checkbox" id={"checkbox-" + treeNode.id}/>
                <label htmlFor={"checkbox-" + treeNode.id}>{treeNode.name}</label>
                <ul>{children}</ul>
            </div>
        );
    }
});
