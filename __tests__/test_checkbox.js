jest.unmock('../src/checkbox');
import { Checkbox } from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';

import * as CheckboxUtils from '../src/test-utils';


describe('Checkbox component tests', function () {
    beforeEach(() => {
        jasmine.addMatchers(CheckboxUtils.InputElementMatchers);
        this.container = document.createElement('div');
    });

    const render = (state) => {
        const changeSpy = jest.genMockFunction();

        const checkboxComponent = ReactDOM.render(
            <Checkbox id="1234" label="Test 1" state={state} onChange={changeSpy} />,
            this.container
        );
        const checkboxDom = ReactDOM.findDOMNode(checkboxComponent);

        const inputDom = checkboxDom.children[0];
        expect(inputDom.tagName).toEqual('INPUT');

        const labelDom = checkboxDom.children[1];
        expect(labelDom.tagName).toEqual('LABEL');

        expect(inputDom.id).toEqual(labelDom.htmlFor);

        return {
            checkbox: checkboxComponent,
            changeSpy: checkboxComponent.props.onChange,
        };
    };

    it('tests checked checkbox', () => {
        const checkbox = render(Checkbox.CHECKED).checkbox;
        expect(checkbox.inputElement).toBeChecked();
    });

    it('tests unchecked checkbox', () => {
        const checkbox = render(Checkbox.UNCHECKED).checkbox;
        expect(checkbox.inputElement).toBeUnchecked();
    });

    it('tests indeterminate checkbox', () => {
        const { checkbox, changeSpy } = render(Checkbox.INDETERMINATE);
        expect(checkbox.inputElement).toBeIndeterminate();

        // First click checks the checkbox
        CheckboxUtils.clickCheckbox(checkbox);
        expect(checkbox.inputElement).toBeChecked();

        // Second click unchecks
        CheckboxUtils.clickCheckbox(checkbox);
        expect(checkbox.inputElement).toBeUnchecked();

        // Third click checks again
        CheckboxUtils.clickCheckbox(checkbox);
        expect(checkbox.inputElement).toBeChecked();

        // The handler should be called for each click
        expect(changeSpy.mock.calls.length).toBe(3);
        expect(changeSpy.mock.calls[0][0]).toBe(Checkbox.CHECKED);
        expect(changeSpy.mock.calls[1][0]).toBe(Checkbox.UNCHECKED);
        expect(changeSpy.mock.calls[2][0]).toBe(Checkbox.CHECKED);
    });

    it('tests checkbox handling of props changes', () => {
        const checkbox = render(Checkbox.UNCHECKED).checkbox;
        expect(checkbox.inputElement).toBeUnchecked();

        render(Checkbox.CHECKED);
        expect(checkbox.inputElement).toBeChecked();
    });
});
