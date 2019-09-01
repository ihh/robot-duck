var rand = Math.random

var duck, anim, alignInput
var inputSeq, path, machine
window.onload = () => {
  duck = $('.duck')
  duck.append (anim = $('<div class="anim">'),
               alignInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste alignment JSON here'),
               machineInput = $('<textarea class="input">')
               .attr ('rows', 10)
               .attr ('placeholder', 'Paste machine JSON here'),
               $('<a href="https://github.com/ihh/right-fishy">').text('Source'))

  alignInput.val (JSON.stringify (defaultAlign))
  machineInput.val (JSON.stringify (defaultMachine))

  alignInput.change (newInput)
  machineInput.change (newInput)

  newInput()
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

var inputTape, outputTape, stateLabel, step
var buildMachine = () => {
  anim.empty()
  anim.append ($('<div class="machine">')
               .append (outputTape = $('<div class="outseq">'),
                        inputTape = $('<div class="inseq">'),
                        $('<div class="inside">')
                        .append (stateLabel = $('<div class="state">'))))
  inputSeq.forEach ((inTok) => inputTape.append (makeInTok (inTok)))
  inputTape.append (makeInTok (''))
  outputTape.prepend (makeOutTok (''))
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
    if (trans.out)
      outputTape.append (makeOutTok (trans.out))
    timer = window.setTimeout (nextTrans, trans.in || trans.out ? loudDelay : silentDelay)
  }
}

var makeInTok = (inTok) => $('<span class="intok">').text (inTok)
var makeOutTok = (outTok) => $('<span class="outtok">').text (outTok)

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

