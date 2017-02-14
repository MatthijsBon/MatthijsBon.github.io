// Function to initialize the scatterplot
function showScatterPlot(data) {
    window.x_property = getProperties()[0];
    window.y_property = getProperties()[0];

    // set scales for the axes
    var x = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[x_property];
        }), d3.max(data, function(d) {
            return +d.properties[x_property];
        })]) // the range of the values to plot
        .range([0, widthChart - marginsChart.left - marginsChart.right]); // the pixel range of the x-axis

    var y = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[y_property];
        }), d3.max(data, function(d) {
            return +d.properties[y_property];
        })]) // the range of the values to plot
        .range([heightChart - marginsChart.top - marginsChart.bottom, 0]); // the pixel range of the y-axis

    // add the axes SVG component.
    main.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    main.append("g").attr("class", "y axis");

    // x axis label
    main.append("text")
        .attr("fill", "#414241")
        .attr("id", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", widthChart - 150)
        .attr("y", heightChart);

    // y axis label
    main.append("text")
        .attr("fill", "#414241")
        .attr("id", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", -65)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)");

    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

    main.selectAll("g.y.axis").call(yAxis);
    main.selectAll("g.x.axis").call(xAxis);

    dots.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d, i) {
            return x(+d.properties[x_property]);
        })
        .attr("cy", function(d) {
            return y(+d.properties[y_property]);
        })
        .attr("r", 5)
        .attr("class", "circle")
        .attr("id", function(d) {
            return d.id;
        })
        .attr("title", function(d) {
            return d.properties.GM_NAAM;
        })
        .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1] - 30;
            d3.select("body").style("cursor", "pointer");

            if (!d3.select(this).classed("selected")) {
                d3.select(this)
                    .attr("class", "highlight");
            }

            svg.selectAll('path.land')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'highlight');

            d3.select('#highlighted-g')
                .append('div')
                .attr('id', 'gnaam')
                .html("<b>Municipality </b>" + d.properties.GM_NAAM)
                .append('div')
                .attr('id', 'x_property')
                .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                .append('div')
                .attr('id', 'y_property')
                .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                .append('div')
                .attr('id', 'choropleth')
                .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);


        })
        .on("mouseout", function(d) {
            d3.select("body").style("cursor", "default");
            if (d3.select(this).classed("highlight")) {
                d3.select(this)
                    .transition()
                    .attr("class", "circle")
                    .duration(250)
            }
            // If the path is part of the municipalities that are shown close to the mean and it is not selected, change it again to class "avg_sel".
            if (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && !d3.select(this).classed("selected")) {
                d3.select(this)
                    .transition()
                    .attr("class", "circle avg_sel")
                    .duration(250)
            }

            if (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && !d3.select(this).classed("selected")) {
                d3.selectAll('path.highlight')
                    .attr('class', 'avg_sel')
            } else {
                d3.selectAll('path.highlight')
                    .attr('class', 'land');
            }

            d3.select('#highlighted-g #gnaam')
                .remove();
        })
        .on("click", function(d) {
            dots.selectAll('circle')
                .attr('class', 'circle');
            d3.select(this)
                .attr('class', 'selected')
                .moveToFront();

            // Select the paths that are selected and part of the municipalities that are shown close to the mean.
            dots.selectAll('circle')
                .filter(function(d) {
                    return (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1)
                })
                .attr('class', 'circle avg_sel')
                .moveToFront();
            dots.selectAll('circle')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'selected')
                .moveToFront();

            // Select all paths that are not part of the municipalities that are shown close to the mean.
            svg.selectAll('path')
                .filter(function(d) {
                    return !(d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1)
                })
                .attr('class', 'land');

            // Select the paths that are selected and part of the municipalities that are shown close to the mean.
            svg.selectAll('path')
                .filter(function(d) {
                    return (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && d3.select(this).classed("selected"))
                })
                .attr('class', 'avg_sel');

            svg.selectAll('path')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'selected');
            d3.select('#selected-g #gnaam')
                .remove();
            d3.select('#selected-g')
                .append('div')
                .attr('id', 'gnaam')
                .html("<b>Municipality </b>" + d.properties.GM_NAAM)
                .append('div')
                .attr('id', 'x_property')
                .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                .append('div')
                .attr('id', 'y_property')
                .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                .append('div')
                .attr('id', 'choropleth')
                .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);

        });

    // get the results of the least squares regression
    var leastSquaresCoeff = leastSquares(getData(data, x_property), getData(data, y_property));

    var x1 = d3.min(data, function(d) {
        return +d.properties[x_property];
    });
    var y1 = x1 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = d3.max(data, function(d) {
        return +d.properties[x_property];
    });
    var y2 = x2 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var trendData = [
        [x1, y1, x2, y2]
    ];

    // make the trendline
    var trendline = main.selectAll(".trendline")
        .data(trendData);
    trendline.enter()
        .append("line")
        .attr("class", "trendline")
        .attr("x1", function(d) {
            return x(d[0]);
        })
        .attr("y1", function(d) {
            return y(d[1]);
        })
        .attr("x2", function(d) {
            return x(d[2]);
        })
        .attr("y2", function(d) {
            return y(d[3]);
        })
}

