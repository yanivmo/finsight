import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {inputData} from './data';
import {Tree, iterateTree} from './tree';
import {Checkbox} from './checkbox';

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

// let data = {
//     id: "1", name: "A", children: [
//         {id: "1.1", name: "A.A", children: []},
//         {id: "1.2", name: "A.B", children: []},
//         {id: "1.3", name: "A.C", children: []},
//     ]
// }

const data = {
    name: '1', id: '1', children: [
        {name: '1.1', id: '1.1', children: [
            {name: '1.1.1', id: '1.1.1', children: []},
            {name: '1.1.2', id: '1.1.2', children: []},
            {name: '1.1.3', id: '1.1.3', children: []}
        ]}
    ]
};


ReactDOM.render(
    <Tree data={data} />,
    document.getElementById('content')
);

// ReactDOM.render(
//     <Checkbox id="1234" label="Booga" state="indeterminate" />,
//     document.getElementById('content')
// );