var defaultAlign = [{"input":{"name":"ARNARNARNARNARNAGTPQNMLIKASVC","sequence":["A","R","N","A","R","N","A","R","N","A","R","N","A","R","N","A","G","T","P","Q","N","M","L","I","K","A","S","V","C"]},"output":{"name":"output","sequence":["A","V","S","N","D","A","F","Y","Q","I","K","F","G","E","V","V","E","Q","S","R","A","I","N","A","N","G","P","H","L","L","I","R","D","R","F"]},"alignment":[["A","A"],["","V"],["R","S"],["N","N"],["","D"],["A","A"],["","F"],["","Y"],["","Q"],["","I"],["R","K"],["","F"],["","G"],["","E"],["","V"],["","V"],["","E"],["N","Q"],["A","S"],["R","R"],["N",""],["A","A"],["R","I"],["N","N"],["A","A"],["R",""],["N","N"],["A",""],["G","G"],["T",""],["P","P"],["Q","H"],["N",""],["M","L"],["L","L"],["I","I"],["K","R"],["A","D"],["S","R"],["V","F"],["C",""]],"meta":{"path":{"id":"protpsw-S","start":0,"trans":[{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"S","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"D","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"F","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"Y","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"Q","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"I","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"K","to":0},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"F","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"G","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"E","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"V","to":1},{"id":"protpsw-I","to":4},{"id":"protpsw-J","out":"E","to":1},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"Q","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"S","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"N","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"R","out":"I","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"A","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"R","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"N","out":"N","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"A","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"G","out":"G","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"T","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"P","out":"P","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"Q","out":"H","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"N","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"M","out":"L","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"L","out":"L","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"I","out":"I","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"K","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"A","out":"D","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"S","out":"R","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-M","to":5},{"id":"protpsw-S","in":"V","out":"F","to":0},{"id":"protpsw-W","to":2},{"id":"protpsw-D","to":6},{"id":"protpsw-X","in":"C","to":3},{"id":"protpsw-M","to":5},{"id":"protpsw-E","to":7}]}}}]

var defaultMachine = {"state":[{"n":0,"id":"protpsw-S","trans":[{"to":2,"weight":0.7},{"to":4,"weight":0.3}]},{"n":1,"id":"protpsw-J","trans":[{"to":2,"weight":0.5},{"to":4,"weight":0.5}]},{"n":2,"id":"protpsw-W","trans":[{"to":5,"weight":0.7},{"to":6,"weight":0.3}]},{"n":3,"id":"protpsw-X","trans":[{"to":5,"weight":0.5},{"to":6,"weight":0.5}]},{"n":4,"id":"protpsw-I","trans":[{"to":1,"out":"A","weight":0.0788272},{"to":1,"out":"C","weight":0.0137835},{"to":1,"out":"D","weight":0.0511397},{"to":1,"out":"E","weight":0.0637743},{"to":1,"out":"F","weight":0.0443702},{"to":1,"out":"G","weight":0.0752693},{"to":1,"out":"H","weight":0.021447},{"to":1,"out":"I","weight":0.0643926},{"to":1,"out":"K","weight":0.0567807},{"to":1,"out":"L","weight":0.100979},{"to":1,"out":"M","weight":0.0213889},{"to":1,"out":"N","weight":0.041964},{"to":1,"out":"P","weight":0.0465874},{"to":1,"out":"Q","weight":0.0370417},{"to":1,"out":"R","weight":0.0521421},{"to":1,"out":"S","weight":0.0614827},{"to":1,"out":"T","weight":0.0535053},{"to":1,"out":"V","weight":0.068592},{"to":1,"out":"W","weight":0.0132036},{"to":1,"out":"Y","weight":0.0333285}]},{"n":5,"id":"protpsw-M","trans":[{"to":7},{"to":0,"in":"A","out":"A","weight":0.38305},{"to":0,"in":"A","out":"C","weight":0.0146589},{"to":0,"in":"A","out":"D","weight":0.0237223},{"to":0,"in":"A","out":"E","weight":0.0438087},{"to":0,"in":"A","out":"F","weight":0.0146643},{"to":0,"in":"A","out":"G","weight":0.0655422},{"to":0,"in":"A","out":"H","weight":0.00859015},{"to":0,"in":"A","out":"I","weight":0.0307978},{"to":0,"in":"A","out":"K","weight":0.0336824},{"to":0,"in":"A","out":"L","weight":0.0456726},{"to":0,"in":"A","out":"M","weight":0.0133066},{"to":0,"in":"A","out":"N","weight":0.0226886},{"to":0,"in":"A","out":"P","weight":0.031304},{"to":0,"in":"A","out":"Q","weight":0.0267362},{"to":0,"in":"A","out":"R","weight":0.0228226},{"to":0,"in":"A","out":"S","weight":0.0864309},{"to":0,"in":"A","out":"T","weight":0.0521548},{"to":0,"in":"A","out":"V","weight":0.0652596},{"to":0,"in":"A","out":"W","weight":0.00303928},{"to":0,"in":"A","out":"Y","weight":0.0120676},{"to":0,"in":"C","out":"A","weight":0.0838335},{"to":0,"in":"C","out":"C","weight":0.50108},{"to":0,"in":"C","out":"D","weight":0.00886891},{"to":0,"in":"C","out":"E","weight":0.0106522},{"to":0,"in":"C","out":"F","weight":0.0240833},{"to":0,"in":"C","out":"G","weight":0.0233186},{"to":0,"in":"C","out":"H","weight":0.00774927},{"to":0,"in":"C","out":"I","weight":0.0333013},{"to":0,"in":"C","out":"K","weight":0.0124017},{"to":0,"in":"C","out":"L","weight":0.0492847},{"to":0,"in":"C","out":"M","weight":0.0131366},{"to":0,"in":"C","out":"N","weight":0.015739},{"to":0,"in":"C","out":"P","weight":0.00967544},{"to":0,"in":"C","out":"Q","weight":0.00973186},{"to":0,"in":"C","out":"R","weight":0.0164436},{"to":0,"in":"C","out":"S","weight":0.0582434},{"to":0,"in":"C","out":"T","weight":0.0380737},{"to":0,"in":"C","out":"V","weight":0.0605966},{"to":0,"in":"C","out":"W","weight":0.00579522},{"to":0,"in":"C","out":"Y","weight":0.0179907},{"to":0,"in":"D","out":"A","weight":0.0365658},{"to":0,"in":"D","out":"C","weight":0.00239041},{"to":0,"in":"D","out":"D","weight":0.439025},{"to":0,"in":"D","out":"E","weight":0.139713},{"to":0,"in":"D","out":"F","weight":0.00491055},{"to":0,"in":"D","out":"G","weight":0.0411005},{"to":0,"in":"D","out":"H","weight":0.0155236},{"to":0,"in":"D","out":"I","weight":0.00713553},{"to":0,"in":"D","out":"K","weight":0.0388672},{"to":0,"in":"D","out":"L","weight":0.0124018},{"to":0,"in":"D","out":"M","weight":0.00424372},{"to":0,"in":"D","out":"N","weight":0.0775381},{"to":0,"in":"D","out":"P","weight":0.0225887},{"to":0,"in":"D","out":"Q","weight":0.033025},{"to":0,"in":"D","out":"R","weight":0.0203065},{"to":0,"in":"D","out":"S","weight":0.0508187},{"to":0,"in":"D","out":"T","weight":0.0312419},{"to":0,"in":"D","out":"V","weight":0.0118144},{"to":0,"in":"D","out":"W","weight":0.00225091},{"to":0,"in":"D","out":"Y","weight":0.00853881},{"to":0,"in":"E","out":"A","weight":0.0541491},{"to":0,"in":"E","out":"C","weight":0.00230226},{"to":0,"in":"E","out":"D","weight":0.112034},{"to":0,"in":"E","out":"E","weight":0.397967},{"to":0,"in":"E","out":"F","weight":0.00605723},{"to":0,"in":"E","out":"G","weight":0.0297956},{"to":0,"in":"E","out":"H","weight":0.0145412},{"to":0,"in":"E","out":"I","weight":0.0122929},{"to":0,"in":"E","out":"K","weight":0.0703989},{"to":0,"in":"E","out":"L","weight":0.0218674},{"to":0,"in":"E","out":"M","weight":0.00688617},{"to":0,"in":"E","out":"N","weight":0.0358718},{"to":0,"in":"E","out":"P","weight":0.0266139},{"to":0,"in":"E","out":"Q","weight":0.063697},{"to":0,"in":"E","out":"R","weight":0.0386202},{"to":0,"in":"E","out":"S","weight":0.0433656},{"to":0,"in":"E","out":"T","weight":0.0318725},{"to":0,"in":"E","out":"V","weight":0.0202823},{"to":0,"in":"E","out":"W","weight":0.00236727},{"to":0,"in":"E","out":"Y","weight":0.00901764},{"to":0,"in":"F","out":"A","weight":0.0260522},{"to":0,"in":"F","out":"C","weight":0.00748144},{"to":0,"in":"F","out":"D","weight":0.00565974},{"to":0,"in":"F","out":"E","weight":0.00870618},{"to":0,"in":"F","out":"F","weight":0.470137},{"to":0,"in":"F","out":"G","weight":0.0104269},{"to":0,"in":"F","out":"H","weight":0.012456},{"to":0,"in":"F","out":"I","weight":0.0551613},{"to":0,"in":"F","out":"K","weight":0.0108098},{"to":0,"in":"F","out":"L","weight":0.131662},{"to":0,"in":"F","out":"M","weight":0.0233486},{"to":0,"in":"F","out":"N","weight":0.00911947},{"to":0,"in":"F","out":"P","weight":0.00964008},{"to":0,"in":"F","out":"Q","weight":0.00985101},{"to":0,"in":"F","out":"R","weight":0.0102831},{"to":0,"in":"F","out":"S","weight":0.0201227},{"to":0,"in":"F","out":"T","weight":0.0153412},{"to":0,"in":"F","out":"V","weight":0.0434396},{"to":0,"in":"F","out":"W","weight":0.02163},{"to":0,"in":"F","out":"Y","weight":0.0986714},{"to":0,"in":"G","out":"A","weight":0.0686405},{"to":0,"in":"G","out":"C","weight":0.00427018},{"to":0,"in":"G","out":"D","weight":0.0279247},{"to":0,"in":"G","out":"E","weight":0.0252453},{"to":0,"in":"G","out":"F","weight":0.00614654},{"to":0,"in":"G","out":"G","weight":0.646024},{"to":0,"in":"G","out":"H","weight":0.00652826},{"to":0,"in":"G","out":"I","weight":0.00727675},{"to":0,"in":"G","out":"K","weight":0.0207697},{"to":0,"in":"G","out":"L","weight":0.0132593},{"to":0,"in":"G","out":"M","weight":0.00433576},{"to":0,"in":"G","out":"N","weight":0.0332975},{"to":0,"in":"G","out":"P","weight":0.0140042},{"to":0,"in":"G","out":"Q","weight":0.0148997},{"to":0,"in":"G","out":"R","weight":0.0170767},{"to":0,"in":"G","out":"S","weight":0.0503153},{"to":0,"in":"G","out":"T","weight":0.0193438},{"to":0,"in":"G","out":"V","weight":0.0128166},{"to":0,"in":"G","out":"W","weight":0.00283518},{"to":0,"in":"G","out":"Y","weight":0.00499051},{"to":0,"in":"H","out":"A","weight":0.0315726},{"to":0,"in":"H","out":"C","weight":0.00498028},{"to":0,"in":"H","out":"D","weight":0.0370155},{"to":0,"in":"H","out":"E","weight":0.0432395},{"to":0,"in":"H","out":"F","weight":0.0257694},{"to":0,"in":"H","out":"G","weight":0.0229113},{"to":0,"in":"H","out":"H","weight":0.375712},{"to":0,"in":"H","out":"I","weight":0.0147987},{"to":0,"in":"H","out":"K","weight":0.0460581},{"to":0,"in":"H","out":"L","weight":0.0320539},{"to":0,"in":"H","out":"M","weight":0.00863744},{"to":0,"in":"H","out":"N","weight":0.0622884},{"to":0,"in":"H","out":"P","weight":0.0205983},{"to":0,"in":"H","out":"Q","weight":0.0576733},{"to":0,"in":"H","out":"R","weight":0.0575209},{"to":0,"in":"H","out":"S","weight":0.0416062},{"to":0,"in":"H","out":"T","weight":0.0297263},{"to":0,"in":"H","out":"V","weight":0.0178775},{"to":0,"in":"H","out":"W","weight":0.00745206},{"to":0,"in":"H","out":"Y","weight":0.062508},{"to":0,"in":"I","out":"A","weight":0.0377016},{"to":0,"in":"I","out":"C","weight":0.00712828},{"to":0,"in":"I","out":"D","weight":0.00566693},{"to":0,"in":"I","out":"E","weight":0.0121749},{"to":0,"in":"I","out":"F","weight":0.0380093},{"to":0,"in":"I","out":"G","weight":0.00850587},{"to":0,"in":"I","out":"H","weight":0.00492895},{"to":0,"in":"I","out":"I","weight":0.371567},{"to":0,"in":"I","out":"K","weight":0.0143444},{"to":0,"in":"I","out":"L","weight":0.170459},{"to":0,"in":"I","out":"M","weight":0.0331622},{"to":0,"in":"I","out":"N","weight":0.00863179},{"to":0,"in":"I","out":"P","weight":0.00988319},{"to":0,"in":"I","out":"Q","weight":0.0104009},{"to":0,"in":"I","out":"R","weight":0.0110648},{"to":0,"in":"I","out":"S","weight":0.0158244},{"to":0,"in":"I","out":"T","weight":0.0343729},{"to":0,"in":"I","out":"V","weight":0.186813},{"to":0,"in":"I","out":"W","weight":0.00433682},{"to":0,"in":"I","out":"Y","weight":0.0150239},{"to":0,"in":"K","out":"A","weight":0.0467604},{"to":0,"in":"K","out":"C","weight":0.0030105},{"to":0,"in":"K","out":"D","weight":0.0350058},{"to":0,"in":"K","out":"E","weight":0.0790699},{"to":0,"in":"K","out":"F","weight":0.0084471},{"to":0,"in":"K","out":"G","weight":0.0275326},{"to":0,"in":"K","out":"H","weight":0.0173969},{"to":0,"in":"K","out":"I","weight":0.0162674},{"to":0,"in":"K","out":"K","weight":0.340023},{"to":0,"in":"K","out":"L","weight":0.0303215},{"to":0,"in":"K","out":"M","weight":0.0106011},{"to":0,"in":"K","out":"N","weight":0.0454899},{"to":0,"in":"K","out":"P","weight":0.0266976},{"to":0,"in":"K","out":"Q","weight":0.060567},{"to":0,"in":"K","out":"R","weight":0.12738},{"to":0,"in":"K","out":"S","weight":0.0464585},{"to":0,"in":"K","out":"T","weight":0.0418848},{"to":0,"in":"K","out":"V","weight":0.0215942},{"to":0,"in":"K","out":"W","weight":0.00317964},{"to":0,"in":"K","out":"Y","weight":0.0123117},{"to":0,"in":"L","out":"A","weight":0.0356533},{"to":0,"in":"L","out":"C","weight":0.0067273},{"to":0,"in":"L","out":"D","weight":0.00628076},{"to":0,"in":"L","out":"E","weight":0.0138105},{"to":0,"in":"L","out":"F","weight":0.0578525},{"to":0,"in":"L","out":"G","weight":0.00988341},{"to":0,"in":"L","out":"H","weight":0.00680795},{"to":0,"in":"L","out":"I","weight":0.108699},{"to":0,"in":"L","out":"K","weight":0.0170498},{"to":0,"in":"L","out":"L","weight":0.49199},{"to":0,"in":"L","out":"M","weight":0.0445208},{"to":0,"in":"L","out":"N","weight":0.00886672},{"to":0,"in":"L","out":"P","weight":0.0124404},{"to":0,"in":"L","out":"Q","weight":0.0166758},{"to":0,"in":"L","out":"R","weight":0.0162219},{"to":0,"in":"L","out":"S","weight":0.0178091},{"to":0,"in":"L","out":"T","weight":0.022401},{"to":0,"in":"L","out":"V","weight":0.0793946},{"to":0,"in":"L","out":"W","weight":0.00770252},{"to":0,"in":"L","out":"Y","weight":0.0192127},{"to":0,"in":"M","out":"A","weight":0.0490405},{"to":0,"in":"M","out":"C","weight":0.00846557},{"to":0,"in":"M","out":"D","weight":0.0101465},{"to":0,"in":"M","out":"E","weight":0.0205321},{"to":0,"in":"M","out":"F","weight":0.0484355},{"to":0,"in":"M","out":"G","weight":0.0152579},{"to":0,"in":"M","out":"H","weight":0.00866087},{"to":0,"in":"M","out":"I","weight":0.0998368},{"to":0,"in":"M","out":"K","weight":0.0281425},{"to":0,"in":"M","out":"L","weight":0.210186},{"to":0,"in":"M","out":"M","weight":0.251489},{"to":0,"in":"M","out":"N","weight":0.0148501},{"to":0,"in":"M","out":"P","weight":0.0120875},{"to":0,"in":"M","out":"Q","weight":0.0252262},{"to":0,"in":"M","out":"R","weight":0.0234681},{"to":0,"in":"M","out":"S","weight":0.0266873},{"to":0,"in":"M","out":"T","weight":0.0422454},{"to":0,"in":"M","out":"V","weight":0.0759868},{"to":0,"in":"M","out":"W","weight":0.00927512},{"to":0,"in":"M","out":"Y","weight":0.0199801},{"to":0,"in":"N","out":"A","weight":0.0426195},{"to":0,"in":"N","out":"C","weight":0.00516965},{"to":0,"in":"N","out":"D","weight":0.0944927},{"to":0,"in":"N","out":"E","weight":0.0545159},{"to":0,"in":"N","out":"F","weight":0.0096424},{"to":0,"in":"N","out":"G","weight":0.0597246},{"to":0,"in":"N","out":"H","weight":0.0318345},{"to":0,"in":"N","out":"I","weight":0.0132453},{"to":0,"in":"N","out":"K","weight":0.0615517},{"to":0,"in":"N","out":"L","weight":0.0213363},{"to":0,"in":"N","out":"M","weight":0.00756906},{"to":0,"in":"N","out":"N","weight":0.333675},{"to":0,"in":"N","out":"P","weight":0.018343},{"to":0,"in":"N","out":"Q","weight":0.0397685},{"to":0,"in":"N","out":"R","weight":0.0373113},{"to":0,"in":"N","out":"S","weight":0.082247},{"to":0,"in":"N","out":"T","weight":0.0498125},{"to":0,"in":"N","out":"V","weight":0.0172303},{"to":0,"in":"N","out":"W","weight":0.0033257},{"to":0,"in":"N","out":"Y","weight":0.0165856},{"to":0,"in":"P","out":"A","weight":0.0529672},{"to":0,"in":"P","out":"C","weight":0.00286261},{"to":0,"in":"P","out":"D","weight":0.024796},{"to":0,"in":"P","out":"E","weight":0.0364322},{"to":0,"in":"P","out":"F","weight":0.00918129},{"to":0,"in":"P","out":"G","weight":0.0226259},{"to":0,"in":"P","out":"H","weight":0.00948266},{"to":0,"in":"P","out":"I","weight":0.0136604},{"to":0,"in":"P","out":"K","weight":0.0325391},{"to":0,"in":"P","out":"L","weight":0.0269649},{"to":0,"in":"P","out":"M","weight":0.00554955},{"to":0,"in":"P","out":"N","weight":0.0165226},{"to":0,"in":"P","out":"P","weight":0.592778},{"to":0,"in":"P","out":"Q","weight":0.0211869},{"to":0,"in":"P","out":"R","weight":0.022191},{"to":0,"in":"P","out":"S","weight":0.0488045},{"to":0,"in":"P","out":"T","weight":0.0292796},{"to":0,"in":"P","out":"V","weight":0.0220533},{"to":0,"in":"P","out":"W","weight":0.00270557},{"to":0,"in":"P","out":"Y","weight":0.00741719},{"to":0,"in":"Q","out":"A","weight":0.0568966},{"to":0,"in":"Q","out":"C","weight":0.00362131},{"to":0,"in":"Q","out":"D","weight":0.0455944},{"to":0,"in":"Q","out":"E","weight":0.109667},{"to":0,"in":"Q","out":"F","weight":0.0118},{"to":0,"in":"Q","out":"G","weight":0.0302765},{"to":0,"in":"Q","out":"H","weight":0.0333926},{"to":0,"in":"Q","out":"I","weight":0.0180808},{"to":0,"in":"Q","out":"K","weight":0.0928425},{"to":0,"in":"Q","out":"L","weight":0.0454599},{"to":0,"in":"Q","out":"M","weight":0.0145663},{"to":0,"in":"Q","out":"N","weight":0.0450531},{"to":0,"in":"Q","out":"P","weight":0.0266468},{"to":0,"in":"Q","out":"Q","weight":0.253081},{"to":0,"in":"Q","out":"R","weight":0.078147},{"to":0,"in":"Q","out":"S","weight":0.0518621},{"to":0,"in":"Q","out":"T","weight":0.0399295},{"to":0,"in":"Q","out":"V","weight":0.0244719},{"to":0,"in":"Q","out":"W","weight":0.00365423},{"to":0,"in":"Q","out":"Y","weight":0.0149567},{"to":0,"in":"R","out":"A","weight":0.0345027},{"to":0,"in":"R","out":"C","weight":0.0043468},{"to":0,"in":"R","out":"D","weight":0.0199161},{"to":0,"in":"R","out":"E","weight":0.047236},{"to":0,"in":"R","out":"F","weight":0.00875039},{"to":0,"in":"R","out":"G","weight":0.0246509},{"to":0,"in":"R","out":"H","weight":0.0236593},{"to":0,"in":"R","out":"I","weight":0.0136644},{"to":0,"in":"R","out":"K","weight":0.138712},{"to":0,"in":"R","out":"L","weight":0.0314156},{"to":0,"in":"R","out":"M","weight":0.00962674},{"to":0,"in":"R","out":"N","weight":0.0300281},{"to":0,"in":"R","out":"P","weight":0.019827},{"to":0,"in":"R","out":"Q","weight":0.0555156},{"to":0,"in":"R","out":"R","weight":0.428454},{"to":0,"in":"R","out":"S","weight":0.0374982},{"to":0,"in":"R","out":"T","weight":0.0316133},{"to":0,"in":"R","out":"V","weight":0.0189919},{"to":0,"in":"R","out":"W","weight":0.0061288},{"to":0,"in":"R","out":"Y","weight":0.0154625},{"to":0,"in":"S","out":"A","weight":0.110813},{"to":0,"in":"S","out":"C","weight":0.0130573},{"to":0,"in":"S","out":"D","weight":0.0422696},{"to":0,"in":"S","out":"E","weight":0.044982},{"to":0,"in":"S","out":"F","weight":0.0145219},{"to":0,"in":"S","out":"G","weight":0.0615976},{"to":0,"in":"S","out":"H","weight":0.0145135},{"to":0,"in":"S","out":"I","weight":0.0165734},{"to":0,"in":"S","out":"K","weight":0.0429055},{"to":0,"in":"S","out":"L","weight":0.0292496},{"to":0,"in":"S","out":"M","weight":0.00928414},{"to":0,"in":"S","out":"N","weight":0.0561363},{"to":0,"in":"S","out":"P","weight":0.0369807},{"to":0,"in":"S","out":"Q","weight":0.0312455},{"to":0,"in":"S","out":"R","weight":0.0318013},{"to":0,"in":"S","out":"S","weight":0.304203},{"to":0,"in":"S","out":"T","weight":0.0952974},{"to":0,"in":"S","out":"V","weight":0.0270878},{"to":0,"in":"S","out":"W","weight":0.00356307},{"to":0,"in":"S","out":"Y","weight":0.0139172},{"to":0,"in":"T","out":"A","weight":0.0768377},{"to":0,"in":"T","out":"C","weight":0.00980822},{"to":0,"in":"T","out":"D","weight":0.0298607},{"to":0,"in":"T","out":"E","weight":0.0379897},{"to":0,"in":"T","out":"F","weight":0.012722},{"to":0,"in":"T","out":"G","weight":0.027212},{"to":0,"in":"T","out":"H","weight":0.0119155},{"to":0,"in":"T","out":"I","weight":0.0413672},{"to":0,"in":"T","out":"K","weight":0.0444489},{"to":0,"in":"T","out":"L","weight":0.0422768},{"to":0,"in":"T","out":"M","weight":0.0168878},{"to":0,"in":"T","out":"N","weight":0.0390678},{"to":0,"in":"T","out":"P","weight":0.0254939},{"to":0,"in":"T","out":"Q","weight":0.0276432},{"to":0,"in":"T","out":"R","weight":0.0308079},{"to":0,"in":"T","out":"S","weight":0.109506},{"to":0,"in":"T","out":"T","weight":0.337774},{"to":0,"in":"T","out":"V","weight":0.0629213},{"to":0,"in":"T","out":"W","weight":0.00319366},{"to":0,"in":"T","out":"Y","weight":0.0122661},{"to":0,"in":"V","out":"A","weight":0.0749976},{"to":0,"in":"V","out":"C","weight":0.0121769},{"to":0,"in":"V","out":"D","weight":0.00880842},{"to":0,"in":"V","out":"E","weight":0.0188577},{"to":0,"in":"V","out":"F","weight":0.0280999},{"to":0,"in":"V","out":"G","weight":0.0140642},{"to":0,"in":"V","out":"H","weight":0.00558984},{"to":0,"in":"V","out":"I","weight":0.175376},{"to":0,"in":"V","out":"K","weight":0.0178758},{"to":0,"in":"V","out":"L","weight":0.116883},{"to":0,"in":"V","out":"M","weight":0.0236948},{"to":0,"in":"V","out":"N","weight":0.0105413},{"to":0,"in":"V","out":"P","weight":0.0149786},{"to":0,"in":"V","out":"Q","weight":0.0132155},{"to":0,"in":"V","out":"R","weight":0.0144372},{"to":0,"in":"V","out":"S","weight":0.0242803},{"to":0,"in":"V","out":"T","weight":0.0490816},{"to":0,"in":"V","out":"V","weight":0.359017},{"to":0,"in":"V","out":"W","weight":0.00358799},{"to":0,"in":"V","out":"Y","weight":0.0144363},{"to":0,"in":"W","out":"A","weight":0.0181449},{"to":0,"in":"W","out":"C","weight":0.00604977},{"to":0,"in":"W","out":"D","weight":0.00871816},{"to":0,"in":"W","out":"E","weight":0.0114341},{"to":0,"in":"W","out":"F","weight":0.072687},{"to":0,"in":"W","out":"G","weight":0.0161624},{"to":0,"in":"W","out":"H","weight":0.0121046},{"to":0,"in":"W","out":"I","weight":0.0211504},{"to":0,"in":"W","out":"K","weight":0.0136737},{"to":0,"in":"W","out":"L","weight":0.058908},{"to":0,"in":"W","out":"M","weight":0.0150252},{"to":0,"in":"W","out":"N","weight":0.0105698},{"to":0,"in":"W","out":"P","weight":0.0095463},{"to":0,"in":"W","out":"Q","weight":0.0102517},{"to":0,"in":"W","out":"R","weight":0.0242032},{"to":0,"in":"W","out":"S","weight":0.0165915},{"to":0,"in":"W","out":"T","weight":0.0129418},{"to":0,"in":"W","out":"V","weight":0.0186395},{"to":0,"in":"W","out":"W","weight":0.577671},{"to":0,"in":"W","out":"Y","weight":0.0655273},{"to":0,"in":"Y","out":"A","weight":0.0285418},{"to":0,"in":"Y","out":"C","weight":0.00744029},{"to":0,"in":"Y","out":"D","weight":0.013102},{"to":0,"in":"Y","out":"E","weight":0.0172553},{"to":0,"in":"Y","out":"F","weight":0.131361},{"to":0,"in":"Y","out":"G","weight":0.0112706},{"to":0,"in":"Y","out":"H","weight":0.0402241},{"to":0,"in":"Y","out":"I","weight":0.029027},{"to":0,"in":"Y","out":"K","weight":0.020975},{"to":0,"in":"Y","out":"L","weight":0.0582108},{"to":0,"in":"Y","out":"M","weight":0.0128225},{"to":0,"in":"Y","out":"N","weight":0.0208829},{"to":0,"in":"Y","out":"P","weight":0.0103679},{"to":0,"in":"Y","out":"Q","weight":0.0166231},{"to":0,"in":"Y","out":"R","weight":0.0241909},{"to":0,"in":"Y","out":"S","weight":0.0256738},{"to":0,"in":"Y","out":"T","weight":0.0196919},{"to":0,"in":"Y","out":"V","weight":0.0297108},{"to":0,"in":"Y","out":"W","weight":0.0259596},{"to":0,"in":"Y","out":"Y","weight":0.456669}]},{"n":6,"id":"protpsw-D","trans":[{"to":7},{"to":3,"in":"A"},{"to":3,"in":"C"},{"to":3,"in":"D"},{"to":3,"in":"E"},{"to":3,"in":"F"},{"to":3,"in":"G"},{"to":3,"in":"H"},{"to":3,"in":"I"},{"to":3,"in":"K"},{"to":3,"in":"L"},{"to":3,"in":"M"},{"to":3,"in":"N"},{"to":3,"in":"P"},{"to":3,"in":"Q"},{"to":3,"in":"R"},{"to":3,"in":"S"},{"to":3,"in":"T"},{"to":3,"in":"V"},{"to":3,"in":"W"},{"to":3,"in":"Y"}]},{"n":7,"id":"protpsw-E"}]}
