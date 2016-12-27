//Width and height
var w = 500;
var h = 300;

//Define map projection
var projection = d3.geo.mercator()
                       .translate([0, 0])
                       .scale(1);

//Define path generator
var path = d3.geo.path()
                 .projection(projection);

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Load in GeoJSON data
d3.json("gem2015.json", function(json) {

    // Calculate bounding box transforms for entire collection
    var b = path.bounds( json ),
    s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
    t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

    // Update the projection    
    projection
      .scale(s)
      .translate(t);


    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("fill", "steelblue");