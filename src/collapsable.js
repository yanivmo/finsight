import * as React from 'react';

/**
 * Collapse an element by setting its height to 0 and using css transition to animate it.
 */
export class Collapsable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        // The HTML DOM element that contains all the children. This element
        // will be the one collapsed to hide all its children
        this.container = null;
    }

    componentDidMount() {
        this.updateChildVisibility();
    }

    componentDidUpdate() {
        this.updateChildVisibility();
    }

    updateChildVisibility() {

    }

    render() {
        /* eslint-disable no-return-assign */
        return (
            <div className="clclclc" ref={element => this.container = element}>
                {this.props.children}
            </div>
        );
        /* eslint-enable no-return-assign */
    }
}
Collapsable.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node,
    ]),
};
