import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {inputData} from './data'
import {Tree, iterateTree} from './tree'
import {Checkbox} from './checkbox'

// Bundled files
import './tree.html';

function addIds(treeData) {
    let serialNum = 1;
    iterateTree(treeData, (node) => {
        let newId = 'id_' + ('000' + serialNum).slice(-3);
        node.id = newId;
        serialNum++;
        return true;
    });
}

addIds(inputData.accounts[0]);

// ReactDOM.render(
//     <Tree data={inputData.accounts[0]} />,
//     document.getElementById('content')
// );

ReactDOM.render(
    <Checkbox id="1234" label="Booga" checkState="indeterminate" />,
    document.getElementById('content')
);
