/**
 * Created by user on 7/5/2016.
 */


queue()
    .defer(d3.json, "/api/austria")
    .defer(d3.json, "/api/fastestlaps")
    .defer(d3.json, "/api/qualy")
    .await(dovoodoo);

function dovoodoo(error, points, laps, pole){
    makePoints(error, points);
    makeBoxplot(error, laps);
    makePole(error, pole);
}


// queue()
//     .defer(d3.json, "/api/austria")
//     .await(makePoints);
//
// queue()
//     .defer(d3.json, "/api/fastestlaps")
//     .await(makeBoxplot);

function makeBoxplot(error, Json) {
    //Clean projectsJson data
    var laptimes = Json;
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    Json.forEach(function(d){
        d.date = parseDate(d.date);
        d.Year = d.date.getFullYear();
        d.Driver = d.forename + " " + d.surname;
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(laptimes),
        raceDimension = ndx.dimension(function(d) {return +d.Year;}),
        lapTimeArrayGroup = raceDimension.group().reduce(
            function(p,v) {
                p.push(v['min_lap_time']);
                return p;
            },
            function(p,v) {
                p.splice(p.indexOf(v['min_lap_time']), 1);
                return p;
            },
            function() {
                return[];
            }
        );

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

    var constructorPoints = constructorDim.group().reduceSum(function (d) {
        return d["Points"];
    });

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

    function parseTime(t) {
        var parts = t.split(":");
        var minutes = Math.floor(parts[0]);
        var seconds = parseFloat(parts[1]);
        var milliseconds =  (60000 * minutes) + (1000 * seconds);
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

//
    // // raceResults.forEach(function (d) {
    // //     d["date_posted"] = date.Format.parse(d["date_posted"]);
    // //     d["date_posted"].setDate(1);
    // //     d["total_donations"] = +d["total_donations"];
    // // });
    //
    //
    // //Define Dimensions
    // var positionDim = ndx.dimension(function (d) {
    //     return d["Pos"];
    // });
    //     var raceNoDim = ndx.dimension(function (d) {
    //     return d["No"];
    // });
    //     var lapsDim = ndx.dimension(function (d) {
    //     return d["Laps"];
    // });
    // var nameDim = ndx.dimension(function (d) {
    //     return d["Driver"];
    // });
    // var gridDim = ndx-dimension(function (d) {
    //     return d["Grid"];
    // });
    // var timeDim = ndx.dimension(function (d) {
    //    return d["Time"];
    // });
    // var pointsDim = ndx.dimension(function (d) {
    //    return d["Points"];
    // });
    //
    // //Calculate metrics
    // var numProjectsByPos = positionDim.group();
    // var numProjectsByDriver = nameDim.group();
    // var numProjectsByConstructor = constructorDim.group();
    // var numProjectsByStatus = statusDim.group();
    // var numProjectsByGrid = gridDim.group();
    // var numProjectsByTime = timeDim.group();
    // var numProjectsByPoints = pointsDim.group();
    //
    // // var totalDonationsByState = stateDim.group().reduceSum(function (d) {
    // //     return d["total_donations"];
    // // });
    // var stateGroup = stateDim.group();
    //
    // var all = ndx.groupAll();
    // // var totalDonations = ndx.groupAll().reduceSum(function(d) {
    // //    return d["total_donations"];
    // // });
    //
    // var max_state = totalDonationsByState.top(1)[0].value;
    //
    // //Define values (to be used in charts)
    // var minPos = positionDim.bottom(1)[0]["Pos"];
    // var maxPos = positionDim.top(1)[0]["Pos"];
    //
    // //Charts
    // var timeChart = dc.barChart("#time-chart");
    // var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    // var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
    // var numberProjectsND = dc.numberDisplay("#number-projects-nd");
    // var totalDonationsND = dc.numberDisplay("#total-donations-nd");
    // var fundingStatusChart = dc.pieChart("#funding-chart");
    //
    // selectField = dc.selectMenu("#menu-select")
    //     .dimension(stateDim)
    //     .group(stateGroup);
    //
    // numberProjectsND
    //     .formatNumber(d3.format("d"))
    //     .valueAccessor(function (d) {
    //         return d;
    //     })
    //     .group(all);
    //
    // totalDonationsND
    //     .formatNumber(d3.format("d"))
    //     .valueAccessor(function (d) {
    //         return d;
    //     })
    //     .group(totalDonations)
    //     .formatNumber(d3.format(".3s"));
    //
    //
    // resourceTypeChart
    //     .width(300)
    //     .height(250)
    //     .dimension(nameDim)
    //     .group(numProjectsByDriver)
    //     .xAxis().ticks(4);
    //
    // povertyLevelChart
    //     .width(300)
    //     .height(250)
    //     .dimension(constructorDim)
    //     .group(numProjectsByConstructor)
    //     .xAxis().ticks(4);
    //
    // fundingStatusChart
    //     .height(220)
    //     .radius(90)
    //     .innerRadius(40)
    //     .transitionDuration(1500)
    //     .dimension(statusDim)
    //     .group(numProjectsByStatus);
    //
    // dc.renderAll();
}