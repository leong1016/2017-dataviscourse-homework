/** Class representing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
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

        let svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
            xAxisWidth = 100,
            yAxisHeight = 70;

        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)

        let xScale = d3.scaleBand()
            .domain(this.allData.map(function (d) {
                return d.year;
            })).range([svgBounds.width, yAxisHeight]).padding(.1);

        let maxValue = d3.max(this.allData, function (d) {
            return parseInt(d[selectedDimension]);
        });

        let yScale = d3.scaleLinear()
            .domain([0, maxValue]).range([svgBounds.height - xAxisWidth, 0]);


        let t = d3.transition()
            .duration(1000);

        // Create colorScale
        let colorScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range(['#097ecc', '#043352']);

        // Create the axes
        let xAxis = d3.axisLeft()
            .scale(xScale);

        d3.select("#xAxis")
            .attr("transform", "rotate(-90) translate(" + (xAxisWidth - svgBounds.height) + ",0)")
            .call(xAxis);

        let yAxis = d3.axisLeft()
            .scale(yScale);

        d3.select("#yAxis")
            .attr("transform", "translate(" + yAxisHeight + ",0)")
            .transition(t)
            .call(yAxis);

        // Create the bars
        let bars = d3.select("#bars").selectAll("rect").data(this.allData);
        bars = bars.enter()
            .append('rect')
            .attr('y', function (d) {
                return svgBounds.height - xAxisWidth;
            })
            .merge(bars);

        bars.exit().remove();
        bars
            .attr('x', function (d) {
                return xScale(d.year);
            })
            .attr('width', function (d) {
                return xScale.bandwidth();

            })
            .transition(t)
            .attr('y', function (d) {
                return yScale(d[selectedDimension]);
            })
            .attr('height', function (d) {
                return svgBounds.height - xAxisWidth - yScale(d[selectedDimension]);
            })
            .attr('fill', function (d) {
                return colorScale(d[selectedDimension]);
            });


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

        bars.on('click', function (oneWorldCupData, i) {
            d3.select('.selected').classed('selected', false);
            d3.select(this).classed('selected', true);

            barChart.worldMap.updateMap(oneWorldCupData);
            barChart.infoPanel.updateInfo(oneWorldCupData);

        });
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

        this.updateBarChart(d3.select('#dataset').node().value);
    }
}