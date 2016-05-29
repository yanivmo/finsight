'use strict';

jest.unmock('../src/tree');
import {Tree, iterateTree} from '../src/tree';

jest.unmock('../src/checkbox');
import {Checkbox} from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import * as CheckboxUtils from '../src/test-utils';


describe("Tree iteration tests", function() {
    const treeData = {
        name: '1', children: [
            {name: '1.1', children: []},
            {name: '1.2', children: [
                {name: '1.2.1', children: [
                    {name: '1.2.1.1', children: []}
                ]}
            ]},
            {name: '1.3', children: []}
        ]
    };
    
    it('tests complete tree iteration', () => {
        const expectedOrder = ['1', '1.1', '1.2', '1.2.1', '1.2.1.1', '1.3'];
        
        iterateTree(treeData, (node) => {
            expect(node.name).toBe(expectedOrder.shift());
            return true;
        });
    });
    
    it('tests partial tree iteration', () => {
        const expectedOrder = ['1', '1.1', '1.2', '1.3'];
        
        iterateTree(treeData, (node) => {
            expect(node.name).toBe(expectedOrder.shift());
            return node.name != '1.2';
        });
    });
    
});


describe("Tree component tests", function() {
    const buildAndVerifyTree = () => {
        const data = {
            name: '1', id: '1', children: [
                {name: '1.1', id: '1.1', children: [
                    {name: '1.1.1', id: '1.1.1', children: []},
                    {name: '1.1.2', id: '1.1.2', children: []},
                    {name: '1.1.3', id: '1.1.3', children: []}
                ]}
            ]
        };
        const expectedIds = new Set(['1', '1.1', '1.1.1', '1.1.2', '1.1.3']);
            
        const tree = TestUtils.renderIntoDocument(
            <Tree data={data} />
        );
        const checkboxes = TestUtils.scryRenderedComponentsWithType(tree, Checkbox);
        expect(checkboxes.length).toBe(expectedIds.size);
        
        const allIdsFound = checkboxes.every(elem => expectedIds.has(elem.props.id));
        expect(allIdsFound).toBeTruthy();   
        
        return [tree, checkboxes];
    };
        
    beforeEach(() => {
        const testInputState = (input, {checked, indeterminate}) => {
            const result = {};
            
            result.pass = (input.checked == checked) && (input.indeterminate == indeterminate);
             
            result.message = `Input element ${input.id}\n` +
                             `expected (checked == ${checked} && indeterminate == ${indeterminate})\n` +
                             `actual   (checked == ${input.checked} && indeterminate == ${input.indeterminate})`;
            return result;
        }
        
        // Matchers that check the state of a checkbox component
        jasmine.addMatchers({
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
        });
    });
    
    it('tests something', () => {
        const [tree, checkboxes] = buildAndVerifyTree();
        
        for (let cb of checkboxes) {
            expect(cb.inputElement).toBeUnchecked();
        }
        
        CheckboxUtils.clickCheckbox(checkboxes[0]);
        for (let cb of checkboxes) {
            expect(cb.inputElement).toBeChecked();
        }

        CheckboxUtils.clickCheckbox(checkboxes[0]);
        for (let cb of checkboxes) {
            expect(cb.inputElement).toBeUnchecked();
        }
    });
});