// Function to change the scatterplot for new x-axis variable
function changeChartX(newVar) {
    window.x_property = newVar;
    var data = gemeenten.features

    // set scale for the X axis. 
    var x = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[x_property];
        }), d3.max(data, function(d) {
            return +d.properties[x_property];
        })]) // the range of the values to plot
        .range([0, widthChart - marginsChart.left - marginsChart.right]); // the pixel range of the x-axis

    // set scale for the Y axis. 
    var y = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[y_property];
        }), d3.max(data, function(d) {
            return +d.properties[y_property];
        })]) // the range of the values to plot
        .range([heightChart - marginsChart.top - marginsChart.bottom, 0]); // the pixel range of the y-axis

    // update the X axis
    var xAxis = d3.axisBottom().scale(x);
    main.transition().select("g.x.axis").duration(750).call(xAxis);
    d3.select("#xlabel").text(descriptions[newVar])

    // update the circles
    dots.selectAll("circle")
        .transition()
        .duration(750)
        .attr("cx", function(d, i) {
            return x(+d.properties[newVar]);
        })

    // get the results of the least squares regression
    var leastSquaresCoeff = leastSquares(getData(data, x_property), getData(data, y_property));
    var x1 = d3.min(data, function(d) {
        return +d.properties[x_property];
    });
    var y1 = x1 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = d3.max(data, function(d) {
        return +d.properties[x_property];
    });
    var y2 = x2 * leastSquaresCoeff[0] + leastSquaresCoeff[1];

    // take another value if the trend line exceeds the canvas.
    var y_min = d3.min(data, function(d) {
        return +d.properties[y_property];
    });
    if (y1 < y_min) {
        var x1 = getRightMinValue(x_property, y_property, leastSquaresCoeff[0], leastSquaresCoeff[1])
        var y1 = x1 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    }
    if (y2 < y_min) {
        var x2 = getRightMaxValue(x_property, y_property, leastSquaresCoeff[0], leastSquaresCoeff[1])
        var y2 = x2 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    }

    var trendData = [
        [x1, y1, x2, y2]
    ];

    // update the trendline
    var trendline = main.selectAll(".trendline")
        .data(trendData);
    trendline.transition()
        .duration(750)
        .attr("x1", function(d) {
            return x(d[0]);
        })
        .attr("y1", function(d) {
            return y(d[1]);
        })
        .attr("x2", function(d) {
            return x(d[2]);
        })
        .attr("y2", function(d) {
            return y(d[3]);
        })
        .attr("stroke", "red")
        .attr("stroke-width", 1);

    // update the correlation
    d3.select('#correlation')
        .html("<b>Correlation: </b> <br/>" + +leastSquaresCoeff[2].toFixed(3));

}

