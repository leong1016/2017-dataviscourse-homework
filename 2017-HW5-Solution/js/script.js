    /**
     * Loads in the table information from fifa-matches.json 
     */
d3.json('data/fifa-matches.json',function(error,data){

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******

//     let goalsMadeHeader = 'Goals Made';
//     let goalsConcededHeader = 'Goals Conceded';

//     /**json Object to convert between rounds/results and ranking value*/
//         rank = {
//             "Winner": 7,
//             "Runner-Up": 6,
//             'Third Place': 5,
//             'Fourth Place': 4,
//             'Semi Finals': 3,
//             'Quarter Finals': 2,
//             'Round of Sixteen': 1,
//             'Group': 0
//         };

//     //Define cols to aggregate values. All cols except 'opponent', 'team', and 'id'
//     let aggregateAttributes = d3.keys(matchesCSV[0]).filter(function (key) {
//         return key !== "Opponent" && key !== "Team" && key !== "id";
//     });

//     //Aggregate data by Team.
//     let data = d3.nest()
//         .key(function (d) {
//             return d.Team;
//         })
//         .rollup(function (leaves) {
//             let out = {};
//             aggregateAttributes.forEach(function (attribute) {
//                 if (attribute === 'Result') {
//                     let maxIndex = d3.scan(leaves, function (a, b) {
//                         return rank[b[attribute]] - rank[a[attribute]];
//                     });
//                     out[attribute] = {
//                         'label': leaves[maxIndex][attribute],
//                         'ranking': rank[leaves[maxIndex][attribute]]
//                     };
//                 } else {
//                     out[attribute] = d3.sum(leaves, function (d) {
//                         return d[attribute];
//                     });
//                 }
//             });
//             out.TotalGames = leaves.length;
//             let games = leaves.sort(function (a, b) {
//                 return rank[b.Result] - rank[a.Result];
//             });

//             //Iterate through games and create data in the right structure:
//             out.games = games.map(function (game) {

//                 let value = {};
//                 // console.log(aggregateAttributes)
//                 //Create empty values stub;
//                 aggregateAttributes.forEach(function (attribute) {
//                     value[attribute] = '';
//                 });
//                 value.type = 'game'; //keep track that this is a game line.
//                 value[goalsMadeHeader] = game[goalsMadeHeader];
//                 value[goalsConcededHeader] = game[goalsConcededHeader];
//                 value.Opponent = game.Team;
//                 value.Result = {'label': game.Result, 'ranking': rank[game.Result]};

//                 return {'key': game.Opponent, 'value': value};


//             });
//             out.type = 'aggregate'; //keep track that this is an aggregate line.

//             return out;
//         })
//         .entries(matchesCSV);


//         //Create a unique "id" field for each game
//         treeCSV.forEach(function (d, i) {
//             d.id = d.Team + d.Opponent + i;
//         });

//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(treeCSV);

//         //Create Table Object and pass in reference to tree object (for hover linking)
//         let table = new Table(data,tree);
//         table.createTable();
//         table.updateTable();
        

//         });

// });
// // ********************** END HACKER VERSION ***************************
