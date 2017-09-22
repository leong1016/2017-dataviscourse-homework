/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        let host = d3.select("#host")
            .text(oneWorldCup.host);
        let winner = d3.select("#winner")
            .text(oneWorldCup.winner);
        let silver = d3.select("#silver")
            .text(oneWorldCup.runner_up);

        let data = oneWorldCup.TEAM_NAMES.split(",");
        d3.select("#teams").select("ul").remove();
        let teamsList = d3.select("#teams").append("ul")
            .attr("style", "padding-left: 1.2em");
        let teams = teamsList.selectAll("li")
            .data(data)
        teams.enter().append("li")
            .text(function (d, i) {
                return d;
            })

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels


    }

}