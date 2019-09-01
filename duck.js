var rand = Math.random

var duck, anim, alignInput
var inputSeq, path
window.onload = () => {
  duck = $('.duck')
  duck.append (anim = $('<div class="anim">')
               .append ($('<div class="machine">')),
               alignInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste Machine Boss alignment JSON here'),
               $('<a href="https://github.com/ihh/right-fishy">').text('Source'))

  alignInput.change (newInput)
  alignInput.val (JSON.stringify (defaultInput))
  newInput()
}

var newInput = () => {
  var data = JSON.parse (alignInput.val())
  if (data && data[0]) {
    inputSeq = data[0].input.sequence
    path = data[0].meta.path
    buildMachine()
  }
}

var inputTape, alignTape, stateLabel, step
var buildMachine = () => {
  anim.empty()
  anim.append ($('<div class="machine">')
               .append (alignTape = $('<div class="align">'),
                        inputTape = $('<div class="inseq">'),
                        $('<div class="inside">')
                        .append (stateLabel = $('<div class="state">'))))
  inputSeq.forEach ((inTok) => inputTape.append (makeInTok (inTok)))
  inputTape.append (makeInTok (''))
  alignTape.prepend (makeColumn ('', ''))
  setState (path.id)
  step = 0
  nextTrans()
}

var timer, silentDelay = 100, loudDelay = 200
var nextTrans = () => {
  if (timer)
    window.clearTimeout (timer)
  if (step < path.trans.length) {
    var trans = path.trans[step++]
    setState (trans.id)
    if (trans.in)
      inputTape.children().first().remove()
    if (trans.in || trans.out)
      alignTape.append (makeColumn (trans.in || "-",
                                    trans.out || "-"))
    timer = window.setTimeout (nextTrans, trans.in || trans.out ? loudDelay : silentDelay)
  }
}
                     
var makeColumn = (inTok, outTok) => $('<div class="col">')
    .append ($('<div class="inrow">').text (inTok),
             $('<div class="outrow">').text (outTok))

var makeInTok = (inTok) => $('<span class="intok">').text (inTok)

var setState = (state) => {
  stateLabel.html (stateToHtml (state))
}

var stateToHtml = (state) => {
  if (Array.isArray(state)) {
    var parent = $('<div class="substate">')
    state.forEach ((child) => parent.append (stateToHtml (child)))
    return parent
  }
  return $('<span class="label">').text (state)
}

var defaultInput = [{"input":{"name":"ARNARNARNARNARNAGTPQNMLIKASVC","sequence":["A","R","N","A","R","N","A","R","N","A","R","N","A","R","N","A","G","T","P","Q","N","M","L","I","K","A","S","V","C"]},"output":{"name":"output","sequence":["A","V","S","N","D","A","F","Y","Q","I","K","F","G","E","V","V","E","Q","S","R","A","I","N","A","N","G","P","H","L","L","I","R","D","R","F"]},"alignment":[["A","A"],["","V"],["R","S"],["N","N"],["","D"],["A","A"],["","F"],["","Y"],["","Q"],["","I"],["R","K"],["","F"],["","G"],["","E"],["","V"],["","V"],["","E"],["N","Q"],["A","S"],["R","R"],["N",""],["A","A"],["R","I"],["N","N"],["A","A"],["R",""],["N","N"],["A",""],["G","G"],["T",""],["P","P"],["Q","H"],["N",""],["M","L"],["L","L"],["I","I"],["K","R"],["A","D"],["S","R"],["V","F"],["C",""]],"meta":{"path":{"id":"protpsw-S","start":0,"trans":[{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"S","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"D","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"F","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"Y","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"Q","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"I","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"K","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"F","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"G","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"E","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"E","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"Q","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"S","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"N","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"I","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"R","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"A","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"G","out":"G","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"T","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"P","out":"P","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"Q","out":"H","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"N","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"M","out":"L","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"L","out":"L","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"I","out":"I","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"K","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"D","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"S","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"V","out":"F","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"C","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-E","to":7}]}}}]
