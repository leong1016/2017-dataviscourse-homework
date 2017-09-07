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
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	// assignPosition(node, position) {
	// 	if (node == null) {
	// 		return;
	// 	}
	// 	node.position = position;
	// 	for (let i = 0; i < node.children.length; i++) {
	// 		let a = node.position;
	// 		let b = this.basic[(node.level) + 1];
	// 		let c = a > b ? a : b;
	// 		this.assignPosition(node.children[i], c);
	// 	}
	// 	this.basic[node.level+1] += node.children.length;
	// }

	assignPosition(node, position) {
		if (node == null) {
			return;
		}
		node.position = position;
		let max = -1;
		for (let j = 0; j < this.nodes.length; j++) {
			if (this.nodes[j].level == node.level + 1 && this.nodes[j].position > max) {
				max = this.nodes[j].position;
			}
		}
		max += 1;
		if (position > max) {
			max = position;
		}
		for (let i = 0; i < node.children.length; i++) {
			this.assignPosition(node.children[i], max + i);
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
		//append svg element
		let svg = d3.select("body").append("svg")
			.attr("width", 1200)
			.attr("height", 1200);

		//get relations
		let relation = [];
		for (let n of this.nodes) {
			for (let m of n.children) {
				relation.push([n, m]);
			}
		}

		//append lines
		let line = svg.selectAll("line")
			.data(relation);
		let newline = line.enter().append("line")
			.attr("x1", function(d) {
				return d[0].level * 150 + 50;
			})
			.attr("y1", function(d) {
				return d[0].position * 150 + 50;
			})
			.attr("x2", function(d) {
				return d[1].level * 150 + 50;
			})
			.attr("y2", function(d) {
				return d[1].position * 150 + 50;
			})

		//append circles
		let circle = svg.selectAll("circle")
			.data(this.nodes)
		let newCircle = circle.enter().append("circle")
			.attr("cx", function(d) {
				return d.level * 150 + 50;
			})
			.attr("cy", function(d) {
				return d.position * 150 + 50;
			})
			.attr("r", 50);

		//append texts
		let text = svg.selectAll("text")
			.data(this.nodes)
		let newText = text.enter().append("text")
			.text(function(d) {
				return d.name;
			})
			.attr("x", function(d) {
				return d.level * 150 + 50;
			})
			.attr("y", function(d) {
				return d.position * 150 + 50;
			})
			.attr("class", "label");
	}
}