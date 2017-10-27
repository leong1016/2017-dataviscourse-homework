/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates){

        console.log(selectedStates)

     // ******* TODO: PART V *******
    //Display the names of selected states in a list
        let ul = d3.select("#stateList").append("ul");
        let li = ul.selectAll("li")
            .data(selectedStates)
        li.exit().remove()
        li = li.enter().append("li").merge(li)
            .text(d => d.State)


    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };


}
