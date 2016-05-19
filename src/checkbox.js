'use strict';

import * as React from 'react';

export class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.id,
            state: (props.state ? props.state : Checkbox.UNCHECKED)
        };

        // The HTML DOM checkbox element. Initialized via ref        
        this.inputElement = null;
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    render() {
        return (
            <div>
                <input 
                    type="checkbox" 
                    id={"tsc-input-" + this.state.id} 
                    onChange={this.handleChange} 
                    ref={element => this.inputElement = element} />
                    
                <label htmlFor={"tsc-input-" + this.state.id}>{this.props.label}</label>
            </div>
        );        
    }
    
    componentDidMount() {
        this.updateInputElement();
    }
    
    componentDidUpdate() {
        this.updateInputElement();
    }
    
    updateInputElement() {
        this.inputElement.checked = (this.state.state == Checkbox.CHECKED);
        this.inputElement.indeterminate = (this.state.state == Checkbox.INDETERMINATE);
    }
    
    handleChange(e) {
        let newState = Checkbox.CHECKED;
        if (this.state.state == Checkbox.CHECKED) {
            newState = Checkbox.UNCHECKED;
        }
        
        this.setState({state: newState});
        
        if (this.props.onChange) {
            this.props.onChange(newState);
        }
    }
}
Checkbox.UNCHECKED = "unchecked";
Checkbox.CHECKED = "checked";
Checkbox.INDETERMINATE = "indeterminate";
