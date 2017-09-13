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
    let rects = document.getElementById("barchart1").getElementsByTagName("rect");
    for (let i = 0; i < 11; i++) {
        rects[i].setAttribute("height", (i + 4) * 10);
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
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    let bargroupa = d3.select("#barchart1");
    let rectsa = bargroupa.selectAll("rect")
                .data(data);
    rectsa.exit().remove();
    rectsa = rectsa.enter().append("rect").merge(rectsa);
    rectsa.attr("x", (d, i) => 10 * i);
    rectsa.attr("y", 0);
    rectsa.attr("width", 10);
    rectsa.attr("height", function (d, i) {
        return aScale(d.a);
    });

    // TODO: Select and update the 'b' bar chart bars

    let bargroupb = d3.select("#barchart2");
    let rectsb = bargroupb.selectAll("rect")
        .data(data);
    rectsb.exit().remove();
    rectsb = rectsb.enter().append("rect").merge(rectsb);
    rectsb.attr("x", (d, i) => 10 * i);
    rectsb.attr("y", 0);
    rectsb.attr("width", 10);
    rectsb.attr("height", function (d, i) {
        return aScale(d.b);
    });

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));
    aLineGenerator = aLineGenerator(data);

    d3.select("#linechart1").select("path")
        .attr("d", aLineGenerator);

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.b));
    bLineGenerator = bLineGenerator(data);

    d3.select("#linechart2").select("path")
        .attr("d", bLineGenerator);

    // TODO: Select and update the 'a' area chart path using this area generator

    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));
    aAreaGenerator = aAreaGenerator(data);

    d3.select("#areachart1").select("path")
        .attr("d", aAreaGenerator);

    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.b));
    bAreaGenerator = bAreaGenerator(data);

    d3.select("#areachart2").select("path")
        .attr("d", bAreaGenerator);

    // TODO: Select and update the scatterplot points

    let plotgroup = d3.select("#scatterplot");
    let circles = plotgroup.selectAll("circle")
        .data(data);
    circles.exit().remove();
    circles = circles.enter().append("circle").merge(circles);
    circles.attr("cx", function (d, i) {
        return aScale(d.a);
    });
    circles.attr("cy", function (d, i) {
        return bScale(d.b);
    });
    circles.attr("r", 5);

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