// Function to change the scatterplot for new y-axis variable
function changeChartY(newVar) {
    window.y_property = newVar;
    var data = gemeenten.features

    // set scale for the X axis. 
    var x = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[x_property];
        }), d3.max(data, function(d) {
            return +d.properties[x_property];
        })]) // the range of the values to plot
        .range([0, widthChart - marginsChart.left - marginsChart.right]); // the pixel range of the x-axis

    // set scale for the Y axis. 
    var y = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.properties[y_property];
        }), d3.max(data, function(d) {
            return +d.properties[y_property];
        })]) // the range of the values to plot
        .range([heightChart - marginsChart.top - marginsChart.bottom, 0]); // the pixel range of the y-axis

    // update the Y axis
    var yAxis = d3.axisLeft().scale(y);
    main.transition().select("g.y.axis").duration(750).call(yAxis);
    d3.select("#ylabel").text(descriptions[newVar])

    // update the circles
    dots.selectAll("circle")
        .transition()
        .duration(750)
        .attr("cy", function(d) {
            return y(+d.properties[newVar]);
        })

    // get the results of the least squares regression
    var leastSquaresCoeff = leastSquares(getData(data, x_property), getData(data, y_property));
    var x1 = d3.min(data, function(d) {
        return +d.properties[x_property];
    });
    var y1 = x1 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = d3.max(data, function(d) {
        return +d.properties[x_property];
    });
    var y2 = x2 * leastSquaresCoeff[0] + leastSquaresCoeff[1];

    // take another value if the trend line exceeds the canvas.
    var y_min = d3.min(data, function(d) {
        return +d.properties[y_property];
    });
    if (y1 < y_min) {
        var x1 = getRightMinValue(x_property, y_property, leastSquaresCoeff[0], leastSquaresCoeff[1])
        var y1 = x1 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    }
    if (y2 < y_min) {
        var x2 = getRightMaxValue(x_property, y_property, leastSquaresCoeff[0], leastSquaresCoeff[1])
        var y2 = x2 * leastSquaresCoeff[0] + leastSquaresCoeff[1];
    }

    var trendData = [
        [x1, y1, x2, y2]
    ];

    // update the trendline
    var trendline = main.selectAll(".trendline")
        .data(trendData);
    trendline.transition()
        .duration(750)
        .attr("x1", function(d) {
            return x(d[0]);
        })
        .attr("y1", function(d) {
            return y(d[1]);
        })
        .attr("x2", function(d) {
            return x(d[2]);
        })
        .attr("y2", function(d) {
            return y(d[3]);
        })
        .attr("stroke", "red")
        .attr("stroke-width", 1);

    // update the correlation
    d3.select('#correlation')
        .html("<b>Correlation: </b> <br/>" + +leastSquaresCoeff[2].toFixed(3));
}

