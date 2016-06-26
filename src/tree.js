'use strict';

import * as React from 'react';

import {Checkbox} from './checkbox'

// import './style.scss'

export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}


export function calculateNodeState(childrenStates) {
    let newState = Checkbox.UNCHECKED;
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
        
        newState = Checkbox.INDETERMINATE;
        if (checkedCount == 0 && indeterminateCount == 0) {
            newState = Checkbox.UNCHECKED;
        } else if (checkedCount == childrenStates.length) {
            newState = Checkbox.CHECKED;
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
            stateFromChildren: false,
            childrenState: new Array(this.props.data.children.length)
        };
        this.state.childrenState.fill(this.state.state);
        
        this.handleOwnChange = this.handleOwnChange.bind(this);
    }
    
    render() {
        const treeNode = this.props.data;
        
        const childProps = {};
        if (!this.state.stateFromChildren) {
            childProps.state = this.state.state;
        }
        
        const children = treeNode.children.map((child, index) => {
            childProps.data = child;
            childProps.onChange = this.handleChildChange.bind(this, index);
            return <li key={child.id}> <Tree {...childProps} /> </li>; 
        });

        let visualState = this.state.state;
        if (this.state.stateFromChildren) {
            visualState = calculateNodeState(this.state.childrenState);
            if (visualState == Checkbox.CHECKED && this.state.state != Checkbox.CHECKED) {
                visualState = Checkbox.INDETERMINATE;
            }
        }
        
        return (
            <div>
                <Checkbox id={treeNode.id} label={treeNode.name} state={visualState} onChange={this.handleOwnChange} />
                <ul>{children}</ul>
            </div>
        );
    }
    
    handleOwnChange(newState) {
        console.log(this.props.data.id, "self changed: ( new:", newState, " old:", this.state.state, ")");
        this.state.childrenState.fill(newState);
        this.setState({state: newState, stateFromChildren: false, childrenState: this.state.childrenState});
        if ('onChange' in this.props) {
            this.props.onChange(newState);
        }
    }
    
    handleChildChange(index, newChildState) {
        console.log(this.props.data.id, "child changed: (index:", index, " new:", newChildState, " old:", this.state.childrenState[index], ")");
        
        if (this.state.childrenState[index] != newChildState) {
            const prevVisualState = calculateNodeState(this.state.childrenState);
            this.state.childrenState[index] = newChildState;
            
            const newState = {
                childrenState: this.state.childrenState, 
                stateFromChildren: true
            };
             
            const newVisualState = calculateNodeState(this.state.childrenState);
            if (newVisualState == Checkbox.UNCHECKED) {
                newState.state = Checkbox.UNCHECKED;
            }
            
            this.setState(newState, this.notifyParent.bind(this, prevVisualState));
        }
    }
    
    notifyParent(oldVisualState) {
        if ('onChange' in this.props) {
            const newVisualState = calculateNodeState(this.state.childrenState);
            if (newVisualState != oldVisualState) {
                this.props.onChange(newVisualState);
            }
        }
    }
    
    shouldUpdateState(newState) {
        return (newState != this.props.state);
    }
        
    componentWillReceiveProps(nextProps) {
        console.log(this.props.data.id, "props (new:", nextProps.state, " old prop:", this.props.state, " old state:", this.state.state);
        if ('state' in nextProps) {
            if (!('state' in this.props) || (nextProps.state != this.props.state)) {
                this.state.childrenState.fill(nextProps.state);
                this.setState({state: nextProps.state, stateFromChildren: false, childrenState: this.state.childrenState});
            }
        }
    }
}