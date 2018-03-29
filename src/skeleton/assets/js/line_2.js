function initialize(){
    var margin = {top: 20, right: 400, bottom: 100, left: 50},
        margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;
    var bisectDate = d3.bisector((d) => {return d.date;}).left;

    var xScale = d3.time.scale()
        .range([0, width]),

        xScale2 = d3.time.scale()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    // 40 Custom DDV colors
    var color = d3.scale.ordinal().range(["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom"),

        xAxis2 = d3.svg.axis()
        .scale(xScale2)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x((d) => { return xScale(d.date); })
        .y((d) => { return yScale(d.rating); })
        .defined((d) => { return d.rating; });  // Hiding line value defaults of 0 for missing data

    var maxY;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create invisible rect for mouse tracking
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white");

    // slider
    var context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + height*1.03 + ")")
        .attr("class", "context");

    svg.append("defs")
      .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    d3.csv("sb_min_temp.csv", (error, data) => {
      color.domain(d3.keys(data[0]).filter((key) => { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
        return key !== "date";
      }));

      data.forEach((d) => { // Make every date in the csv data a javascript date object format
        d.date = parseDate(d.date);
      });

      var categories = color.domain().map((name) => { // Nest the data into an array of objects with new keys

        return {
          name: name, // "name": the csv headers except date
          values: data.map((d) => { // "values": which has an array of the dates and ratings
            return {
              date: d.date,
              rating: +(d[name]),
              };
          })
        };
      });

      xScale.domain(d3.extent(data,(d) => { return d.date; })); // extent = highest and lowest points, domain is data, range is bouding box

      yScale.domain([0, 100]); //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })

      xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

     // slider functionality and graphics

     var brush = d3.svg.brush()
        .x(xScale2)
        .on("brush", brushed);

      context.append("g")
          .attr("class", "x axis1")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

      var contextArea = d3.svg.area()
        .interpolate("monotone")
        .x((d) => {return xScale2(d.date);})
        .y0(height2)
        .y1(0);

      // plot the rect as the bar at the bottom
      context.append("path")
        .attr("class", "area")
        .attr("d", contextArea(categories[0].values))
        .attr("fill", "#F1F1F2");

      //append the brush for the selection of subsection
      context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2)
          .attr("fill", "#E6E7E8");

      // end slider

      // draw line graph
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Avg Min Temp - Degrees Fahrenheit");

      var issue = svg.selectAll(".issue")
          .data(categories)
        .enter().append("g")
          .attr("class", "issue");



      issue.append("path")
          .attr("class", "line")
          .style("pointer-events", "none") // Stop line interferring with cursor
          .attr("id", (d) => {
            return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
          })
          .attr("d", (d) => {
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't
          })
          .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
          .style("stroke", (d) => {
            return color(d.name);
          });

      // draw legend
      var legendSpace = height * 2.1 / categories.length;


      // first legend column
      issue.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("x", width + (margin.right/10) - 10)
          .attr("y", (d, i) => {
            return (legendSpace)+(i-.3)*(legendSpace) - 8;
            // if (d.name.split(',')[1] != ' US'){return (legendSpace)+(i-.3)*(legendSpace) - 8;}
          })
          .attr("fill", (d) => {
            // if (d.name.split(',')[1] != ' US'){return d.visible ? color(d.name) : "#F1F1F2";}
            return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
          })
          .attr("class", "legend-box")

          .on("click", (d) => {
            if (d.name.split(',')[1] != ' US'){// On click make d.visible
              d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

              maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
              yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
              svg.select(".y.axis")
                .transition()
                .call(yAxis);

              issue.selectAll("path")
                .transition()
                .attr("d", (d) => {
                  return d.visible ? line(d.values) : null;
                  // if (d.name.split(',')[1] != ' US'){}
                })

              issue.selectAll("rect")
                .transition()
                .attr("fill", (d) => {
                  return d.visible ? color(d.name) : "#F1F1F2";
                });
            }
          })

          issue.append("text")
          .attr("x", width + (margin.right/10) + 5)
          .attr("y", (d, i) => {
            return (legendSpace)+(i-.3)*(legendSpace);
            // if (d.name.split(',')[1] != ' US'){}
          })
          .text((d) => {
            if (d.name.split(',')[1] != ' US'){return d.name;}
          });




      // second legend column
      issue.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("x", width + (margin.right/1.75) - 10)
          .attr("y", (d, i) => {
            if (d.name.split(',')[1] === ' US'){return (legendSpace)+(i-77.3)*(legendSpace) - 8;}
          })  // spacing
          .attr("fill", (d) => {
            return d.visible ? color(d.name) : "#F1F1F2";
          })
          .attr("class", "legend-box-2")

          .on("click", (d) => {
            if (d.name.split(',')[1] === ' US'){
              d.visible = !d.visible;

              maxY = findMaxY(categories);
              yScale.domain([0,maxY]);
              svg.select(".y.axis")
                .transition()
                .call(yAxis);

              issue.select("path")
                .transition()
                .attr("d", (d) => {
                  return d.visible ? line(d.values) : null;
                })

              issue.selectAll("rect")
                .transition()
                .attr("fill", (d) => {
                  return d.visible ? color(d.name) : "#F1F1F2";
                });
            }
          })

      issue.append("text")
          .attr("x", width + (margin.right/1.75) + 5)
          .attr("y", (d, i) => {
            if (d.name.split(',')[1] === ' US'){return (legendSpace)+(i-77.3)*(legendSpace);}
          })
          .text((d) => {
            if (d.name.split(',')[1] === ' US'){return d.name}
          });


      //for brusher of the slider bar at the bottom
      function brushed() {

        xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent

        svg.select(".x.axis") // replot xAxis with transition when brush used
              .transition()
              .call(xAxis);

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

        svg.select(".y.axis") // Redraw yAxis
          .transition()
          .call(yAxis);

        issue.select("path") // Redraw lines based on brush xAxis scale and domain
          .transition()
          .attr("d", (d) => {
              return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          });

      };
    });

      function findMaxY(data){
        var maxYValues = data.map((d) => {
          if (d.visible){
            return d3.max(d.values, (value) => {
              return value.rating; })
          }
        });
        return d3.max(maxYValues);
      }

}