// Function to initialize the choropleth the first time
function createChoropleth(newVar) {
    window.choropleth = newVar;

    var data = gemeenten.features

    // Fill the choropleth map and assign the color range
    var colors = d3.scaleQuantize()
        .domain([d3.min(data, function(d) {
            return +d.properties[newVar];
        }), d3.max(data, function(d) {
            return +d.properties[newVar];
        })])
        .range(["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]);

    // Apply the color range to both the map and the scatterplot
    svg.selectAll('path')
        .attr('fill', function(d) {
            return colors(d.properties[newVar])
        });

    dots.selectAll('circle')
        .attr('fill', function(d) {
            return colors(d.properties[newVar])
        });

    // Get the average
    getAverage(newVar)

    // Create the legend
    var legend = svg.selectAll('g.legendMap')
        .data(colors.range())
        .enter()
        .append('g').attr('class', 'legendMap');

    legend
        .append('rect')
        .attr("x", 50)
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "#414241")
        .style("stroke-width", 1)
        .style("fill", function(d) {
            return d;
        });

    legend
        .append('text')
        .attr("class", "legendlabel")
        .attr("x", 65)
        .attr("y", function(d, i) {
            return i * 20;
        })
        .style("fill", "#414241")
        .attr("dy", "0.8em")
        .text(function(d, i) {
            var maximum = d3.max(data, function(d) {
                return +d.properties[newVar];
            })
            var extent = colors.invertExtent(d);

            if (maximum > 100) {
                var format = d3.format("0.0f");
            } else {
                var format = d3.format("0.2f");
            }
            return format(+extent[0]) + " - " + format(+extent[1]);
        });
}

// Function to change the choropleth when changing the attribute
function changeChoropleth(newVar) {
    window.choropleth = newVar;

    var data = gemeenten.features

    // Change the value for the mean municipalities button
    if (d3.select('#avg_munc_button').node().value == "Hide mean municipalities") {
        findNearestMunicOn()
    }

    // Update the choropleth map
    var colors = d3.scaleQuantize()
        .domain([d3.min(data, function(d) {
            return +d.properties[newVar];
        }), d3.max(data, function(d) {
            return +d.properties[newVar];
        })])
        .range(["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]);

    svg.selectAll('path')
        .attr('fill', function(d) {
            return colors(d.properties[newVar])
        });

    dots.selectAll('circle')
        .attr('fill', function(d) {
            return colors(d.properties[newVar])
        });

    // Change the average
    getAverage(newVar)

    // Update the legend
    var legend = svg.selectAll('g.legendMap')
        .data(colors.range())

    var labels = legend.selectAll("text.legendlabel")

    labels
        .transition()
        .duration(750)
        .text(function(d, i) {
            var maximum = d3.max(data, function(d) {
                return +d.properties[newVar];
            })
            var extent = colors.invertExtent(d);

            if (maximum > 100) {
                var format = d3.format("0.0f");
            } else {
                var format = d3.format("0.2f");
            }
            return format(+extent[0]) + " - " + format(+extent[1]);
        });
}

// Main function to initialize the map
function setMainTheme() {
    // Initialize all actions to the map
    d3.selectAll("#map path")
        .attr("class", "land")
        .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0];
            var yPosition = d3.mouse(this)[1] - 30;
            d3.select("body").style("cursor", "pointer");

            // Highlight the right municipality
            if (!d3.select(this).classed("selected")) {
                d3.select(this)
                    .attr("class", "highlight");
            }

            // Highlight the right circle in the scatterplot and move to the front
            d3.selectAll('#scatter circle.circle')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'highlight')
                .moveToFront();

            // Append the information to the right div wen hovering
            d3.select('#highlighted-g')
                .append('div')
                .attr('id', 'gnaam')
                .html("<b>Municipality </b>" + d.properties.GM_NAAM)
                .append('div')
                .attr('id', 'x_property')
                .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                .append('div')
                .attr('id', 'y_property')
                .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                .append('div')
                .attr('id', 'choropleth')
                .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);
        })
        .on("mouseout", function(d) {
            d3.select("body").style("cursor", "default");
            if (d3.select(this).classed("highlight")) {
                d3.select(this)
                    .transition()
                    .attr("class", "land")
                    .duration(250)
            }

            // If the path is part of the municipalities that are shown close to the mean and it is not selected, change it again to class "avg_sel".
            if (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && !d3.select(this).classed("selected")) {
                d3.select(this)
                    .transition()
                    .attr("class", "avg_sel")
                    .duration(250)
            }
            // Do the same but now for the scatterplot to keep the interaction between the map and the scatterplot accurate
            if (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && !d3.select(this).classed("selected")) {
                d3.selectAll('#scatter circle.highlight')
	                .attr('class', 'circle')
	                .classed('avg_sel', 'true')
                    .moveToFront();
            } else {
                d3.selectAll('#scatter circle.highlight')
                    .attr('class', 'circle')
                    .moveToBack();
            }

            d3.select('#highlighted-g #gnaam')
                .remove();

        })
        .on("click", function(d) {

            // Select all paths that are not part of the municipalities that are shown close to the mean.
            svg.selectAll('path')
                .filter(function(d) {
                    return !(d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1)
                })
                .attr('class', 'land');

            // Select the paths that are selected and part of the municipalities that are shown close to the mean.
            svg.selectAll('path')
                .filter(function(d) {
                    return (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1 && d3.select(this).classed("selected"))
                })
                .attr('class', 'avg_sel');

            // Select the right circle on the scatterplot
            d3.select(this)
                .attr('class', 'selected');
            d3.selectAll('#scatter circle')
                .attr('class', 'circle')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'selected')
                .moveToFront();

            // Select all paths that are not part of the municipalities that are shown close to the mean.
            d3.selectAll('#scatter circle')
                .filter(function(d) {
                    return !(d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1)
                })
                .attr('class', 'circle');

            // Select the paths that are selected and part of the municipalities that are shown close to the mean.
            d3.selectAll('#scatter circle')
                .filter(function(d) {
                    return (d3.select('#avg_munc_button').node().value == "Hide mean municipalities" && mostavgmuns.indexOf(d.properties.GM_NAAM) > -1)
                })
                .attr('class', 'circle')
                .classed('avg_sel', 'true')
                .moveToFront();
            d3.selectAll('#scatter circle')
                .filter(function(f) {
                    return f.properties.GM_NAAM === d.properties.GM_NAAM;
                })
                .attr('class', 'selected')
                .moveToFront();

            // Add the right info to the appropriate div when selecting a municipality
            d3.select('#selected-g #gnaam')
                .remove();
            d3.select('#selected-g')
                .append('div')
                .attr('id', 'gnaam')
                .html("<b>Municipality </b>" + d.properties.GM_NAAM)
                .append('div')
                .attr('id', 'x_property')
                .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                .append('div')
                .attr('id', 'y_property')
                .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                .append('div')
                .attr('id', 'choropleth')
                .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);
        });
}

