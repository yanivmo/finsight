'use strict';

import * as React from 'react';

import {Checkbox} from './checkbox'

// import './style.scss'

export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}


export function calculateNodeState(ownState, childrenStates) {
    let newState = ownState;
    if (childrenStates.length > 0) {
        
        let checkedCount = 0;
        let indeterminateCount = 0;
        for (let childState of childrenStates) {
            if (childState == Checkbox.CHECKED) {
                checkedCount++;
            } else if (childState == Checkbox.INDETERMINATE) {
                indeterminateCount++;
            }
        }
        
        if (checkedCount == 0 && indeterminateCount == 0) {
            newState = Checkbox.UNCHECKED;
        } else if (checkedCount == childrenStates.length) {
            if (ownState == Checkbox.CHECKED) {
                newState = Checkbox.CHECKED;
            } else {
                newState = Checkbox.INDETERMINATE;
            }
        } else {
            newState = Checkbox.INDETERMINATE;
        }
    }
    return newState;
}


export class Tree extends React.Component {
    constructor(props) {
        super(props);
        
        console.log(this.props.data.id, "constr");
        
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
        console.log(this.props.data.id, "self changed: ( new:", newState, " old:", this.state.state, ")");
        
        this.enforceState(newState);
        if ('onChange' in this.props) {
            this.props.onChange(newState);
        }
    }
    
    handleChildChange(index, newChildState) {
        console.log(this.props.data.id, "child changed: (index:", index, " new:", newChildState, " old:", this.state.childrenState[index], ")");
        
        if (this.state.childrenState[index] != newChildState) {
            this.state.childrenState[index] = newChildState;
            const newOwnState = calculateNodeState(this.props.state, this.state.childrenState)
            
            if (newOwnState != this.state.state) {
                this.setState({state: newOwnState}, this.notifyParent.bind(this, newOwnState));                
            }
        }
    }
    
    notifyParent(newState) {
        if ('onChange' in this.props) {
            this.props.onChange(newState);
        }
    }
    
    enforceState(newState) {
        this.setState({
            state: newState,
            childrenState: this.state.childrenState.fill(newState)
        });
    }
    
    // Returns true if the new state should override the current state of the root node
    // and of all the children
    shouldEnforceState(newState) {
        return (newState != this.props.state) && (newState != this.state.state);
    }
        
    componentWillReceiveProps(nextProps) {
        console.log(this.props.data.id, "props", nextProps.state, this.props.state, this.state.state);
        if ('state' in nextProps) {
            if (!('state' in this.props) || this.shouldEnforceState(nextProps.state)) {
                this.enforceState(nextProps.state);
            }
        }
    }
}