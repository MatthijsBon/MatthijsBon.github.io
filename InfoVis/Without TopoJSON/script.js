         //Width and height
         var w = 1100;
         var h = 900;
         
         //Define map projection
         var projection = d3.geoMercator()
             .translate([0, 0])
             .scale(1);
         
         //Define path generator
         var path = d3.geoPath()
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
                .attr("title", function(d) { return d.properties.GM_NAAM; })
                //.style("fill", "steelblue")
                .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1] - 30;
            svg.append("text")
                .attr("class", "info")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .text(d.properties.GM_NAAM + " (" + (d.properties.AANT_INW) + " inwoners)" + " (" + (d.properties.AANT_MAN) + " man)" + " (" + (d.properties.AANT_VROUW) + " vrouw)");
            d3.select(this)
                .attr("class", "selected");
         })
         .on("mouseout", function(d) {
            d3.select("#tooltip").remove();
            d3.select(this)
            .transition()
            .attr("class", "land")
            .duration(250)
         });
         
         });