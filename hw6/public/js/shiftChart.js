/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
        this.stateList = d3.select("#stateList").append("ul");

        this.svgWidth = this.divShiftChart.node().getBoundingClientRect().width;
        this.svgHeight = this.svgWidth;

        this.svg = this.divShiftChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

        this.states = [];
        this.years = [1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012];
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates, isYear){

        if (isYear)
            this.years = selectedStates;
        else
            this.states = selectedStates;

        let states = this.states;
        let years = this.years;

        // ******* TODO: PART V *******

        //Display the names of selected states in a list
        let li = this.stateList.selectAll("li")
            .data(states);
        li.exit().remove();
        li = li.enter().append("li").merge(li)
            .text(d => d)

        //******** TODO: PART VI*******
        //Use the shift data corresponding to the selected years and sketch a visualization
        //that encodes the shift information

        //******** TODO: EXTRA CREDIT I*******
        //Handle brush selection on the year chart and sketch a visualization
        //that encodes the shift informatiomation for all the states on selected years

        //******** TODO: EXTRA CREDIT II*******
        //Create a visualization to visualize the shift data
        //Update the visualization on brush events over the Year chart and Electoral Vote Chart

        this.svg.selectAll("g").remove();

        let margin = {top: 10, right: 10, bottom: 50, left: 10};
        let width = this.svgWidth - margin.right - margin.left;
        let height = this.svgHeight - margin.top - margin.bottom;

        let xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
        let yScale = d3.scaleLinear()
            .domain([100, -100])
            .range([0, height])

        let colorScale = d3.scaleLinear()
            .domain([0, states.length])
            .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])


        //Domain definition for global color scale
        let domain = [-100, 0, 100];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        let colorScale2 = d3.scaleQuantile()
            .domain(domain)
            .range(range);


        let xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(-height);
        let xAxisContainer = this.svg.append("g")
            .attr("transform", "translate(30,"+(height+10)+")")
            .call(xAxis);
        let xAxisDomain = xAxisContainer.selectAll(".domain")
            .remove();
        let xAxisText = xAxisContainer.selectAll("text")
            .attr("transform", "translate(-7.5,30), rotate(-90)")

        let yAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(-width)
        let yAxisContainer = this.svg.append("g")
            .attr("transform", "translate(30,10)")
            .call(yAxis);
        let yAxisDomain = yAxisContainer.selectAll(".domain")
            .remove();
        let yAxisTick = yAxisContainer.selectAll(".tick")
            .each(function (d, i) {
                if (d3.select(this).select("text").text() == "0")
                    d3.select(this).attr("class", "solidtick")
            })
        let yAxisText = yAxisTick.selectAll("text")
            .attr("fill", function (i) {
                return colorScale2(i);
            })
        let yAxisLine = yAxisTick.selectAll("line")
            .attr("stroke", function (i) {
                return colorScale2(i);
            })

        let label = this.svg.append("g");
        label.append("text")
            .text("Republican")
            .attr("x", 50)
            .attr("y", 30)
            .attr("fill", "#de2d26")
            .style("font-size", "26px")
        label.append("text")
            .text("Democratic")
            .attr("x", 50)
            .attr("y", height)
            .attr("fill", "#3182bd")
            .style("font-size", "26px")


        let offset = width / (years.length * 2)
        let dotgroup = this.svg.append("g")
            .attr("transform", "translate("+(30 + offset)+", 10)");
        let linegroup = this.svg.append("g")
            .attr("transform", "translate("+(30 + offset)+", 10)");

        for (let j = 0; j < years.length; j++) {
            d3.csv("data/Year_Timeline_"+years[j]+".csv", function (error, yearData) {
                for (let i = 0; i < states.length; i++) {
                    for (let stateData of yearData) {
                        if (states[i] == stateData.State) {
                            let x = xScale(parseInt(years[j]));
                            let y = yScale(parseFloat(stateData["RD_Difference"]));
                            dotgroup.append("circle")
                                .attr("cx", x)
                                .attr("cy", y)
                                .attr("r", 4)
                                .attr("fill", colorScale(i))
                                .attr("id", states[i])
                            if (j != 0) {
                                let x2 = xScale(parseInt(years[j]-4));
                                let y2 = yScale(parseFloat(stateData["Last_RD_Difference"]));
                                linegroup.append("line")
                                    .attr("x1", x)
                                    .attr("x2", x2)
                                    .attr("y1", y)
                                    .attr("y2", y2)
                                    .attr("stroke", colorScale(i))
                                    .attr("id", states[i])
                            }
                        }
                    }
                }
            })
        }


        // console.log(data)
        // console.log(data.values())
        // let value = Array.from(data.values())
        // console.log(value)
        // let test = value.next();
        // console.log(test)
        // let cao = test['0']
        // console.log(cao)
        // let linegroup = this.svg.append("g");
        //
        // let value = Array.from(data.values());
        // console.log(value)
        // let lineGenerator = d3.line()
        // // .x((d, i) => xScale(d[i].year))
        // // .y((d, i) => yScale(d[i].data))
        // let pathString = lineGenerator(value)
        // console.log(pathString)
        // let line = linegroup.append("path")
        // // .transition()
        // // .duration(1000)
        //     .attr("d", pathString);

    };
}
