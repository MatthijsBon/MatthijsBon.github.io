/*
This is the main script file. The basis for the application and all of the 
vairables are defined here
The rest of the D3 functions are defined in functions.js
*/
// Global vairables
var width = window.innerWidth / 2,
    height = window.innerHeight / 1.15;

var projection = d3.geoMercator()
    .scale(7500)
    .translate([width / 2, height / 2])
    .center([5.4, 52.2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select('#map').append('svg')
    .attr("width", width)
    .attr("height", height);

var marginsChart = {
    "left": 65,
    "right": 100,
    "top": 15,
    "bottom": 25
};

var widthChart = window.innerWidth / 2.8;
var heightChart = window.innerHeight / 2.3;

// The chart object, including all margins
var chart = d3.select('#scatterplot')
    .append('svg:svg')
    .attr('width', widthChart + marginsChart.right + marginsChart.left)
    .attr('height', heightChart + marginsChart.top + marginsChart.bottom)
    .attr('class', 'chart')

// The main object where the chart with axis will be drawn
var main = chart.append('g')
    .attr('transform', 'translate(' + marginsChart.left + ',' + marginsChart.top + ')')
    .attr('width', widthChart)
    .attr('height', heightChart)
    .attr('class', 'main')
    .attr('id', 'scatter')

var dots = main.append("svg:g");

// Give the attributes reasonable names
var descriptions = {
    "WATER": "Contains water",
    "STED": "Urbanization",
    "AANT_INW": "Total inhabitants",
    "AANT_MAN": "Number of men",
    "AANT_VROUW": "Number of women",
    "P_00_14_JR": "Percentage 0-14",
    "P_15_24_JR": "Percentage 15-24",
    "P_25_44_JR": "Percentage 25-44",
    "P_45_64_JR": "Percentage 45-64",
    "P_65_EO_JR": "Percentage 65 and older",
    "P_ONGEHUWD": "Percentage unmarried",
    "P_GEHUWD": "Percentage married",
    "P_GESCHEID": "Percentage divorced",
    "P_VERWEDUW": "Percentage widowed",
    "GEBOO_TOT": "Total number of births",
    "P_GEBOO": "Percentage births per 1000 inhabitants",
    "STERFT_TOT": "Total number of deaths",
    "P_STERFT": "Percentage deaths per 1000 inhabitants",
    "BEV_DICHTH": "Population density",
    "AANTAL_HH": "Number of households",
    "GEM_HH_GR": "Average houshold size",
    "A_BEDV": "Number of companies",
    "WONINGEN": "Number of houses",
    "WOZ": "Real estate value",
    "P_1GEZW": "Percentage single family housing",
    "P_MGEZW": "Percentage multiple family housing",
    "AUTO_TOT": "Total number of cars",
    "OPP_TOT": "Total area",
    "P_MAN": "Percentage men",
    "P_VROUW": "Percentage women",
    "P_AUTO": "Number of cars per 1000 inhabitants",
    "P_BEDR": "Number of companies per area",
    "P_WON": "Number of houses per 1000 inhabitants"
}

// Load the data and initialize the map
d3.json("gem2015_v9_topo.json", function(error, nlgemeenten2009) {
    if (error) return console.error(error);
    window.gemeenten = topojson.feature(nlgemeenten2009, nlgemeenten2009.objects.gem2015_v9);
    svg.append("g")
        .attr("class", "land")
        .selectAll("path")
        .data(gemeenten.features)
        .enter().append("path")
        .attr("d", path)
        .attr("title", function(d) {
            return d.properties.GM_NAAM;
        })
        // Call the main theme function
    setMainTheme();

    // And show the scatterplot with the same data
    showScatterPlot(gemeenten.features);

    // Load both the axes
    d3.select("#select-list-x")
        .on('change', function() {
            var newVar = d3.select(this).property('value');
            changeChartX(newVar);
        });
    d3.select("#select-list-y")
        .on('change', function() {
            var newVar = d3.select(this).property('value');
            changeChartY(newVar);
        });

    // Initialize the choropleth
    d3.select("#select-choropleth")
        .on('change', function() {
            if (window.mostavgmuns != null)
                findNearestMunicOff();
            var choropleth = d3.select(this).property('value');
            changeChoropleth(choropleth);
        });

    // Add 'Show mean municipalities' button
    d3.select('#avg_munc').append("input")
        .attr("type", "button")
        .attr("value", "Show mean municipalities")
        .attr("class", "btn btn-default")
        .attr("onclick", "findNearestMunic(this)")
        .attr("id", "avg_munc_button");

    fillOptions()

});
d3.select(self.frameElement).style("height", height + "px");