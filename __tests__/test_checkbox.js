'use strict';

jest.unmock('../src/checkbox');
import {Checkbox} from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe("Checkbox component tests", () => {
    it('tests indeterminate checkbox', () => {
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox id="1234" label="Test 1" checkState="indeterminate" />
        );
        
        const checkboxDom = ReactDOM.findDOMNode(checkbox);
        
        const inputDom = checkboxDom.children[0];
        expect(inputDom.tagName).toEqual('INPUT');
        
        const labelDom = checkboxDom.children[1];
        expect(labelDom.tagName).toEqual('LABEL');
    })
});