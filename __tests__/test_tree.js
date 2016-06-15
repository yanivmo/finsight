'use strict';

jest.unmock('../src/tree');
import {Tree, iterateTree, calculateNodeState} from '../src/tree';

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


describe("Tree node state calculation tests", function () {
    
    // Just trying to type less
    const CHECKED = Checkbox.CHECKED;
    const UNCHECKED = Checkbox.UNCHECKED;
    const INDETERMINATE = Checkbox.INDETERMINATE;
    
    it('tests node without children', () => {
       expect(calculateNodeState(CHECKED, [])).toBe(CHECKED);
       expect(calculateNodeState(UNCHECKED, [])).toBe(UNCHECKED); 
    });

    it('tests nodes with one child', () => {
       expect(calculateNodeState(CHECKED,   [CHECKED]      )).toBe(CHECKED);
       expect(calculateNodeState(UNCHECKED, [CHECKED]      )).toBe(INDETERMINATE);
       expect(calculateNodeState(CHECKED,   [UNCHECKED]    )).toBe(UNCHECKED);
       expect(calculateNodeState(UNCHECKED, [UNCHECKED]    )).toBe(UNCHECKED);
       expect(calculateNodeState(CHECKED,   [INDETERMINATE])).toBe(INDETERMINATE);
       expect(calculateNodeState(UNCHECKED, [INDETERMINATE])).toBe(INDETERMINATE);       
    });
    
    it('tests nodes with multiple children', () => {
       expect(calculateNodeState(CHECKED,   [CHECKED,       CHECKED,       CHECKED      ])).toBe(CHECKED);
       expect(calculateNodeState(UNCHECKED, [CHECKED,       CHECKED,       CHECKED      ])).toBe(INDETERMINATE);
       expect(calculateNodeState(CHECKED,   [UNCHECKED,     UNCHECKED,     UNCHECKED    ])).toBe(UNCHECKED);
       expect(calculateNodeState(UNCHECKED, [UNCHECKED,     UNCHECKED,     UNCHECKED    ])).toBe(UNCHECKED);
       expect(calculateNodeState(CHECKED,   [INDETERMINATE, INDETERMINATE, INDETERMINATE])).toBe(INDETERMINATE);
       expect(calculateNodeState(CHECKED,   [INDETERMINATE, CHECKED,       CHECKED      ])).toBe(INDETERMINATE);
       expect(calculateNodeState(CHECKED,   [INDETERMINATE, UNCHECKED,     UNCHECKED    ])).toBe(INDETERMINATE);
       expect(calculateNodeState(UNCHECKED, [INDETERMINATE, INDETERMINATE, INDETERMINATE])).toBe(INDETERMINATE);       
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

        const checkboxesMap = new Map(checkboxes.map(cb => [cb.props.id, cb]));
        return [tree, checkboxesMap];
    };
        
    beforeEach(() => {
        jasmine.addMatchers(CheckboxUtils.InputElementMatchers);
    });
    
    it('tests clicking the root node', () => {
        const [tree, checkboxes] = buildAndVerifyTree();
        const root = checkboxes.get('1');
        
        for (let cb of checkboxes.values()) {
            expect(cb.inputElement).toBeUnchecked();
        }
        
        CheckboxUtils.clickCheckbox(root);
        for (let cb of checkboxes.values()) {
            expect(cb.inputElement).toBeChecked();
        }

        CheckboxUtils.clickCheckbox(root);
        for (let cb of checkboxes.values()) {
            expect(cb.inputElement).toBeUnchecked();
        }
    });

    it('tests clicking the middle node', () => {
        const [tree, checkboxes] = buildAndVerifyTree();
        
        const input = id => expect(checkboxes.get(id).inputElement);
        const click = id => CheckboxUtils.clickCheckbox(checkboxes.get(id)); 
        
        input('1'    ).toBeUnchecked();
        input('1.1'  ).toBeUnchecked();
        input('1.1.1').toBeUnchecked();
        input('1.1.2').toBeUnchecked();
        input('1.1.3').toBeUnchecked();

        click('1.1');        
        input('1'    ).toBeIndeterminate();
        input('1.1'  ).toBeChecked();
        input('1.1.1').toBeChecked();
        input('1.1.2').toBeChecked();
        input('1.1.3').toBeChecked();

        click('1.1');        
        input('1'    ).toBeUnchecked();
        input('1.1'  ).toBeUnchecked();
        input('1.1.1').toBeUnchecked();
        input('1.1.2').toBeUnchecked();
        input('1.1.3').toBeUnchecked();
    });

    it('tests clicking the bottom node', () => {
        const [tree, checkboxes] = buildAndVerifyTree();
        
        const input = id => expect(checkboxes.get(id).inputElement);
        const click = id => CheckboxUtils.clickCheckbox(checkboxes.get(id)); 
        
        input('1'    ).toBeUnchecked();
        input('1.1'  ).toBeUnchecked();
        input('1.1.1').toBeUnchecked();
        input('1.1.2').toBeUnchecked();
        input('1.1.3').toBeUnchecked();

        click('1.1.2');        
        input('1'    ).toBeIndeterminate();
        input('1.1'  ).toBeIndeterminate();
        input('1.1.1').toBeUnchecked();
        input('1.1.2').toBeChecked();
        input('1.1.3').toBeUnchecked();

        click('1.1.2');        
        input('1'    ).toBeUnchecked();
        input('1.1'  ).toBeUnchecked();
        input('1.1.1').toBeUnchecked();
        input('1.1.2').toBeUnchecked();
        input('1.1.3').toBeUnchecked();
    });
});

