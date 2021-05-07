var bisectDate = d3.bisector(function(d) {
  return xScale(d.year) - margin.left;
}).left

var bisectType = d3.bisector(function(d) {
  return yScale(d.anyPer100k) - (margin.bottom + margin.top);
}).left

function closeType(data, x, y) {
  debugger
}

function tipText(values, opioidClass) {
  if (opioidClass === 'heroin') {
    var opioidType = 'heroin'
    var opioidColor = '#654F6F'
  } else if (opioidClass === 'synthetic') {
    var opioidType = 'synthetic opioid'
    var opioidColor = '#194A8A'
  } else if (opioidClass === 'prescription') {
    var opioidType = 'prescription opioid'
    var opioidColor = '#6BA292'
  } else {
    var opioidType = 'opioid'
    var opioidColor = '#ed6a5a'
  }

  return `<div class="tooltip-container">
  <div><strong>${numeral(values[opioidClass]).format('0,0')}</strong> people died of <strong style='color:${opioidColor};'>${opioidType}</strong> overdoses in the United States in <strong>${values.year}</strong>.</div>
  <br/>
  <div>That's <strong>${values[opioidClass + 'Per100k']}</strong> deaths per 100,000 people.</div>
  </div>`
}

function mouseover(data) {
  var x0 = d3.mouse(event.target)[0],
    y0 = d3.mouse(event.target)[1],
    i = bisectDate(data, x0, 1),
    j = bisectType(data, y0, 1)

  var d0 = data[i - 1],
    d1 = i < data.length ? data[i] : data[i - 1]

  var d = (x0 + margin.left) - xScale(d0.year) > xScale(d1.year) - (x0 + margin.left) ? d1 : d0;

  var linePoints = {
    'synthetic': yScale(d.syntheticPer100k),
    'any': yScale(d.anyPer100k),
    'heroin': yScale(d.heroinPer100k),
    'prescription': yScale(d.prescriptionPer100k)
  }
  var lineKeys = Object.keys(linePoints)
  var closestKey = lineKeys[0]

  for (let i = 1; i < lineKeys.length; i++) {
    closestKey = Math.abs(y0 - linePoints[closestKey]) < Math.abs(y0 - linePoints[lineKeys[i]]) ? closestKey : lineKeys[i]
  }

  var html = tipText(d, closestKey)

  d3.selectAll('.dot')
    .attr('r', 3)

  d3.selectAll(`.${closestKey}`)
    .raise()

  d3.selectAll(`.dot.${closestKey}.yr-${d.year}`)
    .attr('r', 8)

  d3.select(`.my-tooltip`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT())
    .style('left', leftTT())
}

function mousemove() {
  if (window.innerWidth > 767 || document.querySelectorAll('.my-tooltip').length <= 1) {
    d3.select(`.my-tooltip`)
      .style('top', topTT())
      .style('left', leftTT())
  }
}

function mouseout() {
  d3.select(`.my-tooltip`)
    .html("")
    .attr('display', 'none')
    .style("visibility", "hidden")
    .style("left", null)
    .style("top", null);

  d3.selectAll(`.dot`)
    .attr('r', 3)
}

function topTT() {
  var offsetParent = document.querySelector(`.chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`.my-tooltip`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    if (ch + cy >= windowHeight) {
      return cy - (ch / 2) + "px"
    } else {
      return cy - 28 + "px"
    }
  }
}

function leftTT() {
  var offsetParent = document.querySelector(`.chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 10

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`.my-tooltip`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`.chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`.my-tooltip`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`.my-tooltip`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}