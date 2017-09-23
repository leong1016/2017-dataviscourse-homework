/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        let infoPanel = this.infoPanel;
        let worldMap = this.worldMap;

        // ******* TODO: PART I *******

        let offset = 60;
        let widthBarChart = d3.select("#barChart").attr("width");
        let heightBarChart = d3.select("#barChart").attr("height");
        let minValue = d3.min(this.allData, function (d) {
            return d[selectedDimension];
        })
        let maxValue = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });
        let years = [];
        for (let item of this.allData) {
            years.push(item.year);
        }

        // Create the x and y scales; make
        // sure to leave room for the axes

        let xScale = d3.scaleBand()
            .domain(years)
            .range([widthBarChart, offset]);

        let yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([heightBarChart, offset]);

        // Create colorScale

        let colorScale = d3.scaleSequential(function (t) {
            return d3.hsl(215, 0.5, t / 4 + 0.2);
        })
            .domain([maxValue, minValue]);

        // Create the axes (hint: use #xAxis and #yAxis)

        let xAxis = d3.axisBottom()
            .scale(xScale);
        let xAxisContainer = d3.select("#xAxis")
            .attr("transform", "translate(0, "+(heightBarChart - offset)+")")
            .call(xAxis);
        let xAxisText = xAxisContainer.selectAll("text")
            .attr("transform", "translate(-15, 30), rotate(-90)");

        let yAxis = d3.axisLeft()
            .scale(yScale);
        let yAxisContainer = d3.select("#yAxis")
            .attr("transform", "translate("+(offset)+", "+(-offset)+")")
            .transition()
            .duration(2000)
            .call(yAxis);

        // Create the bars (hint: use #bars)
        let rects = d3.select("#bars").selectAll("rect")
            .data(this.allData);
        rects = rects.enter().append("rect")
            .attr("transform", "translate("+(1)+", "+(heightBarChart - offset)+") scale(1, -1)")
            .attr("x", function (d, i) {
                return xScale(d.year);
            })
            .attr("y", 0)
            .attr("width", (widthBarChart - offset) / years.length - 2)
            .attr("height", 0)
            .attr("fill", function (d, i) {
                return colorScale(d[selectedDimension]);
            })
            .attr("style", "cursor: pointer")
            .merge(rects);
        rects.transition()
            .duration(2000)
            .attr("height", function (d, i) {
                return heightBarChart - yScale(d[selectedDimension]);
            })
            .attr("fill", function (d, i) {
                return colorScale(d[selectedDimension]);
            });

        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        rects
            .on("click", function () {
                rects.attr("class", null);
                d3.select(this).attr("class", "selected");
                let data = d3.select(this).property("__data__");
                infoPanel.updateInfo(data);
                worldMap.updateMap(data);
            })

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(selectedDimension) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

        this.updateBarChart(selectedDimension);

    }
}