// Get all properties from the data
function getProperties() {
    path = d3.select("#map path")
    var data = d3.keys(path._groups["0"]["0"].__data__.properties);

    // Remove unnecessary attributes
    data.splice(30, 1);
    data.splice(29, 1);
    data.splice(20, 1);
    data.splice(1, 1);
    data.splice(0, 1);

    return data.sort()
}

// Function to retrieve the data with the appropriate properties
function getData(d, property) {
    x = [];
    for (var i = 0; i < d.length; i++) {
        x.push(d[i].properties[property]);
    }

    return x;
}

// Function to fill in all of the options with the properties of the data
function fillOptions() {
    values = getProperties()
    dropdown = d3.selectAll(".option-list")
    options = dropdown.selectAll("options")
        .data(values)
        .enter()
        .append("option");
    options.text(function(d) {
            return descriptions[d];
        })
        .attr("value", function(d) {
            return d;
        });
    // Initialize the choropleth and the axes with the first attribute from the list
    createChoropleth(values[0]);
    changeChartX(values[0]);
    changeChartY(values[0]);
}


// Returns slope, intercept and r of the line
// Source: http://bl.ocks.org/benvandyke/8459843
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) {
        return prev + cur;
    };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) {
            return Math.pow(d - xBar, 2);
        })
        .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function(d) {
            return Math.pow(d - yBar, 2);
        })
        .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function(d, i) {
            return (d - xBar) * (ySeries[i] - yBar);
        })
        .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    // !! We added this for getting the correlation instead of the r squared
    if (slope > 0) {
        var r = Math.sqrt(rSquare);
    } else {
        var r = -Math.sqrt(rSquare);
    }

    return [slope, intercept, r];
}

// Function for getting the right max value, so that trendline does not go below x-axis
function getRightMaxValue(x_property, y_property, slope, intercept) {
    var data = gemeenten.features

    // Get all the max and min values.
    var x_min = d3.min(data, function(d) {
        return +d.properties[x_property];
    });
    var x_max = d3.max(data, function(d) {
        return +d.properties[x_property];
    });
    var min_y = d3.min(data, function(d) {
        return +d.properties[y_property];
    });
    var x = x_max

    // Return the first x value that results in a value equal to or larger than the minimum y value
    for (i = 0; i <= ((x_max - x_min) * 10); i++) {
        x = x - 0.1
        if ((x * slope + intercept) >= min_y) {
            return x;
        }
    }
}

