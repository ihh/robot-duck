var rand = Math.random

var duck, anim, alignInput
var inputSeq, path, machine, currentTheme
window.onload = () => {
  duck = $('.duck')
  duck.append (anim = $('<div class="anim">'),
               alignInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste alignment JSON here'),
               machineInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste machine JSON here'),
               $('<div>')
               .append ($('<button>').text('Start').click (newInput),
                        $('<select>')
                        .append (examples.map ((x) => $('<option>').attr('value',x.name).text(x.name)))
                        .change ((event) => selectExample (event.target.value)),
                        $('<select>')
                        .append (themes.map ((t) => $('<option>').attr('value',t).text(t)))
                        .change ((event) => setTheme (event.target.value))),
               $('<a href="https://github.com/ihh/right-fishy">').text('Source'))

  setTheme (themes[0])
  selectExample ('protein')
}

var setTheme = (t) => {
  anim.removeClass(currentTheme).addClass (currentTheme = t)
}

var newInput = () => {
  var alignData = JSON.parse (alignInput.val())
  var machineData = JSON.parse (machineInput.val())
  if (alignData && alignData[0] && machineData) {
    inputSeq = alignData[0].input.sequence
    path = alignData[0].meta.path
    machine = machineData
    buildMachine()
  }
}

var inputTape, outputTape, alignTape, stateLabel, step
var buildMachine = () => {
  anim.empty()
  anim.append ($('<div class="machine">')
               .append (outputTape = $('<div class="outseq">'),
                        inputTape = $('<div class="inseq">'),
                        $('<div class="inside">')
                        .append (stateLabel = $('<div class="state">'))),
	       alignTape = $('<div class="alignment">'))
  inputSeq.forEach ((inTok) => inputTape.append (makeInTok (inTok)))
  inputTape.append (makeInTok())
  outputTape.prepend (makeOutTok())
  makeMachineSvg (machine)
  setState (path.start)
  step = 0
  nextTrans()
}

var timer, silentDelay = 100, loudDelay = 200
var nextTrans = () => {
  if (timer)
    window.clearTimeout (timer)
  if (step < path.trans.length) {
    var trans = path.trans[step++]
    setState (trans.to)
    if (trans.in)
      inputTape.children().first().remove()
    if (trans.out)
      outputTape.append (makeOutTok (trans.out))
    if (trans.in || trans.out)
      alignTape.append (makeAlignCol (trans.in, trans.out))
    timer = window.setTimeout (nextTrans, trans.in || trans.out ? loudDelay : silentDelay)
  }
}

var makeInTok = (inTok) => $('<span class="intok">').text (inTok || '')
var makeOutTok = (outTok) => $('<span class="outtok">').text (outTok || '')

var makeAlignCol = (inTok, outTok) => $('<div class="column">').append (makeInTok (inTok || '-'),
									makeOutTok (outTok || '-'))

var makeMachineSvg = (machine) => {
  var width = stateLabel.width()
  var height = stateLabel.height()
  
  var nodes = machine.state.map ((state, n) => ({ id: n,
                                                  value: 1 }))
  var links = [], gotLink = {}
  machine.state.forEach ((state, src) => {
    if (state.trans)
      state.trans.forEach ((trans) => {
        var tag = src + ' ' + trans.to
        if (!gotLink[tag]) {
          links.push ({ source: src,
                        target: trans.to,
                        value: 1 })
          gotLink[tag] = true
        }
      })
  })

  const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select (stateLabel.get(0))
        .append("svg")
        .attr("width", width)
        .attr("height", height)

  var radius = 5, activeRadius = 10, lineWidth = 1.5
  
  const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", lineWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", radius);

  node.attr('id', d => 'state' + d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });  

  $('#state0').addClass ('startState')
  $('#state' + (machine.state.length - 1)).addClass ('endState')
  
  var initTicks = 200
  for (var iter = 0; iter < initTicks; ++iter)
    simulation.tick()

  var xmin = Math.floor (Math.min.apply (null, nodes.map ((n) => n.x)))
  var xmax = Math.ceil (Math.max.apply (null, nodes.map ((n) => n.x)))
  var ymin = Math.floor (Math.min.apply (null, nodes.map ((n) => n.y)))
  var ymax = Math.ceil (Math.max.apply (null, nodes.map ((n) => n.y)))
  svg.attr("viewBox", [xmin - activeRadius - 1, ymin - activeRadius - 1, xmax + activeRadius*2 + 2 - xmin, ymax + activeRadius*2 + 2 - ymin]);
}

var setState = (state) => {
  $('circle').removeClass ('active')
  $('#state' + state).addClass ('active')
}

var stateToHtml = (state) => {
  if (Array.isArray(state)) {
    var parent = $('<div class="substate">')
    state.forEach ((child) => parent.append (stateToHtml (child)))
    return parent
  }
  return $('<span class="label">').text (state)
}

var selectExample = (name) => {
  var example = examples.filter ((x) => x.name === name)[0]
  fetch (example.align)
    .then ((resp) => resp.json())
    .then ((align) => {
      fetch (example.machine)
	.then ((resp) => resp.json())
	.then ((machine) => {
	  alignInput.val (JSON.stringify (align))
	  machineInput.val (JSON.stringify (machine))
	  newInput()
	})
    })
}

var themes = ['rust-theme','circus-theme']

var examples = [
  { name: 'protein',
    align: 'data/protein.align.json',
    machine: 'data/protein.machine.json' },

  { name: 'bintern',
    align: 'data/bintern.align.json',
    machine: 'data/bintern.machine.json' },

  { name: 'bsc',
    align: 'data/bsc.align.json',
    machine: 'data/bsc.json' },
		
]
