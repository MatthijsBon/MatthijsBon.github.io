var width = d3.select("#map").node().getBoundingClientRect().width / 1.05,
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
  .attr("height", height)

var infotext = "The map on the left shows my biography in a geographical manner. Click on one of the blue municipalities in the Netherlands\
         to show details about my time there. Click again on the municipality to zoom out."

d3.select("#information").append('p')
    .style('font-size', '14px')
    .html(infotext)

window.details = {
    "Deventer": "<h3>Deventer, 1993 - 2011</h3>This is where I grew up. I have lived 18 years with my parents and three sisters. Although \
       I was the only boy with three sisters, we get along very wel. When I was younger I played a lot with Lego, that is probably \
       where my inspiration with architecture and creating things started. And when games like The Sims came out, I was the one building the houses while \
       my sisters were playing the people in the houses.",

    "Delft" : "<h3>Delft, 2011 - present</h3>I started my bachelor at the faculty of Architecture and the built environment in 2011. \
       At first, my ambition was to become an architect and design residential housing and public buildings. In \
       the three years of this bachelor I did six projects, involving multiple disciplines in architecture and \
       designing different kinds of buildings. An overview of some of my designs can be found \
       <a href='projects.html'>here</a>. The third year I did an internship at <a href='http://wam-architecten.nl/' target='_blank'>\
       WAM architecten</a>. This was very useful for some architectural experience, but even more because I found out \
       that I probably was not going to be a very succesful architect and could design anything I want. It was then \
       I decided to switch to a more technical master, something less subjective. The master Geomatics for the built \
       environment combined my knowledge of the built environment in a technical way with (geo)data science and programming. \
       In the first weeks I was already confident this direction was a much better fit for me. \
       <br><br>\
       In my years in Delft I also participated in extracurricular activities. In the third year of my bachelor I was \
       part of the Faculty Student Council and an activities committee of volleyball association <a href='https://www.punch.tudelft.nl/' target='_blank'>\
       D.S.V.V. 'Punch'</a>. After \
       I completed my bachelor I was asked to be part of the board of this volleyball association, where I was responsible \
       managing our association building, contact with tenants, finance as well as supervising other committees and general \
       policy. As of today I am still involved with this association, I play volleyball and am part of the committee that \
       manages and maintains the association's building.",

    "Zutphen" : "<h3>Zutphen, 2005 - 2011</h3>After middel school, I chose a different path than my older sister and chose for VWO in \
       <a href='https://en.wikipedia.org/wiki/Waldorf_education' target='_blank'>Steiner Education</a> at the 'Vrije School Zutphen'. This type of \
       education appealed to me since it was not a education factory as other school, but more focussed on the overall development \
       of students. The school being in Zupthen forced me to bike almost every day from home to school, over 18km. Sometimes this was hard, \
       but most of the times it was a nice wake up. Furthermore, the creative subjects interested me and eventually resulted in chosing \
       for Architecture for the built environment in Delft. I graduated with subjects in Physics, Biology, Chemistry, Math, Economics and German.",

    "Amsterdam" : "<h3>Amsterdam, 2016 - present</h3>Currently I am working on my MSc graduation and the aim is to graduate in June 2017. The \
       subject of my thesis is to assess the quantity of urban mines. The aim is to be able to determine both \
       location and quantity of recyclable cables both underground and in buildings. This thesis research is in cooperation with The Amsterdam Institute \
       for Advanced Metropolitan Solutions (<a href='http://www.ams-amsterdam.com/home/' target='_blank'>AMS</a>)"
}

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
    .style('fill', '#e0e0e0')
    .style('stroke', '#fff')
    .style('stroke-width', '0.5')
    .style('opacity', '0.5')
    .filter(function(d) {
      return d.properties.IMPORTANT === 'Y';
    })
    .style('fill', '#0363b2')
    .style('opacity', '0.9')
    .on('click', clicked)
    .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0] - 10;
            var yPosition = d3.mouse(this)[1] - 10;
            svg.append("text")
                .attr("class", "info")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .text(d.properties.GM_NAAM)
            })
    .on("mouseout", function(d) {
            d3.select("#tooltip").remove();
        });


});

function clicked(d){
    centerAndZoom(d)
    showDetails(d)
}

function centerAndZoom(d) {
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

function showDetails(munic){
    d3.selectAll("#information p").remove()

    var name = munic.properties.GM_NAAM

    d3.select("#information")
        .append('p')
        .style('font-size', '14px')
        .html(details[name]);
}