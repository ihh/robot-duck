var rand = Math.random

var duck, anim, alignInput
var inputSeq, alignPath
var nodes, edges
var alignInputAnchor, alignOutputAnchor, inputAnchor
var alignInputNodes, alignOutputNodes, inputNodes
var 
window.onload = () => {
  duck = $('.duck')
  duck.append (anim = $('<svg class="anim">')
               .append ($('<div class="machine">')),
               alignInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste Machine Boss alignment JSON here'),
               $('<a href="https://github.com/ihh/right-fishy">').text('Source'))

  alignInput.change (() => {
    var data = JSON.parse (alignInput.val())
    if (data && data[0]) {
      inputSeq = data[0].input.sequence
      alignPath = data[0].meta.path
      buildMachine()
    }
  })
}

var buildMachine = () => {

  var svg = d3.select(anim.get(0)),
      width = +svg.attr("width"),
      height = +svg.attr("height")
}
