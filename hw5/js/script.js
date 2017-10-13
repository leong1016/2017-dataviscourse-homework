//     /**
//      * Loads in the table information from fifa-matches.json
//      */
// d3.json('data/fifa-matches.json',function(error,data){
//
//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, csvData) {
//
//         //Create a unique "id" field for each game
//         csvData.forEach(function (d, i) {
//             d.id = d.Team + d.Opponent + i;
//         });
//
//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(csvData);
//
//         //Create Table Object and pass in reference to tree object (for hover linking)
//         let table = new Table(data,tree);
//
//         console.log(data)
//
//         table.createTable();
//         table.updateTable();
//     });
// });



// ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

    // ******* TODO: PART I *******

        let ranking = {
           "Winner": 7,
           "Runner-Up": 6,
           "Third Place": 5,
           "Fourth Place": 4,
           "Semi Finals": 3,
           "Quarter Finals": 2,
           "Round of Sixteen": 1,
           "Group": 0
        };

        teamData = d3.nest()
            .key(function (d) {
                return d.Team;
            })
            .rollup(function (leaves) {
                leaves.sort(function (a, b) {
                    return ranking[b.Result] - ranking[a.Result];
                })
                gameData = d3.nest()
                    .key(function (d) {
                        return d.Opponent;
                    })
                    // .sortValues(function (a, b) {
                    //     return ranking[a.Result] - ranking[b.Result];
                    // })
                    .rollup(function (leaves) {
                        return {
                            "Goals Made": leaves[0]["Goals Made"],
                            "Goals Conceded": leaves[0]["Goals Conceded"],
                            "Delta Goals": leaves[0]["Delta Goals"],
                            "Wins": leaves[0]["Wins"],
                            "Losses": leaves[0]["Losses"],
                            "Result": {"label": d3.max(leaves, l => l.Result), "ranking": ranking[d3.max(leaves, l => l.Result)]},
                            "type": "game",
                            "Opponent": leaves[0]["Team"],
                        }
                    })
                    .entries(leaves);

                return {
                    "Goals Made": d3.sum(leaves, l => l["Goals Made"]),
                    "Goals Conceded": d3.sum(leaves, l => l["Goals Conceded"]),
                    "Delta Goals": d3.sum(leaves, l => l["Delta Goals"]),
                    "Wins": d3.sum(leaves, l => l.Wins),
                    "Losses": d3.sum(leaves, l => l.Losses),
                    "TotalGames": leaves.length,
                    "Result": {"label": d3.max(leaves, l => l.Result), "ranking": ranking[d3.max(leaves, l => l.Result)]},
                    "type": "aggregate",
                    "games": gameData
                }
            })
            .entries(matchesCSV)

        console.log(teamData)

        //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();
    });

});
// ********************** END HACKER VERSION ***************************