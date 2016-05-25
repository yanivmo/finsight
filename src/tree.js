'use strict';

import * as React from 'react';

import {Checkbox} from './checkbox'

// import './style.scss'

export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}

export let OldTree = React.createClass({
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

export class Tree extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            state: (props.state ? props.state : Checkbox.UNCHECKED)
        };
    }
    
    render() {
        let treeNode = this.props.data;
        let children = treeNode.children.map((child) =>
            <li key={child.id}>
                <Tree data={child} state={this.state.state} />
            </li>
        );
        return (
            <div>
                <Checkbox id={treeNode.id} label={treeNode.name} state={this.state.state} />
                <ul>{children}</ul>
            </div>
        );
    }
    
    componentWillReceiveProps(nextProps) {
        
    }
}