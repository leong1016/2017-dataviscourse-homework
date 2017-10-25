   
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

        let xScale = d3.scaleLinear()
            .domain([0, 538])
            .range([0, this.svgWidth]);

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
        let totalVotes = 0;
        let i = [];
        let p = []

        for (let item of electionResult) {
            totalVotes += parseInt(item.Total_EV);
            if (item.RD_Difference == 0) {
                i.push(item);
            } else {
                p.push(item);
            }
        }

        p.sort(function (a, b) {
            return b.RD_Difference - a.RD_Difference;
        })

        console.log(totalVotes);
    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

        let groupp = this.svg.append("g")
        let rectp = groupp.selectAll("rect")
            .data(p);
        rectp.exit().remove();
        rectp = rectp.enter().append("rect").merge(rectp)
            .attr("width", function (d) {
                return xScale(d.Total_EV);
            })
            .attr('height', this.svgHeight / 6)
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
        recti.exit().remove();
        recti = recti.enter().append("rect").merge(recti)
            .attr("width", function (d) {
                return xScale(d.Total_EV);
            })
            .attr("height", this.svgHeight / 6)
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

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
        let groupb = this.svg.append("g");
        let bar = groupb.select("")

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    };

    
}