// Function for getting the right min value, so that trendline does not go below x-axis
function getRightMinValue(x_property, y_property, slope, intercept) {
    var data = gemeenten.features

    // Get all the max and min values.
    var x_min = d3.min(data, function(d) {
        return +d.properties[x_property];
    });
    var x_max = d3.max(data, function(d) {
        return +d.properties[x_property];
    });
    var min_y = d3.min(data, function(d) {
        return +d.properties[y_property];
    });
    var x = x_min

    // Return the first x value that results in a value equal to or larger than the minimum y value
    for (i = 0; i <= ((x_max - x_min) * 10); i++) {
        x = x + 0.1
        if ((x * slope + intercept) >= min_y) {
            return x;
        }
    }
}

// Function for getting the average value of an attribute
function getAverage(property) {
    var data = gemeenten.features

    var avg = d3.mean(data, function(d) {
            return +d.properties[property]
        })
        // update the average
    d3.select('#average')
        .html("<b>Choropleth mean: </b> <br/>" + +avg.toFixed(3));

    return avg
}

// Function that is used by the Show/Hide mean municipalities button
function findNearestMunic(button) {
    if (button.value == "Show mean municipalities") {
        findNearestMunicOn()
        button.value = "Hide mean municipalities"
    } else {
        findNearestMunicOff()
        button.value = "Show mean municipalities"

    };

}

// Function that is used when mean municipalities button is off
function findNearestMunicOff() {

    // Unselect all circles in the scatterplot
    d3.selectAll("#scatter circle")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .classed("avg_sel", false)

    // Unselect all municipalities in the map
    d3.selectAll("#map path")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .classed("avg_sel", false)

}

// Function that is used when mean municipalities button is on
function findNearestMunicOn() {
    var property = choropleth
    var data = gemeenten.features;
    var avg = getAverage(property);

    var arrays = getData(data, property);
    var avg_below = [];
    var avg_above = [];
    var smallest = avg;

    // Get the closest values above and below the mean
    arrays.forEach(function(value) {
        var diff = value - avg;
        if (diff < 0) {
            avg_below.push(value);
            smallest = diff
        }
    });
    smallest = avg;
    arrays.forEach(function(value) {
        var diff = value - avg;
        if (diff < smallest && diff > 0) {
            avg_above.push(value);
            smallest = diff
        }
    });
    avg_a = avg_above[avg_above.length - 1];
    avg_b = d3.max(avg_below);
    window.mostavgmuns = [];

    // If the value above the mean is closer to the mean than the value below, use it to select municipalities
    if ((avg_a - avg) < (avg - avg_b)) {
        data.forEach(function(obj) {
            if (obj.properties[property] === avg_a) {
                mostavgmuns.push(obj.properties.GM_NAAM)
            };
        });
        // If the value below the mean is closer to the mean than the value above, use it to select municipalities
    } else if ((avg_a - avg) > (avg - avg_b)) {
        data.forEach(function(obj) {
            if (obj.properties[property] === avg_b) {
                mostavgmuns.push(obj.properties.GM_NAAM)
            };
        });
        // Use both the value below and above the mean for selecting municipalities
    } else {
        data.forEach(function(obj) {
            if (obj.properties[property] === avg_a || obj.properties[property] === avg_b) {
                mostavgmuns.push(obj.properties.GM_NAAM)
            };
        });
    }

    // Give the avg_sel class to all municipalities closest to the mean
    d3.selectAll("#map path")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .classed("avg_sel", true)

    // Keep the selected municipality selected
    d3.selectAll("#map path.selected")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .attr("class", 'selected')

    // Give the avg_sel class to all cicles of municipalities closest to the mean
    d3.selectAll("#scatter circle")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .classed("avg_sel", true)
        .moveToFront()

    // Keep the selected circle selected
    d3.selectAll("#scatter circle.selected")
        .filter(function(d) {
            return mostavgmuns.includes(d.properties.GM_NAAM)
        })
        .attr("class", 'selected')
        .moveToFront()

}

