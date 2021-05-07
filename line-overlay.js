//Create SVG element
var svg2 = d3.select("#chart-line .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select(".my-tooltip")
  .style('visibility', 'hidden')

// Add Y scale
var yScale = d3.scaleLinear()
  .domain([16, 0])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis = d3.axisLeft(yScale)

var yGrid = d3.axisLeft(yScale)
  .tickSize(-width + margin.right + margin.left, 0, 0)
  .tickFormat("")


svg2.append("text")
  .attr("transform", `translate(${margin.left/2.5},${height/2}) rotate(-90)`)
  .text('Deaths per 100,000 people')
  .style("text-anchor", "middle")
  .style('font-size', '12pt')


// Render Y grid
svg2.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid)

// Render Y axis
svg2.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis)
  .style('color', 'black')
  .selectAll("text")
  .attr("transform", "translate(-10,0)")
  .style("text-anchor", "middle")

// Render Y grid
svg2.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid)

// Render lines g
var linesG = svg2.append("g")
  .attr('class', 'lines')

// Add X scale
var xScale = d3.scaleLinear()
  .range([margin.left, width - margin.right])
  .domain([1999, 2019])

// Define X axis
var xAxis = d3.axisBottom(xScale)
  .ticks(tickNums)
  .tickFormat(d => d.toString())

//Render X axis
svg2.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis)
  .selectAll(".tick text")
  .raise()

svg2.append('rect')
  .attr('class', 'wave-1 overlay')
  .attr('x', xScale(1999))
  .attr('y', margin.top)
  .attr('height', height - margin.bottom - margin.top)
  .attr('width', xScale(2010) - margin.left)
  .style('fill', '#6BA292')
  .style('opacity', 0.25)

svg2.append('text')
  .text('1')
  .attr('x', xScale(2004.5))
  .attr('y', margin.top + 55)
  .attr('class', 'overlay-label')

svg2.append('rect')
  .attr('class', 'wave-2 overlay')
  .attr('x', xScale(2010))
  .attr('y', margin.top)
  .attr('height', height - margin.bottom - margin.top)
  .attr('width', xScale(2002) - margin.left)
  .style('fill', '#654F6F')
  .style('opacity', 0.25)

svg2.append('text')
  .text('2')
  .attr('x', xScale(2011.5))
  .attr('y', margin.top + 55)
  .attr('class', 'overlay-label')

svg2.append('rect')
  .attr('class', 'wave-3 overlay')
  .attr('x', xScale(2013))
  .attr('y', margin.top)
  .attr('height', height - margin.bottom - margin.top)
  .attr('width', xScale(2005) - margin.left)
  .style('fill', '#194A8A')
  .style('opacity', 0.25)

svg2.append('text')
  .text('3')
  .attr('x', xScale(2016))
  .attr('y', margin.top + 55)
  .attr('class', 'overlay-label')

d3.csv("https://assets.law360news.com/1380000/1380553/data.csv")
  .then(function(csv) {
    var heroin = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale(16 - d.heroinPer100k);
      });

    var any = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale(16 - d.anyPer100k);
      });

    var synthetic = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale(16 - d.syntheticPer100k);
      });

    var prescription = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale(16 - d.prescriptionPer100k);
      });

    svg2.selectAll('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line any")
      .attr("d", (d) => {
        return any(d)
      })
      .style('stroke', '#ed6a5a')

    svg2.selectAll('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line heroin")
      .attr("d", (d) => {
        return heroin(d)
      })
      .style('stroke', '#654F6F');

    svg2.selectAll('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line synthetic")
      .attr("d", (d) => {
        return synthetic(d)
      })
      .style('stroke', '#194A8A');

    svg2.selectAll('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line prescription")
      .attr("d", (d) => {
        return prescription(d)
      })
      .style('stroke', '#6BA292');

    csv.unshift('dummy')

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot any yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.anyPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 3)
      .style('fill', '#ed6a5a')

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot heroin yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.heroinPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 3)
      .style('fill', '#654F6F')

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot synthetic yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.syntheticPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 3)
      .style('fill', '#194A8A')

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot prescription yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.prescriptionPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 3)
      .style('fill', '#6BA292')

    svg2.append("rect")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - margin.right - margin.left)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseover(d)
      })
      .on("mouseout touchend", mouseout);

    // linesG.raise()
    // d3.selectAll('.dot')
    //   .raise()

    d3.selectAll('.hover-overlay')
      .raise()
  })