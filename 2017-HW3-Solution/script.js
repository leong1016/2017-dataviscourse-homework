/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** PART II solution ******
    let bars = document.getElementById('aBarChart').children,
        scale = 10;

    for (let i = 0; i < bars.length; i++) {
        bars[i].setAttribute('height', ((i + 1) * scale).toString())
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


    // ****** PART IV ******

    // Select and update the 'a' bar chart bars
    //Join new data with old elements
    let aBars = d3.select('#aBarChart').selectAll('rect').data(data);

    //Exit old elements
    aBars.exit().remove();

    //Enter new elements and update aBars with merge
    aBars = aBars.enter().append('rect')
        .attr('y', 0)
        .attr('width', 10)
        .merge(aBars);

    //Set Attributes for all elements
    aBars.attr('height', d => aScale(d.a));
    aBars.attr('x', (d, i) => iScale(i));
    aBars.on('mouseover', function () {
        this.setAttribute('fill', 'seagreen');
    });
    aBars.on('mouseout', function () {
        this.setAttribute('fill', 'steelblue');
    });

    // Select and update the 'b' bar chart bars
    let bBars = d3.select('#bBarChart').selectAll('rect').data(data);

    //Exit old elements
    bBars.exit().remove();

    //Enter new elements and update bBars with (merge)
    bBars = bBars.enter().append('rect')
        .attr('y', 0)
        .attr('width', 10)
        .merge(bBars);


    bBars.attr('height', function (d) {
        return aScale(d.b);
    });
    bBars.attr('x', function (d, i) {
        return iScale(i);
    });
    bBars.on('mouseover', function () {
        this.setAttribute('fill', 'red');
    });
    bBars.on('mouseout', function () {
        this.setAttribute('fill', 'steelblue');
    });

    // Select and update the 'a' line chart path using this line generator
    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    d3.select('#aLineChart').attr('d', aLineGenerator(data));

    // Select and update the 'b' line chart path (create your own generator)
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y(d => bScale(d.b));

    d3.select('#bLineChart').attr('d', bLineGenerator(data));

    // Select and update the 'a' area chart path using this line generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    d3.select('#aAreaChart').attr('d', aAreaGenerator(data));

    // Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.b));

    d3.select('#bAreaChart').attr('d', bAreaGenerator(data));

    // Select and update the scatterplot points
    let scatterplotPoints = d3.select('#scatterplot').selectAll('circle').data(data);

    scatterplotPoints.exit().remove();
    scatterplotPoints = scatterplotPoints.enter().append('circle').attr('r', 5).merge(scatterplotPoints);

    scatterplotPoints.attr('cx', function (d) {
        return aScale(d.a);
    });
    scatterplotPoints.attr('cy', function (d) {
        return bScale(d.b);
    });


    // ****** PART IV ******

    // Write the data point that was clicked to the console
    scatterplotPoints.on('click', function (d) {
        console.log(d);
    });
}


/**
 * Load the file indicated by the select menu
 */
function changeData() {
    // // Load the file indicated by the select menu
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