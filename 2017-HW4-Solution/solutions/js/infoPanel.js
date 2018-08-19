/** Class representing the infoPanel view. */
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

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels
        d3.select("#edition").text(oneWorldCup.EDITION);
        d3.select("#host").text(oneWorldCup.host);
        d3.select("#winner").text(oneWorldCup.winner);
        d3.select("#silver").text(oneWorldCup.runner_up);

        d3.select("#teams").selectAll(".team_label").remove();

        //Create a list item for each participating team
        let team_text = d3.select("#teams").selectAll(".team_label")
            .data(oneWorldCup.teams_names);

        team_text
            .enter().append("li")
            .text(function (d) {
                return d
            })
            .classed("team_label", true)
    }

}