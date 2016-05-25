'use strict';

jest.unmock('../src/tree');
jest.unmock('../src/checkbox');

import {Tree, iterateTree} from '../src/tree';
import {Checkbox} from '../src/checkbox';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


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
    const buildAndTestDom = () => {
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
        this.checkboxes = TestUtils.scryRenderedComponentsWithType(tree, Checkbox);
        expect(this.checkboxes.length).toBe(expectedIds.size);
        
        const allIdsFound = this.checkboxes.every(elem => expectedIds.has(elem.props.id));
        expect(allIdsFound).toBeTruthy();        
    };
    
    beforeEach(() => {
        const verify = (checkbox, inputVerificationCallback) => {
            const input = TestUtils.findRenderedDOMComponentWithTag(checkbox, "input");
            let callbackText = inputVerificationCallback.toString();
            callbackText = callbackText.slice(callbackText.indexOf("return") + 7, callbackText.lastIndexOf(";"));
            return {
                pass: inputVerificationCallback(input),
                message: `Expected (${callbackText}) got (checked == ${input.checked} && indeterminate == ${input.indeterminate})`
            };
        }
        
        jasmine.addMatchers({
            toBeChecked() {
                return { compare(checkbox) {
                    return verify(checkbox, input => (input.checked == true) && (input.indeterminate == false));
                }};
            },

            toBeUnchecked() {
                return { compare(checkbox) {
                    return verify(checkbox, input => (input.checked == false) && (input.indeterminate == false));
                }};
            }
        });
    });
    
    it('tests something', () => {
        buildAndTestDom();
        
        expect(this.checkboxes[0]).toBeUnchecked();
        
        for (let cb of this.checkboxes) {
            expect(cb).toBeUnchecked();
        }
    });
});

