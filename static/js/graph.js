/**
 * Created by user on 7/5/2016.
 */


queue()
    .defer(d3.json, "/api/austria")
    .defer(d3.json, "/api/fastestlaps")
    .defer(d3.json, "/api/qualy")
    .await(dovoodoo);

function dovoodoo(error, points, laps, pole) {
    makePoints(error, points);
    makeBoxplot(error, laps);
    makePole(error, pole);
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