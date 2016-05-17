'use strict';

jest.unmock('../src/checkbox');
import {Checkbox} from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe("Checkbox component tests", function() {
    const buildAndTestDom = (state) => {
        const checkbox = TestUtils.renderIntoDocument(
            <Checkbox id="1234" label="Test 1" checkState={state} />
        );
        
        const checkboxDom = ReactDOM.findDOMNode(checkbox);
        
        this.inputDom = checkboxDom.children[0];
        expect(this.inputDom.tagName).toEqual('INPUT');
        
        this.labelDom = checkboxDom.children[1];
        expect(this.labelDom.tagName).toEqual('LABEL');
        
        expect(this.inputDom.id).toEqual(this.labelDom.htmlFor);
    };
    
    it('tests checked checkbox', () => {
        buildAndTestDom(Checkbox.CHECKED);
        
        expect(this.inputDom.indeterminate).toBeFalsy();
        expect(this.inputDom.checked).toBeTruthy();        
    });

    it('tests unchecked checkbox', () => {
        buildAndTestDom(Checkbox.UNCHECKED);
        
        expect(this.inputDom.indeterminate).toBeFalsy();
        expect(this.inputDom.checked).toBeFalsy();        
    });

    it('tests indeterminate checkbox', () => {
        buildAndTestDom(Checkbox.INDETERMINATE);
        
        expect(this.inputDom.indeterminate).toBeTruthy();
        expect(this.inputDom.checked).toBeFalsy();
        
        TestUtils.Simulate.change(this.inputDom);        
        expect(this.inputDom.indeterminate).toBeFalsy();
        expect(this.inputDom.checked).toBeTruthy();

        TestUtils.Simulate.change(this.inputDom);        
        expect(this.inputDom.indeterminate).toBeFalsy();
        expect(this.inputDom.checked).toBeFalsy();
    });
});