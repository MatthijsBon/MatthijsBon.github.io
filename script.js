var width = window.innerWidth / 2,
  height = window.innerHeight / 1.15,
  centered;

var projection = d3.geoMercator()
  .scale(7500)
  .translate([width / 2, height / 2])
  .center([5.4, 52.2]);

var path = d3.geoPath()
  .projection(projection);

var svg = d3.select('#map').append('svg')
  .attr("width", width)
  .attr("height", height);

// Load the data and initialize the map
d3.json("gem_portfolio.json", function(error, nlgemeenten2009) {
  if (error) return console.error(error);
  window.gemeenten = topojson.feature(nlgemeenten2009, nlgemeenten2009.objects.gem_2015_m);
  window.g = svg.append("g")
  g.selectAll("path")
    .data(gemeenten.features)
    .enter().append("path")
    .attr("d", path)
    .attr("title", function(d) {
      return d.properties.GM_NAAM;
    })

  d3.selectAll("#map path")
    .style('fill', '#edf9ff')
    .style('stroke', '#999')
    .style('stroke-width', '0.2')
    .filter(function(d) {
      return d.properties.IMPORTANT === 'Y';
    })
    .style('fill', '#0363b2')
    .on('click', clicked);


});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
    .classed("active", centered && function(d) {
      return d === centered;
    });

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
}

function showDetails(){
    
}