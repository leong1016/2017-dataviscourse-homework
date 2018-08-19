/** Class representing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

        //Set all countries back to non-hosts
        d3.select("#map").selectAll('.host').classed("host", false);
        d3.select("#map").selectAll('.team').classed("team", false);

        //remove the markers for 1st and 2nd place
        d3.select('#winner-mark')
            .remove();

        d3.select('#runner-up-mark')
            .remove();
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        //Add a marker for gold/silver medalists
        let winner = d3.select('#points')
            .selectAll('#winner')
            .data([worldcupData]);

        winner
            .enter()
            .append("circle")
            .attr('class', 'gold')
            .attr('id', 'winner-mark')
            .attr('r', 10)
            .merge(winner)
            .attr("cx", (d) => {
                return this.projection(d.win_pos)[0];
            })
            .attr("cy", (d) => {
                return this.projection(d.win_pos)[1];
            });

        let silver = d3.select('#points')
            .selectAll('#runner-up-mark')
            .data([worldcupData]);

        silver
            .enter()
            .append("circle")
            .attr('class', 'silver')
            .attr('id', 'runner-up-mark')
            .attr("r", 10)
            .merge(winner)
            .attr("cx", (d) => {
                return this.projection(d.ru_pos)[0];
            })
            .attr("cy", (d) => {
                return this.projection(d.ru_pos)[1];
            });


        //Select host path element and set it's class to host
        d3.select("#map")
            .select('path' + "#" + worldcupData.host_country_code)
            .classed("host", true);


        //Select all participating country path elements
        worldcupData.teams_iso.forEach(function (j) {
            let teamElement = d3.select("#map").select('path' + "#" + j + ".countries");
            teamElement.classed("team", true);
        })
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is global!
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        let path = d3.geoPath()
            .projection(this.projection);

            console.log(topojson.feature(world, world.objects.countries).features)
        d3.select("#map")
            .selectAll("path")
            //.data(world.object.countries)
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr("id", function (d) {
                return d.id;
            })
            .classed("countries", true)
            .attr("d", path);

        //Add gridlines to the map
        let graticule = d3.geoGraticule();

        d3.select("#map")
            .append('path')
            .datum(graticule)
            .attr('class', "grat")
            .attr('d', path)
            .attr('fill', 'none');
    }


}
