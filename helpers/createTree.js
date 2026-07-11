const createTree = (arr, parentId = "") => {
    const tree = [];
    
    arr.forEach((item) => {
        if (String(item.parent_id) === String(parentId)) {
            const newItem = item;

            const children = createTree(arr, item.id);

            if (children.length > 0) {
                newItem.children = children;
            }

            tree.push(newItem);
        }
    });

    return tree;
}

module.exports = createTree;