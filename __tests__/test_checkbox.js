'use strict';

jest.unmock('../src/checkbox');
import {Checkbox} from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe("Checkbox component tests", function() {
    beforeEach(() => {
        this.container = document.createElement('div'); 
    });
    
    const render = (state) => {
        const changeSpy = jest.genMockFunction();
        
        const checkbox = ReactDOM.render(
            <Checkbox id="1234" label="Test 1" state={state} onChange={changeSpy} />,
            this.container
        );
        return {objects: getObjects.bind(this, checkbox)};
    };
       
    const getObjects = (checkbox) => {
        const checkboxDom = ReactDOM.findDOMNode(checkbox);
        
        const inputDom = checkboxDom.children[0];
        expect(inputDom.tagName).toEqual('INPUT');
        
        const labelDom = checkboxDom.children[1];
        expect(labelDom.tagName).toEqual('LABEL');
        
        expect(inputDom.id).toEqual(labelDom.htmlFor);
        
        return [checkbox, inputDom, checkbox.props.onChange];
    };
    
    it('tests checked checkbox', () => {
        const [checkbox, inputDom, changeSpy] = render(Checkbox.CHECKED).objects();
        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeTruthy();        
    });

    it('tests unchecked checkbox', () => {
        const [checkbox, inputDom, changeSpy] = render(Checkbox.UNCHECKED).objects();
        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeFalsy();        
    });

    it('tests indeterminate checkbox', () => {
        const [checkbox, inputDom, changeSpy] = render(Checkbox.INDETERMINATE).objects();
        
        expect(inputDom.indeterminate).toBeTruthy();
        expect(inputDom.checked).toBeFalsy();

        // First click checks the checkbox        
        TestUtils.Simulate.change(inputDom);        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeTruthy();

        // Second click unchecks
        TestUtils.Simulate.change(inputDom);        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeFalsy();
        
        // Third click checks again
        TestUtils.Simulate.change(inputDom);        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeTruthy();
        
        // The handler should be called for each click
        expect(changeSpy.mock.calls.length).toBe(3);
        expect(changeSpy.mock.calls[0][0]).toBe(Checkbox.CHECKED);
        expect(changeSpy.mock.calls[1][0]).toBe(Checkbox.UNCHECKED);
        expect(changeSpy.mock.calls[2][0]).toBe(Checkbox.CHECKED);
    });
    
    it('tests checkbox handling of props changes', () => {
        const [checkbox, inputDom, changeSpy] = render(Checkbox.UNCHECKED).objects();
        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeFalsy();
        
        render(Checkbox.CHECKED);        
        expect(inputDom.indeterminate).toBeFalsy();
        expect(inputDom.checked).toBeTruthy();
    });

});