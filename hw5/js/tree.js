/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300.
        let treemap = d3.tree()
            .size([800, 300])

        //Create a root for the tree using d3.stratify();
        let root = d3.stratify()
            .id(function (d, i) {
                return i;
            })
            .parentId(d => d.ParentGame)
            (treeData);

        //Add nodes and links to the tree.
        let tree = treemap(root);

        let nodesdata = tree.descendants();

        let nodegroup = d3.select("#tree").append("g")
            .attr("class", "node")
            .attr("transform", "translate(100, 0)")
        let nodes = nodegroup.selectAll("g")
            .data(nodesdata);
        nodes = nodes.enter().append("g")
            .attr("class", function (d) {
                return d.data.Wins == 1 ? "winner" : "loser";
            })
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            })
        nodes.append("circle")
            .attr("r", "5px");
        nodes.append("text")
            .attr("text-anchor", function (d) {
                return d.depth == 4 ? "start" : "end"
            })
            .attr("x", function (d) {
                return d.depth == 4 ? 10 : -10;
            })
            .attr("y", 5)
            .text(d => d.data.Team)

        let linksdata = tree.links();

        let linkgroup = d3.select("#tree").append("g")
            .attr("class", "link")
            .attr("transform", "translate(100, 0)")
        let links = linkgroup.selectAll("path")
            .data(linksdata)
        links = links.enter().append("path")
            .attr("d", d3.linkHorizontal()
                .x(function(d) { return d.y; })
                .y(function(d) { return d.x; }));
    }


    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******

        let links = d3.select("#tree").select("g.link").selectAll("path");
        let texts = d3.select("#tree").select("g.node").selectAll("text");

        if (row.value.type == "aggregate") {
            links.each(function (d) {
                if (d.source.data.Team == row.key && d.target.data.Team == row.key) {
                    d3.select(this).attr("class", "selected")
                }
            })
            texts.each(function (d) {
                if (d.data.Team == row.key) {
                    d3.select(this).attr("class", "selectedLabel")
                }
            })
        } else {
            links.each(function (d) {
                if (d.source.data.Team == row.key && d.target.data.Team == row.value.Opponent ||
                    d.source.data.Team == row.value.Opponent && d.target.data.Team == row.key ||
                    d.target.data.Team == row.key && d.target.data.Opponent == row.value.Opponent ||
                    d.target.data.Team == row.value.Opponent && d.target.data.Opponent == row.key) {
                    d3.select(this).attr("class", "selected")
                }
            })
            texts.each(function (d) {
                if (d.data.Team == row.key && d.data.Opponent == row.value.Opponent ||
                    d.data.Team == row.value.Opponent && d.data.Opponent == row.key) {
                    d3.select(this).attr("class", "selectedLabel")
                }
            })
        }
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        let links = d3.select("#tree").select("g.link").selectAll("path")
            .attr("class", null);
        let texts = d3.select("#tree").select("g.node").selectAll("text")
            .attr("class", null);
    }
}
