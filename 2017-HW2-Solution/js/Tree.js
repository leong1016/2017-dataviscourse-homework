/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * parentNode, children, parentName,level,position
     * @param {json[]} json - array of json object with name and parent fields
     */
    constructor(json) {
        //Create an array of newly instantiated node objects
        this.nodes = json.map(n => {
            return new Node(n.name, n.parent);
        });

        //Iterate through array and populate with parentNodes;
        this.nodes.map(node => {
            node.parentNode = this.nodes.find(n => {
                return n.name === node.parentName;
            });
        });
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        this.nodes.map(node => {
            //Create a Root Element
            if (!node.parentNode) {
                return;
            }
            //Find parent element
            let parent = this.nodes.find(n => {
                return n.name === node.parentName;
            });

            //Add node to array of children in parent node
            parent.addChild(node);
        });


        //Assign levels to each node

        //Start at root.
        let root = this.nodes.find(n => {
            return !n.parentNode;
        });
        this.assignLevel(root, 0);

        this.assignPosition(root, 0);

        console.log(this.nodes[2])

        // console.log(this.nodes)
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        //Assign position
        node.position = position;

        //Recursively call assignPosition on this node's children;
        node.children.map((child) => {
            let availablePosition =
                Math.max.apply(
                    Math,
                    this.nodes
                        .filter(n => {
                            return n.level === child.level;
                        })
                        .map(function (o) {
                            return o.position;
                        })
                ) + 1;
            let parentPosition = child.parentNode.position;

            parentPosition > availablePosition
                ? this.assignPosition(child, parentPosition)
                : this.assignPosition(child, availablePosition);
        });
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        //Assign level
        node.level = level;

        //Recursively call assignLevel on this node's children;
        node.children.map(n => {
            this.assignLevel(n, level + 1);
        });
    }

    /**
     * Function that renders the tree
     */
    renderTree() {

        //Create svg if it doesn't already exist
        let svg = d3.select('#container');

        if (svg.size() === 0) {
            svg = d3.select('body')
                .append('svg')
                .attr('id', 'container');
        }

        //Style svg
        svg
            .attr('width', 1200)
            .attr('height', 1200);

        //Render Edges

        //Existing(Update) Selection
        let allEdges = svg.selectAll('line')
            .data(
                this.nodes.filter(n => {
                    return n.parentNode;
                })
            );

        //New (Enter) Selection
        let newEdges = allEdges
            .enter()
            .append('line');

        //Get rid of extra elements
        allEdges.exit().remove();

        //Merge existing and new selections
        allEdges = newEdges.merge(newEdges);

        allEdges
            .attr('x1', n => {
                return n.level * 180 + 100;
            })
            .attr('x2', n => {
                return n.parentNode.level * 180 + 100;
            })
            .attr('y1', n => {
                return n.position * 120 + 100;
            })
            .attr('y2', n => {
                return n.parentNode.position * 120 + 100;
            });

        //Render nodes
        //Existing(Update) Selection
        let allNodes = svg.selectAll('circle')
            .data(this.nodes);

        //New (Enter) Selection
        let newNodes = allNodes
            .enter()
            .append('circle');

        //Get rid of extra nodes
        allNodes.exit().remove();

        //Merge existing and new selections
        allNodes = newNodes.merge(allNodes)
            .attr('cx', n => {
                return n.level * 180 + 100;
            })
            .attr('cy', n => {
                return n.position * 120 + 100;
            })
            .attr('r', 50);

        //Existing(Update) Selection
        let allLabels = svg.selectAll('text')
            .data(this.nodes);

        //New (Enter) Selection
        let newLabels = allLabels
            .enter()
            .append('text')
            .attr('class', 'label');

        //Get rid of extra nodes
        allLabels.exit().remove();

        //Merge existing and new selections
        allLabels = newLabels.merge(allLabels);

        allLabels
            .attr('x', n => {
                return n.level * 180 + 100;
            })
            .attr('y', n => {
                return n.position * 120 + 100;
            })
            .text(n => {
                return n.name.toUpperCase()
            })
    }

}