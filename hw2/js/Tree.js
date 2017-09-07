/** Class representing a Tree. */
class Tree {

	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
		this.n = json.length;
		this.nodes = [];
		for (let i = 0; i < this.n; i++) {
			let node = new Node(json[i].name, json[i].parent);
			this.nodes.push(node);
		}
	}


	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		for (let i = 0; i < this.n; i++) {
			for (let j = i + 1; j < this.n; j++) {
				if (this.nodes[j].parentName == this.nodes[i].name) {
					this.nodes[j].parentNode = this.nodes[i];
					this.nodes[i].addChild(this.nodes[j]);
				}
			}
		}
	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
		this.assignLevel(this.nodes[0], 0);
		this.assignPosition(this.nodes[0], 0);
		console.log(this.nodes);
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		if (node == null) {
			return;
		}
		node.position = position;
		for (let i = 0; i < node.children.length; i++) {
			this.assignPosition(node.children[i], node.position + i);
		}
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		if (node == null) {
			return;
		}
		node.level = level;
		for (let c of node.children) {
			this.assignLevel(c, level + 1);
		}
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {

	}
		
}