import * as React from 'react';

import { Checkbox } from './checkbox';


export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); });
    }
}


export function calculateNodeState(childrenStates) {
    let newState = Checkbox.UNCHECKED;
    if (childrenStates.length > 0) {
        let checkedCount = 0;
        let indeterminateCount = 0;
        for (const childState of childrenStates) {
            if (childState === Checkbox.CHECKED) {
                checkedCount++;
            } else if (childState === Checkbox.INDETERMINATE) {
                indeterminateCount++;
            }
        }

        newState = Checkbox.INDETERMINATE;
        if (checkedCount === 0 && indeterminateCount === 0) {
            newState = Checkbox.UNCHECKED;
        } else if (checkedCount === childrenStates.length) {
            newState = Checkbox.CHECKED;
        }
    }
    return newState;
}


export class Tree extends React.Component {
    constructor(props) {
        super(props);

        const childrenCount = this.props.data.children.length;

        this.state = {
            state: ('state' in props ? props.state : Checkbox.UNCHECKED),
            stateFromChildren: false,
            childrenState: new Array(childrenCount),
        };
        this.state.childrenState.fill(this.state.state);

        // Pregenerate event handlers for children state change events
        this.childrenChangeHandlers = new Array(this.props.data.children.length);
        for (let i = 0; i < childrenCount; i++) {
            this.childrenChangeHandlers[i] = this.handleChildChange.bind(this, i);
        }

        this.handleOwnChange = this.handleOwnChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('state' in nextProps) {
            if (!('state' in this.props) || (nextProps.state !== this.props.state)) {
                this.state.childrenState.fill(nextProps.state);
                this.setState({
                    state: nextProps.state,
                    stateFromChildren: false,
                    childrenState: this.state.childrenState,
                });
            }
        }
    }

    handleOwnChange(newState) {
        this.state.childrenState.fill(newState);
        this.setState({
            state: newState,
            stateFromChildren: false,
            childrenState: this.state.childrenState,
        });
        if ('onChange' in this.props) {
            this.props.onChange(newState);
        }
    }

    handleChildChange(index, newChildState) {
        if (this.state.childrenState[index] !== newChildState) {
            const prevVisualState = calculateNodeState(this.state.childrenState);
            this.state.childrenState[index] = newChildState;

            const newState = {
                childrenState: this.state.childrenState,
                stateFromChildren: true,
            };

            const newVisualState = calculateNodeState(this.state.childrenState);
            if (newVisualState === Checkbox.UNCHECKED) {
                newState.state = Checkbox.UNCHECKED;
            }

            this.setState(newState, this.notifyParent.bind(this, prevVisualState));
        }
    }

    notifyParent(oldVisualState) {
        if ('onChange' in this.props) {
            const newVisualState = calculateNodeState(this.state.childrenState);
            if (newVisualState !== oldVisualState) {
                this.props.onChange(newVisualState);
            }
        }
    }

    render() {
        const treeNode = this.props.data;

        const childProps = {};
        if (!this.state.stateFromChildren) {
            childProps.state = this.state.state;
        }

        const children = treeNode.children.map((child, index) => {
            childProps.data = child;
            childProps.onChange = this.childrenChangeHandlers[index];
            return <li key={child.id}> <Tree {...childProps} /> </li>;
        });

        let visualState = this.state.state;
        if (this.state.stateFromChildren) {
            visualState = calculateNodeState(this.state.childrenState);
            if (visualState === Checkbox.CHECKED && this.state.state !== Checkbox.CHECKED) {
                visualState = Checkbox.INDETERMINATE;
            }
        }

        return (
            <div>
                <Checkbox
                    id={treeNode.id}
                    label={treeNode.name}
                    state={visualState}
                    onChange={this.handleOwnChange}
                />
                <ul>{children}</ul>
            </div>
        );
    }
}
Tree.propTypes = {
    state: React.PropTypes.oneOf([Checkbox.CHECKED, Checkbox.UNCHECKED]),
    onChange: React.PropTypes.func,
    data: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        children: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    }).isRequired,
};
