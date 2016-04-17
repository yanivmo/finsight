jest.unmock('../src/tree');
import {iterateTree} from '../src/tree'

describe("Tree iteration tests", () => {
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
    }
    
    it('tests complete tree iteration', () => {
        const expectedOrder = ['1', '1.1', '1.2', '1.2.1', '1.2.1.1', '1.3'];
        
        iterateTree(treeData, (node) => {
            expect(node.name).toBe(expectedOrder.shift());
            return true;
        })
    })
    
    it('tests partial tree iteration', () => {
        const expectedOrder = ['1', '1.1', '1.2', '1.3'];
        
        iterateTree(treeData, (node) => {
            expect(node.name).toBe(expectedOrder.shift());
            return node.name != '1.2';
        })
    })
    
});