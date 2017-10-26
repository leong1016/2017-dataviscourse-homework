/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 200;

        //add the svg to the div
        this.svg = divvotesPercentage.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    }


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(data) {
        if (data == "R"){
            return "republican";
        }
        else if (data == "D"){
            return "democrat";
        }
        else if (data == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for toop tip
     */
    tooltip_render (tooltip_data) {
        let text = "<ul>";
        tooltip_data.result.forEach((row)=>{
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+")" + "</li>"
        });

        return text;
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
     *
     * @param electionResult election data for the year selected
     */
    update (electionResult){

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html((d)=> {
                let e = electionResult[0];
                let tooltip_data;
                if (e.I_Nominee_prop == " ") {
                    tooltip_data = {
                        "result":[
                            {"nominee": e.D_Nominee_prop,"votecount": e.D_Votes_Total,"percentage": e.D_PopularPercentage,"party":"D"} ,
                            {"nominee": e.R_Nominee_prop,"votecount": e.R_Votes_Total,"percentage": e.R_PopularPercentage,"party":"R"} ,
                        ]
                    }
                } else {
                    tooltip_data = {
                        "result":[
                            {"nominee": e.D_Nominee_prop,"votecount": e.D_Votes_Total,"percentage": e.D_PopularPercentage,"party":"D"} ,
                            {"nominee": e.R_Nominee_prop,"votecount": e.R_Votes_Total,"percentage": e.R_PopularPercentage,"party":"R"} ,
                            {"nominee": e.I_Nominee_prop,"votecount": e.I_Votes_Total,"percentage": e.I_PopularPercentage,"party":"I"}
                        ]
                    }
                }
                // pass this as an argument to the tooltip_render function then,
                // return the HTML content returned from that method.
                return this.tooltip_render(tooltip_data);
            });


        // ******* TODO: PART III *******

        let rp = parseFloat(electionResult[0].R_PopularPercentage);
        let dp = parseFloat(electionResult[0].D_PopularPercentage);
        let ip = isNaN(parseFloat(electionResult[0].I_PopularPercentage)) ? 0 : parseFloat(electionResult[0].I_PopularPercentage);
        let sum = rp + dp + ip;


        let chooseClass = this.chooseClass;
        let xScale = d3.scaleLinear()
            .domain([0, sum])
            .range([0, this.svgWidth])

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .votesPercentage class to style your bars.

        this.svg.selectAll("g").remove();
        this.svg.call(tip);

        let bargroup = this.svg.append("g")
        let bars = bargroup.selectAll("rect")
            .data([rp, dp, ip]);
        bars = bars.enter().append("rect").merge(bars);
        bars.attr("width", function (d) {
                return xScale(d);
            })
            .attr("height", this.svgHeight / 5)
            .attr("x", function (d) {
                sum -= d;
                return xScale(sum);
            })
            .attr("y", this.svgHeight / 2)
            .attr("class", function (d, i) {
                let result = "votesPercentage ";
                switch (i) {
                    case 0:
                        result += chooseClass("R");
                        break;
                    case 1:
                        result += chooseClass("D");
                        break;
                    case 2:
                        result += chooseClass("I");
                        break;
                }
                return result;
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)

        //Display the total percentage of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary
        let percgroup = this.svg.append("g");
        let perc = percgroup.selectAll("text")
            .data([electionResult[0].I_PopularPercentage, electionResult[0].R_PopularPercentage, electionResult[0].D_PopularPercentage])
        perc = perc.enter().append("text").merge(perc)
            .text(function (d) {
                if (d == 0)
                    return null;
                return d;
            })
            .attr("x", function (d, i) {
                switch (i) {
                    case 0:
                        return 0;
                    case 1:
                        return xScale(rp+dp+ip);
                    case 2:
                        return xScale(ip);
                }
            })
            .attr("y", this.svgHeight / 2 - 5)
            .attr("class", function (d, i) {
                let result = "votesPercentageText ";
                switch (i) {
                    case 0:
                        result += chooseClass("I");
                        break;
                    case 1:
                        result += chooseClass("R");
                        break;
                    case 2:
                        result += chooseClass("D");
                        break;
                }
                return result;
            })

        let candgroup = this.svg.append("g");
        let cand = candgroup.selectAll("text")
            .data([electionResult[0].I_Nominee_prop, electionResult[0].R_Nominee_prop, electionResult[0].D_Nominee_prop])
        cand = cand.enter().append("text").merge(cand)
            .text(d => d)
            .attr("x", function (d, i) {
                switch (i) {
                    case 0:
                        return 0;
                    case 1:
                        return xScale(rp+dp+ip);
                    case 2:
                        return xScale(ip);
                }
            })
            .attr("y", this.svgHeight / 2 - 50)
            .attr("class", function (d, i) {
                let result = "votesPercentageText ";
                switch (i) {
                    case 0:
                        result += chooseClass("I");
                        break;
                    case 1:
                        result += chooseClass("R");
                        break;
                    case 2:
                        result += chooseClass("D");
                        break;
                }
                return result;
            })

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        let bar = this.svg.append("g").append("rect")
            .attr("x", this.svgWidth / 2 - 1.5)
            .attr("y", this.svgHeight / 2 - 3)
            .attr("width", 3)
            .attr("height", this.svgHeight / 5 + 6)
            .attr("class", "middlePoint")

        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element

        let note = this.svg.append("g").append("text")
            .text("Popular Vote (50%)")
            .attr("x", this.svgWidth / 2)
            .attr("y", this.svgHeight / 2 - 10)
            .attr("class", "votesPercentageNote")

        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    };


}