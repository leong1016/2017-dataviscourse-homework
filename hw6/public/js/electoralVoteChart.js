   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update (electionResult, colorScale){

    // ******* TODO: PART II *******

        console.log(electionResult)

        let chooseClass = this.chooseClass;
        let xScale = d3.scaleLinear()
            .domain([0, 538])
            .range([0, this.svgWidth]);

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
        let totalI = 0;
        let totalR = 0;
        let totalD = 0;
        let i = [];
        let p = [];

        for (let item of electionResult) {
            if (item.RD_Difference == 0) {
                i.push(item);
                totalI += parseInt(item.Total_EV);
            } else {
                p.push(item);
                if (item.RD_Difference > 0)
                    totalR += parseInt(item.Total_EV);
                else
                    totalD += parseInt(item.Total_EV);
            }
        }

        p.sort(function (a, b) {
            return b.RD_Difference - a.RD_Difference;
        })
        let totalVotes = totalI + totalR + totalD;

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

        this.svg.selectAll("g").remove();

        let groupp = this.svg.append("g")
        let rectp = groupp.selectAll("rect")
            .data(p);
        rectp = rectp.enter().append("rect").merge(rectp)
            .attr("width", function (d) {
                return xScale(d.Total_EV);
            })
            .attr('height', this.svgHeight / 5)
            .attr("x", function (d) {
                totalVotes -= d.Total_EV;
                return xScale(totalVotes);
            })
            .attr("y", this.svgHeight / 2)
            .attr("class", "electoralVotes")
            .attr("fill", function (d) {
                return colorScale(d.RD_Difference)
            })

        let groupi = this.svg.append("g")
        let recti = groupi.selectAll("rect")
            .data(i);
        recti = recti.enter().append("rect").merge(recti)
            .attr("width", function (d) {
                return xScale(d.Total_EV);
            })
            .attr("height", this.svgHeight / 5)
            .attr("x", function (d) {
                totalVotes -= d.Total_EV;
                return xScale(totalVotes);
            })
            .attr("y", this.svgHeight / 2)
            .attr("class", "electoralVotes independent")

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

        let groupv = this.svg.append("g");
        let votes = groupv.selectAll("text")
            .data([totalI, totalR, totalD])
        votes = votes.enter().append("text").merge(votes)
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
                        return xScale(totalI + totalR + totalD);
                    case 2:
                        return xScale(totalI);
                }
            })
            .attr("y", this.svgHeight / 2 - 5)
            .attr("class", function (d, i) {
                let result = "electoralVoteText ";
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

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

        let note = this.svg.append("g").append("text")
            .text("Electoral Vote ("+parseInt((totalI+totalR+totalD)/2+1)+" needed to win)")
            .attr("x", this.svgWidth / 2)
            .attr("y", this.svgHeight / 2 - 10)
            .attr("class", "electoralVotesNote")

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    };

    
}
