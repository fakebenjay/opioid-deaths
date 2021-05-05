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
  .text('Deaths per 100k people')
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

var waves = d3.select('.waves')
  .style('margin', `0 ${margin.right}px 0 ${margin.left}px`)

waves.append('div')
  .attr('class', 'wave wave-1')
  .html('<span><span class="desktop-only">Wave</span> 1</span>')
  .style('width', xScale(2010) - margin.left + 'px')
  .style('height', '50px')
  .style('background-color', '#6BA292')

waves.append('div')
  .attr('class', 'wave wave-2')
  .html('<span><span class="desktop-only">Wave</span> 2</span>')
  .style('width', xScale(2002) - margin.left + 'px')
  .style('height', '50px')
  .style('background-color', '#654F6F')

waves.append('div')
  .attr('class', 'wave wave-3')
  .html('<span><span class="desktop-only">Wave</span> 3</span>')
  .style('width', xScale(2005) - margin.left + 'px')
  .style('height', '50px')
  .style('background-color', '#194A8A')

d3.csv("data.csv")
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
      .attr("class", "dot any") // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.anyPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 5)
      .style('opacity', 0)
      .style('fill', '#ed6a5a')
      .on('mouseover', (d) => {
        return mouseover(tipText(d))
      })
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot heroin") // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.heroinPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 5)
      .style('opacity', 0)
      .style('fill', '#654F6F')
      .on('mouseover', (d) => {
        return mouseover(tipText(d))
      })
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot synthetic") // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.syntheticPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 5)
      .style('opacity', 0)
      .style('fill', '#194A8A')
      .on('mouseover', (d) => {
        return mouseover(tipText(d))
      })
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot prescription") // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale(16 - d.prescriptionPer100k);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 5)
      .style('opacity', 0)
      .style('fill', '#6BA292')
      .on('mouseover', (d) => {
        return mouseover(tipText(d))
      })
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)
  })