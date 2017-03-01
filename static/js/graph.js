/**
 * Created by user on 7/5/2016.
 */


queue()
    .defer(d3.json, "/api/austria")
    .defer(d3.json, "/api/fastestlaps")
    .defer(d3.json, "/api/qualy")
    .await(dovoodoo);

function dovoodoo(error, finishers, laps, pole) {
    makePoints(error, finishers);
    makeBoxplot(error, laps);
    makePole(error, pole);
    document.getElementById('spinner').style.display = "none";
    document.getElementById('outer').style.display = "inline-block"
}


function makeBoxplot(error, Json) {
    //Clean Json data
    var laptimes = Json;
    //Parse out a year from the db date format
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    Json.forEach(function (d) {
        d.date = parseDate(d.date);
        d.Year = d.date.getFullYear();
        d.Driver = d.forename + " " + d.surname;
    });

    //Create a Crossfilter instance of the min laptimes posted by each driver in the race
    var ndx = crossfilter(laptimes),
        raceDimension = ndx.dimension(function (d) {
            return +d.Year;
        }),
        lapTimeArrayGroup = raceDimension.group().reduce(
            function (p, v) {
                p.push(v['min_lap_time']);
                return p;
            },
            function (p, v) {
                p.splice(p.indexOf(v['min_lap_time']), 1);
                return p;
            },
            function () {
                return [];
            }
        );
//Create a boxPlot
    var lapTimeChart = dc.boxPlot("#laptimes-boxplot-line");

    var circuitDim = ndx.dimension(function (d) {
        return d["circuit"];
    });
    var circuitGroup = circuitDim.group();
    selectField = dc.selectMenu('#circuit-select')
        .dimension(circuitDim)
        .group(circuitGroup);

    lapTimeChart
        .width(1000)
        .height(800)
        .margins({top: 10, right: 10, bottom: 30, left: 50})
        .dimension(raceDimension)
        .group(lapTimeArrayGroup)
        .transitionDuration(500)
        .elasticX(true)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .tickFormat(d3.format('1f'))
        .boxPadding(1)
        .boxWidth(10);


    dc.renderAll();
}

