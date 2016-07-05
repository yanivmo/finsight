import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Tree } from './tree';

// Bundled files
import './tree.html';

const data = {
    name: '1', id: '1', children: [
        { name: '1.1', id: '1.1', children: [
            { name: '1.1.1', id: '1.1.1', children: [] },
            { name: '1.1.2', id: '1.1.2', children: [] },
            { name: '1.1.3', id: '1.1.3', children: [] },
        ] },
    ],
};

ReactDOM.render(
    <Tree data={data} />,
    document.getElementById('content')
);
