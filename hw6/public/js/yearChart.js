
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

       // ******* TODO: PART I *******

        let electoralVoteChart = this.electoralVoteChart;
        let tileChart = this.tileChart;
        let votePercentageChart = this.votePercentageChart;
        let colorScale = this.colorScale;
        let chooseClass = this.chooseClass;

        let xScale = d3.scaleLinear()
            .domain([1940, 2012])
            .range([0 + 50, this.svgWidth - 50])

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line
        let line = this.svg.append("g").append("line")
            .attr("x1", 0)
            .attr("x2", this.svgWidth)
            .attr("y1", this.svgHeight / 3)
            .attr("y2", this.svgHeight / 3)
            .attr("class", "lineChart")

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        let circles = this.svg.append("g");
        let circle = circles.selectAll("circle")
            .data(this.electionWinners);
        circle.enter().append("circle")
            .attr("cx", function (d) {
                return xScale(d.YEAR);
            })
            .attr("cy", this.svgHeight / 3)
            .attr("r", this.svgHeight / 6)
            .attr("class", function (d) {
                return chooseClass(d.PARTY);
            })
            .on("mouseover", function () {
                this.classList.add("highlighted");
            })
            .on("mouseout", function () {
                this.classList.remove("highlighted");
            });

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements
        let texts = this.svg.append("g")
        let text = texts.selectAll("text")
            .data(this.electionWinners);
        text.enter().append("text")
            .attr("x", function (d) {
                return xScale(d.YEAR)
            })
            .attr("y", this.svgHeight - 20)
            .attr("class", "yeartext")
            .text(function (d) {
                return d.YEAR;
            });

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations
        this.svg.selectAll("circle")
            .on("click", function (d) {
                circles.selectAll("circle").attr("class", d => chooseClass(d.PARTY));
                this.classList.add("selected");

                d3.csv("data/Year_Timeline_"+d.YEAR+".csv", function (error, electionResult) {
                    electoralVoteChart.update(electionResult, colorScale);
                    votePercentageChart.update(electionResult);
                    tileChart.update(electionResult, colorScale);
                })
            })


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
        let brush = d3.brushX()
            .extent([[0, this.svgHeight - 45],[this.svgWidth, this.svgHeight - 10]])
            .on("end", d => {
                let result = [];
                if (d3.event.selection != null) {
                    let brushstart = d3.event.selection[0];
                    let brushend = d3.event.selection[1];
                    let texts = this.svg.selectAll("text")
                        .each(function (d, i) {
                            let pos = parseFloat(d3.select(this).attr("x"));
                            if (pos >= brushstart && pos <= brushend) {
                                result.push(d.YEAR);
                            }
                        })
                }
                shiftChart.update(result, true);
            });
        this.svg.append("g").attr("class", "brush").call(brush);
    };

};