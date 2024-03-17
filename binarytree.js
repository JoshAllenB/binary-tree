class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sortedArray = Array.from(new Set(array)).sort((a, b) => a - b);
    return this.buildBalancedTree(sortedArray);
  }

  buildBalancedTree(sortedArray) {
    if (sortedArray.length === 0) return null;

    const mid = Math.floor(sortedArray.length / 2);
    const root = new Node(sortedArray[mid]);

    root.left = this.buildBalancedTree(sortedArray.slice(0, mid));
    root.right = this.buildBalancedTree(sortedArray.slice(mid + 1));

    return root;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(node, value) {
    if (node === null) {
      return new Node(value);
    }

    if (value < node.data) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.data) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  deleteItem(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.data) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteNode(node.right, value);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      } else if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      const minRight = this.findMinNode(node.right);
      node.data = minRight.data;
      node.right = this.deleteNode(node.right, minRight.data);
    }

    return node;
  }

  findMinNode(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value) {
    return this.findNode(this.root, value);
  }

  findNode(node, value) {
    if (node === null) {
      return null;
    }

    if (value === node.data) {
      return node;
    } else if (value < node.data) {
      return this.findNode(node.left, value);
    } else {
      return this.findNode(node.right, value);
    }
  }

  levelOrder(callback) {
    if (!callback) {
      const result = [];
      if (!this.root) return result;

      const queue = [this.root];
      while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.data);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      return result;
    } else {
      if (!this.root) return;
      const queue = [this.root];
      while (queue.length > 0) {
        const node = queue.shift();
        callback(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }
  }

  inOrder(callback) {
    this.inOrderTraversal(this.root, callback);
  }

  inOrderTraversal(node, callback) {
    if (node === null) return;
    this.inOrderTraversal(node.left, callback);
    callback(node);
    this.inOrderTraversal(node.right, callback);
  }

  preOrder(callback) {
    this.preOrderTraversal(this.root, callback);
  }

  preOrderTraversal(node, callback) {
    if (node === null) return;
    callback(node);
    this.preOrderTraversal(node.left, callback);
    this.preOrderTraversal(node.right, callback);
  }

  postOrder(callback) {
    this.postOrderTraversal(this.root, callback);
  }

  postOrderTraversal(node, callback) {
    if (node === null) return;
    this.postOrderTraversal(node.left, callback);
    this.postOrderTraversal(node.right, callback);
    callback(node);
  }

  height(node) {
    if (node === null) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    return this.calculateDepth(this.root, node, 0);
  }

  calculateDepth(currentNode, targetNode, depth) {
    if (currentNode === null) return -1;
    if (currentNode === targetNode) return depth;
    const leftDepth = this.calculateDepth(
      currentNode.left,
      targetNode,
      depth + 1
    );
    const rightDepth = this.calculateDepth(
      currentNode.right,
      targetNode,
      depth + 1
    );
    return Math.max(leftDepth, rightDepth);
  }

  isBalanced() {
    return this.checkBalance(this.root) !== -1;
  }

  checkBalance(node) {
    if (node === null) return 0;

    const leftHeight = this.checkBalance(node.left);
    const rightHeight = this.checkBalance(node.right);

    if (
      leftHeight === -1 ||
      rightHeight === -1 ||
      Math.abs(leftHeight - rightHeight) > 1
    ) {
      return -1;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  rebalance() {
    const sortedArray = [];
    this.inOrder((node) => sortedArray.push(node.data));
    this.root = this.buildBalancedTree(sortedArray);
  }
}

// Example usage:
// Function to generate an array of random numbers less than 100
function generateRandomNumbers(length) {
  const randomNumbers = [];
  for (let i = 0; i < length; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }
  return randomNumbers;
}

// Create a binary search tree from an array of random numbers
const randomNumbers = generateRandomNumbers(15); // Change the length as needed
const tree = new Tree(randomNumbers);

// Confirm that the tree is balanced
console.log("Is the tree balanced?", tree.isBalanced());

// Print out all elements in level, pre, post, and in order
console.log("\nLevel Order Traversal:");
console.log(tree.levelOrder());

console.log("\nPre Order Traversal:");
tree.preOrder((node) => console.log(node.data));

console.log("\nPost Order Traversal:");
tree.postOrder((node) => console.log(node.data));

console.log("\nIn Order Traversal:");
tree.inOrder((node) => console.log(node.data));

// Unbalance the tree by adding several numbers > 100
tree.insert(150);
tree.insert(120);
tree.insert(110);

// Confirm that the tree is unbalanced
console.log(
  "\nIs the tree balanced after adding numbers > 100?",
  tree.isBalanced()
);

// Balance the tree by calling rebalance
tree.rebalance();

// Confirm that the tree is balanced after rebalancing
console.log("\nIs the tree balanced after rebalancing?", tree.isBalanced());

// Print out all elements in level, pre, post, and in order after rebalancing
console.log("\nLevel Order Traversal after rebalancing:");
console.log(tree.levelOrder());

console.log("\nPre Order Traversal after rebalancing:");
tree.preOrder((node) => console.log(node.data));

console.log("\nPost Order Traversal after rebalancing:");
tree.postOrder((node) => console.log(node.data));

console.log("\nIn Order Traversal after rebalancing:");
tree.inOrder((node) => console.log(node.data));
