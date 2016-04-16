function addIds(treeData) {
    var serialNum = 1;
    iterateTree(treeData, function(node) {
        var newId = 'id_' + ('000' + serialNum).slice(-3);
        node.id = newId;
        serialNum++;
        return true;
    });
}

function iterateTree(treeNode, f) {
    if (f(treeNode)) {
        treeNode.children.forEach(function (child) { iterateTree(child, f); })
    }
}

var Tree = React.createClass({
    render: function() {
        var treeNode = this.props.data;
        var children = treeNode.children.map(function (child) { 
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

addIds(inputData.accounts[0]);

ReactDOM.render(
    <Tree data={inputData.accounts[0]} />,
    document.getElementById('content')
);
