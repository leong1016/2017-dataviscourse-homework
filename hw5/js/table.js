/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .range([0,this.cell.width * 2]);

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
            .range([0,this.cell.width]);

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .range(["#ece2f0","#016450"]);

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleThreshold()
            .range(["#cb181d","#034e7b"]);

        this.assending = false;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        this.goalScale.domain([0,18]);                //replace
        this.gameScale.domain([0,7]);                 //replace
        this.aggregateColorScale.domain([0,7]);       //replace
        this.goalColorScale.domain([0]);              //replace

        // Create the x axes for the goalScale.
        let axis = d3.axisTop()
            .scale(this.goalScale);

        //add GoalAxis to header of col 1.
        let goalaxis = d3.select("#goalHeader")
            .attr("style", "padding: 1px 5px")

        goalaxis.append("svg")
            .attr("width", this.cell.width * 2 + 20)
            .attr("height", this.cell.height)
            .append("g")
            .attr("transform", "translate(10, 19)")
            .call(axis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        this.tableHeaders.splice(0, 0, "Team");

        let thead = d3.select("thead").select("tr");
        let thtd = thead.selectAll("th, td")
            .data(this.tableHeaders)
            .on("click", d => this.sortTable(d));
        // Clicking on headers should also trigger collapseList() and updateTable().

       
    }

    sortTable(d) {
        this.collapseList();
        if (this.assending) {
            if (d == "Team") {
                this.tableElements.sort(function (a, b) {
                    return a.key.localeCompare(b.key);
                })
            } else if (d == "Result") {
                this.tableElements.sort(function (a, b) {
                    return a.value.Result.ranking - b.value.Result.ranking;
                })
            } else {
                this.tableElements.sort(function (a, b) {
                    return a.value[d] - b.value[d];
                })
            }
            this.assending = false;
        } else {
            if (d == "Team") {
                this.tableElements.sort(function (a, b) {
                     return b.key.localeCompare(a.key);

                })
            } else if (d == "Result") {
                this.tableElements.sort(function (a, b) {
                    return b.value.Result.ranking - a.value.Result.ranking;
                })
            } else {
                this.tableElements.sort(function (a, b) {
                    return b.value[d] - a.value[d];
                })
            }
            this.assending = true;
        }
        this.updateTable();
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {

        let goalScale = this.goalScale;
        let gameScale = this.gameScale;
        let aggregateColorScale = this.aggregateColorScale;
        let goalColorScale = this.goalColorScale;

        // ******* TODO: PART III *******
        //Create table rows
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);
        tr.exit().remove();
        tr = tr.enter().append("tr").merge(tr)
            .attr("class", function (d) {
                return d.value.type == "aggregate" ? "aggregate" : "game";
            })
            .on("mouseover", d => this.tree.updateTree(d))
            .on("mouseout", d => this.tree.clearTree());

        //Append th elements for the Team Names
        let th = tr.selectAll("th")
            .data(function (d) {                                            //replace
                return [d];
            })
        th.exit().remove();
        th = th.enter().append("th").merge(th);
        th.text(function (d) {
            return d.value.type == "aggregate" ? d.key : "x"+d.key;
        })
            .on("click", d => this.updateList(d));

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        let td = tr.selectAll("td")
            .data(function (d, i) {
                let temp = [];
                if (d.value.type == "aggregate") {
                    let goals = {type: d.value.type, vis: "goals", value: {delta: d.value["Delta Goals"],
                                                                          conceded: d.value["Goals Conceded"],
                                                                          made: d.value["Goals Made"]}};
                    temp.push(goals);
                    let texts = {type: "aggregate", vis: "texts", value: d.value.Result.label};
                    temp.push(texts);
                    let wins = {type: "aggregate", vis: "bars", value: d.value.Wins};
                    temp.push(wins);
                    let losses = {type: "aggregate", vis: "bars", value: d.value.Losses};
                    temp.push(losses);
                    let total = {type: "aggregate", vis: "bars", value: d.value.TotalGames};
                    temp.push(total);
                } else {
                    let made = d.value["Goals Made"];
                    let conceded = d.value["Goals Conceded"];
                    let goals = {type: "game", vis: "goals", value: {delta: made - conceded, conceded: conceded, made: made}};
                    temp.push(goals);
                    let texts = {type: "game", vis: "texts", value: d.value.Result.label};
                    temp.push(texts);
                    let empty = {type: "game", vis: "empty"}
                    temp.push(empty);
                    temp.push(empty);
                    temp.push(empty);
                }
                return temp;
            })
        td.exit().remove();
        td = td.enter().append("td").merge(td);

        //populate bar charts
        let tdbars = td.filter(function (d, i) {
            return d.type == "aggregate" && d.vis == "bars";
        })
            .attr("style", "padding: 2px 2px 2px 0px");

        let bars = tdbars.selectAll("svg")
            .data(function (d) {                                            //replace
                return [d];
            });
        bars.exit().remove();
        bars = bars.enter().append("svg").merge(bars)
            .attr("width", this.cell.width)
            .attr("height", this.cell.height);

        let barsrect = bars.selectAll("rect")
            .data(function (d) {                                            //replace
                return [d];
            })
        barsrect.exit().remove();
        barsrect = barsrect.enter().append("rect").merge(barsrect)
            .attr("width", function (d) {
                return gameScale(d.value);
            })
            .attr("height", this.bar.height)
            .attr("fill", function (d) {
                return aggregateColorScale(d.value)
            })

        let barstext = bars.selectAll("text")
            .data(function (d) {                                            //replace
                return [d];
            })
        barstext.exit().remove();
        barstext.enter().append("text").merge(barstext)
            .attr("x", function (d) {
                return gameScale(d.value) - 10;
            })
            .attr("y", this.cell.height / 2 + 4)
            .attr("class", "label")
            .text(function (d) {
                return d.value;
            })

        let tdempty = td.filter(function (d, i) {
            return d.type == "game" && d.vis == "empty";
        })
        tdempty.select("svg").remove();

        //populate goals charts
        let tdgoals = td.filter(function (d) {
            return d.vis == "goals"
        })
            .attr("title", function (d) {
                return "Goals Made: "+d.value.made+"\n"+
                       "Goals Conceded: "+d.value.conceded+"\n"+
                       "Delta: "+d.value.delta;
            })

        let goalssvg = tdgoals.selectAll("svg")
            .data(function (d) {
                return [d];
            })
        goalssvg.exit().remove();
        goalssvg = goalssvg.enter().append("svg").merge(goalssvg)
            .attr("width", this.cell.width * 2 + 20)
            .attr("height", this.cell.height)

        let goals = goalssvg.selectAll("g")
            .data(function (d) {
                return [d];
            })
        goals.exit().remove();
        goals = goals.enter().append("g").merge(goals)
            .attr("transform", "translate(10, 0)")

        let goalsrect = goals.selectAll("rect")
            .data(function (d) {
                return [d];
            })
        goalsrect.exit().remove();
        goalsrect = goalsrect.enter().append("rect").merge(goalsrect)
            .attr("x", function (d) {
                return goalScale(d3.min([d.value.made, d.value.conceded]));
            })
            .attr("y", d => d.type == "aggregate" ? 2 : 7)
            .attr("width", function (d) {
                let abs = d.value.delta > 0 ? d.value.delta : -d.value.delta;
                return goalScale(abs);
            })
            .attr("height", d => d.type == "aggregate" ? this.bar.height - 4 : (this.bar.height - 14))
            .attr("fill", function (d) {
                return goalColorScale(d.value.delta);
            })
            .attr("class", "goalBar")

        let goalscircle = goals.selectAll("circle")
            .data(function (d) {
                let temp = [];
                temp.push({type: d.type, value: d.value.conceded, made: false, delta: d.value.delta});
                temp.push({type: d.type, value: d.value.made, made: true, delta: d.value.delta});
                return temp;
            })
        goalscircle.exit().remove();
        goalscircle = goalscircle.enter().append("circle").merge(goalscircle)
            .attr("cx", function (d) {
                return goalScale(d.value);
            })
            .attr("cy", this.bar.height / 2)
            .attr("r", d => d.type == "aggregate" ? (this.bar.height - 4) / 2 : (this.bar.height - 8) / 2)
            .attr("fill", function (d) {
                if (d.type == "aggregate") {
                    if (d.delta == 0)
                        return "#888888";
                    if (d.made)
                        return "#034e7b";
                    else
                        return "#cb181d";
                } else {
                    return "#ffffff";
                }
            })
            .attr("stroke", function (d) {
                if (d.type == "aggregate") {
                    return null;
                } else {
                    if (d.delta == 0)
                        return "#888888";
                    if (d.made)
                        return "#034e7b";
                    else
                        return "#cb181d";
                }
            })
            .attr("stroke-width", function (d) {
                if (d.type == "aggregate")
                    return null;
                else
                    return "3px";
            })

        //populate text
        let results = td.filter(function (d) {
            return d.vis == "texts";
        })
            .style("min-width", this.cell.width * 2+"px")
            .text(function (d) {
                return d.value;
            })

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        if (i.value.type == "game")
            return;

        for (let j = 0; j < this.tableElements.length; j++) {
            if (this.tableElements[j].key == i.key && this.tableElements[j].value.type == "aggregate") {
                if (j == this.tableElements.length - 1 || this.tableElements[j+1].value.type == "aggregate") {
                    for (let k = 0; k < i.value.games.length; k++) {
                        this.tableElements.splice(j+k+1, 0, i.value.games[k]);
                    }
                } else {
                    while (j+1 < this.tableElements.length && this.tableElements[j+1].value.type == "game") {
                        this.tableElements.splice(j+1, 1);
                    }
                }
                break;
            }
        }

        this.updateTable();

        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

        for (let i = this.tableElements.length - 1; i >= 0; i--) {
            if (this.tableElements[i].value.type == "game") {
                this.tableElements.splice(i, 1);
            }
        }
    }


}
