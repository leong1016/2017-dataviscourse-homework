/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor(allData) {
        this.allData = allData;
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.path = d3.geoPath()
            .projection(this.projection);
        this.graticule = d3.geoGraticule();
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

        d3.select("#points").selectAll(".gold, .silver").remove();

        d3.select("#map").selectAll(".team, .host")
            .attr("class", "countries");
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        let projection = this.projection;
        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

        let gold = d3.select("#points").append("circle")
            .attr("cx", function () {
                return projection(worldcupData.win_pos)[0];
            })
            .attr("cy", function () {
                return projection(worldcupData.win_pos)[1];
            })
            .attr("r", 8)
            .attr("class", "gold");

        let silver = d3.select("#points").append("circle")
            .attr("cx", function () {
                return projection(worldcupData.ru_pos)[0];
            })
            .attr("cy", function () {
                return projection(worldcupData.ru_pos)[1];
            })
            .attr("r", 8)
            .attr("class", "silver");

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.

        for (let item of worldcupData.teams_iso) {
            let country = d3.select("#"+item)
                .attr("class", "team")
        }

        // Select the host country and change it's color accordingly.

        let host = d3.select("#"+worldcupData.host_country_code)
            .attr("class", "host");

        // Add a marker for gold/silver medalists
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        let newworld = topojson.feature(world, world.objects.countries);
        let allData = this.allData;

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        let map = d3.select("#map");
        let mapPath = map.selectAll("path")
            .data(newworld.features)
            .enter()
            .append("path")
            .attr("class", "countries")
            .attr("id", function (d, i) {
                return d.id;
            })
            .attr("d", this.path)
            .on("click", function (event) {
                let curr = event.id;
                let count = 0;
                let list = [];
                for (let i = allData.length - 1; i >= 0; i--) {
                    for (let item of allData[i].teams_iso) {
                        if (item == curr) {
                            count++
                            list.push(allData[i].year)
                            break;
                        }
                    }
                }
                let panel = d3.select("#extra")
                    .attr("y", "12")
                    .style("font-size", "11px")
                if (count == 0) {
                    panel.text(curr+" has never participated in World Cup.")
                } else {
                    panel.text(curr+" has participated in World Cup for "+count+" times : "+list)
                }
            })

        let graticulePath = d3.select("#map").append("path")
            .datum(this.graticule)
            .attr("class", "grat")
            .attr("d", this.path)
            .attr("fill", "none");
    }

}
