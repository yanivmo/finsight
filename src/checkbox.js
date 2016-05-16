import * as React from 'react';

export class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.id,
            checkState: (props.checkState ? props.checkState : Checkbox.UNCHECKED)
        };

        // The HTML DOM checkbox element. Initialized via ref        
        this.inputElement = null;
        
        this.handleChange = this.handleChange.bind(this);
        this.updateInputElement = this.updateInputElement.bind(this); 
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
        this.inputElement.checked = (this.state.checkState == Checkbox.CHECKED);
        this.inputElement.indeterminate = (this.state.checkState == Checkbox.INDETERMINATE);
    }
    
    handleChange(e) {
        if (this.state.checkState == Checkbox.CHECKED) {
            this.setState({checkState: Checkbox.UNCHECKED});
        } else {
            this.setState({checkState: Checkbox.CHECKED});
        }
        
        if (this.props.onChange) {
            this.props.onChange(this.state.checkState);
        }
    }
}
Checkbox.UNCHECKED = "unchecked";
Checkbox.CHECKED = "checked";
Checkbox.INDETERMINATE = "indeterminate";
