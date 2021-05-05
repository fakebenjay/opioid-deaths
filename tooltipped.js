function tipText(values) {
  var opioidClass = event.target.classList[1]

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

function mouseover(tipText) {
  var html = tipText

  d3.select(`.my-tooltip`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT())
    .style('left', leftTT())

  d3.selectAll('.' + event.target.classList[1]).raise()

  d3.select(`.${event.target.classList[1]}.${event.target.classList[2]}`)
    .attr('r', 6)
}

function mousemove() {
  if (window.innerWidth > 767 || document.querySelectorAll('.my-tooltip').length <= 1) {
    d3.select(`.my-tooltip`)
      .style('top', topTT())
      .style('left', leftTT())
  }
}

function mouseout() {
  d3.select(`.${event.target.classList[1]}.${event.target.classList[2]}`)
    .attr('r', 3)
  if (window.innerWidth > 767 || document.querySelectorAll('.my-tooltip').length <= 1) {
    d3.select(`.my-tooltip`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);
  }
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
  var cursorX = 5

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