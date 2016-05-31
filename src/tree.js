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
            state: ('state' in props ? props.state : Checkbox.UNCHECKED),
            childrenState: new Array(this.props.data.children.length)
        };
        this.state.childrenState.fill(this.state.state);
        
        this.handleOwnChange = this.handleOwnChange.bind(this);
    }
    
    render() {
        let treeNode = this.props.data;
        let children = treeNode.children.map((child, index) =>
            <li key={child.id}>
                <Tree data={child} 
                      state={this.state.childrenState[index]} 
                      onChange={this.handleChildChange.bind(this, index)}/>
            </li>
        );
        return (
            <div>
                <Checkbox id={treeNode.id} label={treeNode.name} state={this.state.state} onChange={this.handleOwnChange} />
                <ul>{children}</ul>
            </div>
        );
    }
    
    handleOwnChange(newState) {
        this.enforceState(newState);
        if ('onChange' in this.props) {
            this.props.onChange(newState);
        }
    }
    
    handleChildChange(index, newState) {
        
    }
    
    enforceState(newState) {
        this.setState({
            state: newState,
            childrenState: this.state.childrenState.fill(newState)
        });
    }
    
    componentWillReceiveProps(nextProps) {
        if ('state' in nextProps) {
            if (!('state' in this.props) || (nextProps.state != this.props.state)) {
                this.enforceState(nextProps.state);
            }
        }
    }
}