document.getElementsByTagName("button")[0].addEventListener("click", staircase);
document.getElementById("dataset").addEventListener("change", changeData);
document.getElementById("random").addEventListener("change", randomSubset);

/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    let rects = document.getElementById("barchart1").children;
    let heights = [];
    for (let i = 0; i < rects.length; i++) {
        heights.push(rects[i].getAttribute("height"));
    }
    heights.sort(function (a, b) {
        return a - b;
    })
    for (let i = 0; i < rects.length; i++) {
        rects[i].setAttribute("height", heights[i]);
    }
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }

    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 140]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 140]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    let bargroupa = d3.select("#barchart1");
    let rectsa = bargroupa.selectAll("rect")
                .data(data);
    rectsa.exit()
        .transition()
        .duration(1000)
        .attr("height", 0)
        .remove();
    rectsa = rectsa.enter().append("rect")
        .attr("x", function (d, i) {
            return iScale(i) + 10;  //html starts from 10
        })
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 0)
        .merge(rectsa);
    rectsa.transition()
        .duration(1000)
        .attr("x", function (d, i) {
            return iScale(i) + 10;  //html starts from 10
        })
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", function (d, i) {
            return aScale(d.a);
        });

    // TODO: Select and update the 'b' bar chart bars

    let bargroupb = d3.select("#barchart2");
    let rectsb = bargroupb.selectAll("rect")
        .data(data);
    rectsb.exit()
        .transition()
        .duration(1000)
        .attr("height", 0)
        .remove();
    rectsb = rectsb.enter().append("rect")
        .attr("x", function (d, i) {
            return iScale(i) + 10;  //html starts from 10
        })
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 0)
        .merge(rectsb);
    rectsb.transition()
        .duration(1000)
        .attr("x", function (d, i) {
            return iScale(i) + 10;  //html starts from 10
        })
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", function (d, i) {
            return aScale(d.b);
        });

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));
    aLineGenerator = aLineGenerator(data);

    d3.select("#linechart1").select("path")
        .transition()
        .duration(1000)
        .attr("d", aLineGenerator);

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.b));
    bLineGenerator = bLineGenerator(data);

    d3.select("#linechart2").select("path")
        .transition()
        .duration(1000)
        .attr("d", bLineGenerator);

    // TODO: Select and update the 'a' area chart path using this area generator

    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));
    aAreaGenerator = aAreaGenerator(data);

    d3.select("#areachart1").select("path")
        .transition()
        .duration(1000)
        .attr("d", aAreaGenerator);

    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.b));
    bAreaGenerator = bAreaGenerator(data);

    d3.select("#areachart2").select("path")
        .transition()
        .duration(1000)
        .attr("d", bAreaGenerator);

    // TODO: Select and update the scatterplot points

    let plotgroup = d3.select("#scatterplot");
    let circles = plotgroup.selectAll("circle")
        .data(data);
    circles.exit()
        .style("opacity", 1)
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
    let newcircles = circles.enter().append("circle")
        .attr("cx", function (d, i) {
            return aScale(d.a);
        })
        .attr("cy", function (d, i) {
            return bScale(d.b);
        })
        .attr("r", 5)
        .style("opacity", 0);
    circles = newcircles.merge(circles);
    circles.transition()
        .duration(1000)
        .attr("cx", function (d, i) {
            return aScale(d.a);
        })
        .attr("cy", function (d, i) {
            return bScale(d.b);
        })
        .attr("r", 5)
        .style("opacity", 1)

    // ****** TODO: PART IV ******

    let barcharts = document.getElementsByClassName("barChart");
    for (let item of barcharts) {
        item.addEventListener("mouseover", function (event) {
            event.target.setAttribute("fill", "#EEEEEE")
        });
        item.addEventListener("mouseout", function (event) {
            event.target.setAttribute("fill", "steelblue")
        });
    }

    let scatterplot = document.getElementById("scatterplot");
    let plots = scatterplot.getElementsByTagName("circle");
    for (let item of plots) {
        item.addEventListener("click", function () {
            let x = item.__data__.a;
            let y = item.__data__.b;
            console.log(x+","+y);
        })
    }

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.select("#scatterplot").selectAll("circle")
        .on("mouseover", function (d, i) {
            div.html("("+d.a+", "+d.b+")")
                .style("left", d3.event.pageX+"px")
                .style("top", d3.event.pageY+"px")
                .style("opacity", 1)
        })
        .on("mouseout", function () {
            div.style("opacity", 0);
        })
}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}