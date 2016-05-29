'use strict';

import TestUtils from 'react-addons-test-utils';

// Simulates a change event on the input element inside the checkbox component
export function clickCheckbox(checkbox) {
    const input = TestUtils.findRenderedDOMComponentWithTag(checkbox, "input");
    TestUtils.Simulate.change(input);
}

// Test the inner state of an input HTML element
function testInputState(input, {checked, indeterminate}) {
    const result = {};
    
    result.pass = (input.checked == checked) && (input.indeterminate == indeterminate);
        
    result.message = `Input element ${input.id}\n` +
                     `expected (checked == ${checked} && indeterminate == ${indeterminate})\n` +
                     `actual   (checked == ${input.checked} && indeterminate == ${input.indeterminate})`;
    return result;
}

export const InputElementMatchers = {
    toBeChecked() {
        return { compare(input) {
            return testInputState(input, {checked: true, indeterminate: false});
        }};
    },

    toBeUnchecked() {
        return { compare(input) {
            return testInputState(input, {checked: false, indeterminate: false});
        }};
    }
};