function makePoints(error, projectsJson) {
    //Clean projectsJson data
    // var aPoints = results.MRData.RaceTable.Races[0].Results;
    // console.log(aPoints);
    //
    // var finishers = [];
    // for (var i = 0; i < 22; i++) {
    //     var finisher = {};
    //
    //     finisher.pos = aPoints[i].position;
    //     finisher.Driver = aPoints[i].Driver.givenName + " " + aPoints[i].Driver.familyName;
    //     finisher.Constructor = aPoints[i].Constructor.name;
    //     if (aPoints[i].FastestLap) {
    //         finisher.Lap = aPoints[i].FastestLap.lap;
    //         finisher.Time = aPoints[i].FastestLap.Time.time;
    //     }
    //     finisher.Grid = aPoints[i].grid;
    //     finisher.Status = aPoints[i].status;
    //     finisher.Points = aPoints[i].points;
    //     finishers.push(finisher);
    // }
    // var pilots = new Array();
    // for (var i = 0; i < 22; i++) {
    //     var pilot = {};
    //     pilot.Driver = finishers[i].Driver;
    //     var newpilot = $.map(pilot, function(value, index){
    //     return [value];
    // });
    //     pilots.push(newpilot);
    // }
    //
    //
    // var gridPosn = new Array();
    // for (var i = 0; i < 22; i++) {
    //     var gridPos = {};
    //     gridPos.grid = parseInt(finishers[i].Grid);
    //     var gposn = $.map(gridPos, function(value, index){
    //         return [value];
    //     });
    //     gridPosn.push(gposn);
    // }
    // var startPosn = new Array();
    // for (var i = 0; i < 22; i++) {
    //     var startPos = {};
    //     startPos.pos = parseInt(finishers[i].pos);
    //     var posn = $.map(gridPos, function(value, index){
    //         return [value];
    //     });
    //     startPosn.push(posn);
    // }
    // console.log(startPosn);
    // console.log(gridPosn);
    // console.log(pilots);
   //Clean projectsJson data
    var raceResults = projectsJson;

     //Create a Crossfilter instance
    var ndx = crossfilter(raceResults);

    var statusDim = ndx.dimension(function (d) {
        return d["Status"];
    });

    var numCarsByStatus = statusDim.group();

    var carStatusChart = dc.pieChart("#car-status-pie");

    carStatusChart
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(statusDim)
        .group(numCarsByStatus);

    var constructorDim = ndx.dimension(function (d) {
        return d["Constructor"];
    });
    // var driverDim = ndx.dimension(function (d) {
    //     return d["Driver"];
    // });

    var constructorPoints = constructorDim.group().reduceSum(function (d) {
        return d["Points"];
    });
    // function team(Driver) {return function(d){return d.value["Driver"]}};

    var constructorPointsChart = dc.lineChart("#constructor-points-line");

    constructorPointsChart
        .width(800)
        .height(220)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(constructorDim)
        .group(constructorPoints)
        .transitionDuration(500)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Constructor")
        .yAxisLabel("Points");
    // constructorPointsChart.stack(constructorPoints, driverDim);


    // var composite = dc.compositeChart("#position_composed");
    // var gridLine = dc.lineChart(composite).group(pilotGrid);
    // var posLine = dc.lineChart(composite).group(pilotPos);
    //
    // var pilotDim = ndx.dimension(function (d) {
    //     return d["Driver"]
    // });
    // var pilotGrid = pilotDim.group().reduceSum(function (d) {
    //     return d["Grid"];
    // });
    // var pilotPos = pilotDim.group().reduceSum(function (d) {
    //     return d["pos"];
    // });
    //
    // console.log(pilotDim);
    // console.log(pilotGrid);
    // console.log(pilotPos);

    // gridLine
    // .width(1200)
    // .height(220)
    // .margins({top: 10, right: 50, bottom: 30, left: 50})
    //     .dimension(pilotDim)
    //     .group(pilotGrid, "Grid Position")
    //     .colors('red')
    //
    //     .dashStyle([2, 2]);
    // .transitionDuration(500)
    // .y(d3.scale.linear().domain([0, 22]))
    // .x(d3.scale.ordinal())
    // .xUnits(dc.units.ordinal);
    // .xAxisLabel("Driver")
    // .yAxisLabel("Grid");

    // posLine
    // .width(1200)
    // .height(220)
    // .margins({top: 10, right: 50, bottom: 30, left: 50})
    //     .dimension(pilotDim)
    //
    //     .colors('blue')
    //     .group(pilotPos, "Finishing Position")
    //     .dashStyle([5, 5]);
    // .transitionDuration(500)
    // .y(d3.scale.linear().domain([0, 22]))
    // .x(d3.scale.ordinal())
    // .xUnits(dc.units.ordinal);
    // .xAxisLabel("Driver")
    // .yAxisLabel("pos");

    // composite
    //
    //
    //     .width(768)
    //     .height(480)
    //     .transitionDuration(500)
    //     .x(d3.scale.ordinal().domain(["Driver"]))
    //     .margins({top: 10, right: 50, bottom: 30, left: 50})
    //     // .elasticY(true)
    //     .yAxisLabel("Position")
    //     .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    //     .renderHorizontalGridLines(true)
    //     // .renderLabel(true)
    //     // .mouseZoomable(true)
    //     .xAxisLabel("Driver")
    //     .xUnits(dc.units.ordinal)
    //     .dimension(pilotDim)
    //     .brushOn(false)
    //     .compose([
    //         gridLine,
    //         posLine
    //     ])
    //     .renderlet(function (chart) { // Rotate the x-axis labels 45 degrees
    //         chart.selectAll("g.x text")
    //             .attr('dx', '-25')
    //             .attr('dy', '7')
    //             .attr('transform', "rotate(-45)");
    //     })
    //     .xAxis().ticks(d3.scale.ordinal).tickFormat(function (d) {
    //     return d["Driver"]
    // });
//     var ctx1 = document.getElementById("chart1");
// var lineOptions = {
//     scales: {
//         yAxes: [{
//             ticks: {
//                 beginAtZero: true
//             }
//         }]
//     },
//     stacked: true
// };
// var multipleLineData = {
//     datasets: [{
//         data: [gridPosn]
//         ,
//         backgroundColor: "rgba(220,220,220,0.5)",
//         borderColor: "rgba(220,0,0,0.5)",
//         label: 'Grid Position',
//         lineTension: 0,
//         fill: true
//     },
//         {
//             data: [startPosn
//             ],
//             backgroundColor: "rgba(255,206,56,0.5)",
//             label: 'Finishing Position',
//             lineTension: 0
//         }],
//     labels: [pilots]
// };
//
// new Chart(ctx1, {
//     type: 'line',
//     data: multipleLineData,
//     options: lineOptions
// });

    dc.renderAll();
}
function makePole(error, Json) {
    //Clean projectsJson data
    var poleTime = Json;
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var total = 0;
    Json.forEach(function (d) {
        d.date = parseDate(d.date);
        d.Year = d.date.getFullYear();
        d.milli = parseTime(d.lap_time);
    });
//Function generates pole position laptime in milliseconds from db time format
    function parseTime(t) {
        var parts = t.split(":");
        var minutes = Math.floor(parts[0]);
        var seconds = parseFloat(parts[1]);
        var milliseconds = (60000 * minutes) + (1000 * seconds);
        return milliseconds;
    }

    //Create a Crossfilter instance
    var ndx = crossfilter(poleTime);


    var nameDim = ndx.dimension(function (d) {
        return d["surname"];

    });

    var numPoleByDriver = nameDim.group();

    var driverPoleChart = dc.pieChart("#driver-pole-pie");


    driverPoleChart
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(nameDim)
        .group(numPoleByDriver);

    var yearDim = ndx.dimension(function (d) {
        return d.Year;
    });

    var q3Time = yearDim.group().reduceSum(function (d) {
        return d.milli;
    });

    var q3LaptimeChart = dc.lineChart("#Q3-pole-line");

    var circuitDim = ndx.dimension(function (d) {
        return d["Circuit"];
    });
    var circuitGroup = circuitDim.group();
    selectField = dc.selectMenu('#menu-select')
        .dimension(circuitDim)
        .group(circuitGroup);

    q3LaptimeChart
        .width(800)
        .height(220)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(yearDim)
        .group(q3Time)
        .transitionDuration(500)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("milliseconds");


    dc.renderAll();


}
