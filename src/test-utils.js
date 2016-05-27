'use strict';

import TestUtils from 'react-addons-test-utils';

// Simulates a change event on the input element inside the checkbox component
export function clickCheckbox(checkbox) {
    const input = TestUtils.findRenderedDOMComponentWithTag(checkbox, "input");
    TestUtils.Simulate.change(input);
}
