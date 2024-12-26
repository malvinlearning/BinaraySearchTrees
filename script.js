class Node {
    constructor(data, left = null, right = null) {
      this.data = data;
      this.left = left;
      this.right = right;
    }
  }

class Tree {
    constructor(array) {
        this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b)); // Sort and remove duplicates
    }

    buildTree(array) {
        if (array.length === 0) return null;
        
        const mid = Math.floor(array.length / 2);
        const root = new Node(array[mid]);

        root.left = this.buildTree(array.slice(0,mid));
        root.right = this.buildTree(array.slice(mid+1));
        return root;
    }

    insert(key) {
        if (this.root === null) {
            return new Node(key);
        }
    
        const insertNode = (node) => {
            if (node === null) {
                return new Node(key);
            }
    
            if (key < node.data) {
                node.left = insertNode(node.left);
            } else if (key > node.data) {
                node.right = insertNode(node.right);
            }
    
            return node;
        };
    
        this.root = insertNode(this.root);
        return this.root;
    }

    delete(key) {
        const deleteNode = (node) => {
            if (node === null) {
                return null;
            }

            if (key < node.data) {
                node.left = deleteNode(node.left);
            } else if (key > node.data) {
                node.right = deleteNode(node.right);
            } else {
                // Node with only one child or no child
                if (node.left === null) {
                    return node.right;
                } else if (node.right === null) {
                    return node.left;
                }

                // Node with two children: Get the in-order successor
                let temp = this.getMinValueNode(node.right);
                node.data = temp.data;
                node.right = deleteNode(node.right);
            }
            return node;
        };

        this.root = deleteNode(this.root);
        return this.root;
    }

    find(key) {
        const findNode = (node) => {
            if (node.data === key) {
                return node;
            } else if (node.data < key){
                return findNode(node.right);
            } else {
                return findNode(node.left);
            }
        }
        return findNode(this.root);
    }

    getMinValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    levelOrder(callback) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }

        const queue = []; // Queue for level-order traversal

        if (this.root !== null) {
            queue.push(this.root);
        }

        while (queue.length > 0) {
            const currentNode = queue.shift();
            callback(currentNode);
            if (currentNode.left !== null) {
                queue.push(currentNode.left);
            } if (currentNode.right !== null) {
                queue.push(currentNode.right);
            } 
        }
    }

    inOrder(node) {
        if (node === null) {
            return;
        }
        
        // First recur on left subtree
        this.inOrder(node.left);
        
        // Now deal with the node
        console.log(node.data);
        
        // Then recur on right subtree
        this.inOrder(node.right);
    }

    preOrder(node) {
        if (node === null) {
            return;
        }

        // Now deal with the node
        console.log(node.data);
        
        // First recur on left subtree
        this.preOrder(node.left);
               
        // Then recur on right subtree
        this.preOrder(node.right);
    }

    postOrder(node) {
        if (node === null) {
            return;
        }

        
        
        // First recur on left subtree
        this.postOrder(node.left);
               
        // Then recur on right subtree
        this.postOrder(node.right);

        // Now deal with the node
        console.log(node.data);
    }

    height(node) {
        if (node === null) {
            // Base case: height of an empty tree (null node) is -1
            return -1;
        }
    
        // Recursively calculate the height of the left and right subtrees
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
    
        // The height of the current node is 1 + the greater of the two subtree heights
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    depth(node) {
        const findDepth = (currentNode, targetNode, currentDepth) => {
            if (currentNode === null) {
                return -1; // Node not found
            }
            if (currentNode === targetNode) {
                return currentDepth;
            }
    
            const leftDepth = findDepth(currentNode.left, targetNode, currentDepth + 1);
            if (leftDepth !== -1) {
                return leftDepth;
            }
    
            return findDepth(currentNode.right, targetNode, currentDepth + 1);
        };

        return findDepth(this.root, node, 0);
    }

    isBalanced() {
        const checkBalanced = (node) => {
            if (node === null) {
                return [true, -1]; // A null node is balanced with height -1
            }
    
            const [leftBalanced, leftHeight] = checkBalanced(node.left);
            const [rightBalanced, rightHeight] = checkBalanced(node.right);
    
            const isCurrentBalanced = Math.abs(leftHeight - rightHeight) <= 1;
            const currentHeight = 1 + Math.max(leftHeight, rightHeight);
    
            return [leftBalanced && rightBalanced && isCurrentBalanced, currentHeight];
        };
    
        const [balanced, _] = checkBalanced(this.root);
        return balanced;
    }
    
    rebalance() {
        // Step 1: Perform an in-order traversal to get a sorted list of elements
        const sortedElements = [];
        const traverseInOrder = (node) => {
            if (node === null) {
                return;
            }
            traverseInOrder(node.left);
            sortedElements.push(node.data);
            traverseInOrder(node.right);
        };
        traverseInOrder(this.root);
    
        // Step 2: Rebuild the tree using the sorted list
        this.root = this.buildTree(sortedElements);
    }
    
    
    
}

// prettyPrint function
const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree = new Tree(array);
//tree.insert(45);
//tree.delete(3);
console.log(tree.find(23));

//tree.levelOrder((node) => console.log(node.data));
//tree.inOrder(tree.root);
//tree.preOrder(tree.root);
//tree.postOrder(tree.root);
console.log(tree.height(tree.root));
console.log(tree.depth(tree.root.right));
console.log(tree.isBalanced());
tree.rebalance();
prettyPrint(tree.root);