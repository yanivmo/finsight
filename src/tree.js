export function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach((child) => { iterateTree(child, f); })
    }
}


export let Tree = React.createClass({
    render: function() {
        let treeNode = this.props.data;
        let children = treeNode.children.map(function (child) { 
            return (<li><Tree data={child} key={child.id} /></li>);
        });
        return (
            <div className="treeNode">
                <div className="treeNodeName">{treeNode.name}</div>
                <ul>{children}</ul>
            </div>
        );
    }
});


function addIds(treeData) {
    let serialNum = 1;
    iterateTree(treeData, (node) => {
        let newId = 'id_' + ('000' + serialNum).slice(-3);
        node.id = newId;
        serialNum++;
        return true;
    });
}

// addIds(inputData.accounts[0]);

// ReactDOM.render(
//     <Tree data={inputData.accounts[0]} />,
//     document.getElementById('content')
// );
