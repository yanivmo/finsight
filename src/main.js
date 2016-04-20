import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {inputData} from './data'
import {Compo, Tree, iterateTree} from './tree'

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

ReactDOM.render(
    <Tree data={inputData.accounts[0]} />,
    document.getElementById('content')
);

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('content3')
// );