// Function to show and hide the provinces.
// This function is not used in the web application, because highlighting 
// and selecting resulted in problems with the color scheme which we were
// not able to solve in time. Additionally, doing this did not really add 
// much to the application.
function toggleProvincies(button) {
    if (button.value == "Show provincies") {
        // Define a class for everyone of the provinces (numbered 20 - 31 in the dataset)
        var mapping = {
                "20": "q0-12",
                "21": "q1-12",
                "22": "q2-12",
                "23": "q3-12",
                "24": "q4-12",
                "25": "q5-12",
                "26": "q6-12",
                "27": "q7-12",
                "28": "q8-12",
                "29": "q9-12",
                "30": "q10-12",
                "31": "q11-12"
            }
            // Select the choroplet paths and assing a class based on the province code and the mapping
        d3.selectAll("#map path")
            .attr("class", function(d) {
                cls = d.properties.PV_CODE
                return mapping[cls]
            })
            // Set the correct selection and highlight classes
            .on("mouseover", function(d) {
                var xPosition = d3.mouse(this)[0];
                var yPosition = d3.mouse(this)[1] - 30;

                if (!d3.select(this).classed("prov_selected")) {
                    d3.select(this)
                        .attr("class", "prov_highlight");
                }
                // Highlight the right circle in the scatterplot and move to the front
                d3.selectAll('#scatter circle.circle')
                    .filter(function(f) {
                        return f.properties.GM_NAAM === d.properties.GM_NAAM;
                    })
                    .attr('class', 'highlight')
                    .moveToFront();

                // Add the right info to the appropriate div when selecting a municipality
                d3.select('#highlighted-g')
                    .append('div')
                    .attr('id', 'gnaam')
                    .html(d.properties.GM_NAAM)
                    .append('div')
                    .attr('id', 'x_property')
                    .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                    .append('div')
                    .attr('id', 'y_property')
                    .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                    .append('div')
                    .attr('id', 'choropleth')
                    .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);

            })
            // Set the class back to the correct province class on mouse out
            .on("mouseout", function(d) {
                d3.select("#tooltip").remove();
                if (d3.select(this).classed("prov_highlight")) {
                    d3.select(this)
                        .transition()
                        .attr("class", function(d) {
                            cls = d.properties.PV_CODE
                            return mapping[cls]
                        })
                        .duration(250)
                }
                d3.selectAll('#scatter circle.highlight')
                    .attr('class', 'circle')

                d3.select('#highlighted-g #gnaam')
                    .remove();

            })
            // Select the corresponding scatterplot circle when clicking in choropleth
            .on("click", function(d) {
                svg.selectAll('path')
                    .attr('class', function(d) {
                        cls = d.properties.PV_CODE
                        return mapping[cls]
                    });
                d3.select(this)
                    .attr('class', 'prov_selected');
                d3.selectAll('#scatter circle')
                    .attr('class', 'circle')
                    .filter(function(f) {
                        return f.properties.GM_NAAM === d.properties.GM_NAAM;
                    })
                    .attr('class', 'selected')
                    .moveToFront();

                d3.select('#selected-g #gnaam')
                    .remove();

                // Add the right info to the appropriate div when selecting a municipality    
                d3.select('#selected-g')
                    .append('div')
                    .attr('id', 'gnaam')
                    .html(d.properties.GM_NAAM)
                    .append('div')
                    .attr('id', 'x_property')
                    .html("<b>X-axis </b>" + descriptions[window.x_property] + ": " + d.properties[window.x_property])
                    .append('div')
                    .attr('id', 'y_property')
                    .html("<b>Y-axis </b>" + descriptions[window.y_property] + ": " + d.properties[window.y_property])
                    .append('div')
                    .attr('id', 'choropleth')
                    .html("<b>Choropleth </b>" + descriptions[window.choropleth] + ": " + d.properties[window.choropleth]);
            });
        // Change the value of the button for correct toggle behavior
        button.value = "Hide provincies"
    } else {
        // Functions to toggle off the provinces
        setMainTheme()
        createChoropleth(window.choropleth);
        button.value = "Show provincies"
    };

}