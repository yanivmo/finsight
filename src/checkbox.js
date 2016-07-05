import * as React from 'react';

/**
 * Component encapsulating HTML checkbox.
 * Allows three states: checked, unchecked and indeterminate.
 */
export class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            state: ('state' in props ? props.state : Checkbox.UNCHECKED),
        };

        // The HTML DOM checkbox element. Initialized via ref
        this.inputElement = null;

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.updateInputElement();
    }

    componentWillReceiveProps(nextProps) {
        if ('state' in nextProps) {
            if (!('state' in this.props) || (nextProps.state !== this.props.state)) {
                this.setState({ state: nextProps.state });
            }
        }
    }

    componentDidUpdate() {
        this.updateInputElement();
    }

    updateInputElement() {
        this.inputElement.checked = (this.state.state === Checkbox.CHECKED);
        this.inputElement.indeterminate = (this.state.state === Checkbox.INDETERMINATE);
    }

    handleChange() {
        let newState = Checkbox.CHECKED;
        if (this.state.state === Checkbox.CHECKED) {
            newState = Checkbox.UNCHECKED;
        }

        this.setState({ state: newState });

        if (this.props.onChange) {
            this.props.onChange(newState);
        }
    }

    render() {
        /* eslint-disable no-return-assign */
        const id = `input-${this.state.id}`;
        return (
            <div>
                <input
                    type="checkbox"
                    id={id}
                    onChange={this.handleChange}
                    ref={element => this.inputElement = element}
                />

                <label htmlFor={id}>{this.props.label}</label>
            </div>
        );
        /* eslint-enable no-return-assign */
    }
}
Checkbox.UNCHECKED = 'unchecked';
Checkbox.CHECKED = 'checked';
Checkbox.INDETERMINATE = 'indeterminate';

Checkbox.propTypes = {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    state: React.PropTypes.oneOf([Checkbox.CHECKED, Checkbox.UNCHECKED, Checkbox.INDETERMINATE]),
    onChange: React.PropTypes.func,
};
