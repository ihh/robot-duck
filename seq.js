var rand = Math.random

/*
var paramList = [ { name: 'subRate', value: 1, label: 'Substitution rate' },
                  { name: 'delRate', value: .01, label: 'Deletion rate' },
                  { name: 'eqmLen', value: 4, label: 'Mean sequence length' },
                  { name: 'delLen', value: 4, label: 'Mean deletion length' },
                  { name: 'minLen', value: 10, label: 'Min sequence length' },
                  { name: 'maxLen', value: 20, label: 'Max sequence length' },
                  { name: 'hueRange', value: .05, label: 'Hue change/sub' },
                  { name: 'clockRate', value: 1, label: 'Events/site per sec' },
                  { name: 'indent', value: 40, label: 'Pixel indent/generation', update: setIndents },
                ]
*/

var paramList = [ { name: 'subRate', value: 1, label: 'Substitution rate' },
                  { name: 'delRate', value: .01, label: 'Deletion rate' },
                  { name: 'eqmLen', value: 4, label: 'Mean sequence length' },
                  { name: 'delLen', value: 4, label: 'Mean deletion length' },
                  { name: 'minLen', value: 0, label: 'Min sequence length' },
                  { name: 'maxLen', value: 0, label: 'Max sequence length' },
                  { name: 'hueRange', value: .05, label: 'Hue change/sub' },
                  { name: 'clockRate', value: 1, label: 'Events/site per sec' },
                  { name: 'indent', value: 40, label: 'Pixel indent/generation', update: setIndents },
                ]
var params = {}
paramList.forEach ((p) => { params[p.name] = p })

var hueAttr = 'residue-hue', ancestorAttr = 'ancestor-id', simGenAttr = 'sim-generation'
var root, anim, paramContainer
window.onload = () => {
  var container = $('.seq')
  container.append (anim = $('<div class="anim">'))
                    
  anim.append (root = newSim())
  container.append (paramContainer = $('<div class="params">'))
  paramList.forEach ((param) => {
    paramContainer.append ($('<div class="param">')
                           .append ($('<div class="label">').text (param.label),
                                    param.input = $('<input type="number">').val (param.value)))
    var updateValue = () => {
      param.value = parseFloat (param.input.val())
      if (param.update)
        param.update()
      resetStats()
      evolveAll()
    };
    param.input.keyup (updateValue)
    param.input.click (updateValue)
  })
  paramContainer.append ($('<div>')
                         .append ($('<button>').text('Chain').click(()=>fork(false)),
                                  $('<button>').text('Fork').click(()=>fork(true))),
                         $('<div>')
                         .append ($('<a href="https://github.com/ihh/robot-duck">').text('Source')))
  evolveAll()
}

var newSim = (gen) => assignId ($('<div class="sim">').attr(simGenAttr,gen || 0))

var fork = (twice) => {
  activeSims().forEach ((s) => {
    var seq = $(s)
    var gen = parseInt (seq.attr(simGenAttr) || 0)
    if (twice) {
      var newSim1 = newSim (gen + 1)
      newSim1.insertBefore (seq)
      newSim1.append (cloneSeq (seq))
      evolve (newSim1)
    }
    var newSim2 = newSim (gen + 1)
    newSim2.insertAfter (seq)
    newSim2.append (cloneSeq (seq))
    evolve (newSim2)
    setIndents()
    seq.addClass ('halted')
  })
}

var cloneSeq = (seq) => {
  var cloned = getResidues (seq)
      .clone()
      .removeClass ('inserting')
      .css ({ width: '',
              height: '',
              'margin-top': '' })
  cloned.toArray().forEach ((elt) => {
    var e = $(elt)
    e.attr (ancestorAttr, e.attr ('id'))
    assignId (e)
    return e
  })
  return cloned
}

var evolveAll = () => {
  activeSims().forEach ((elt) => evolve ($(elt)))
}

var allSims = () => $('.sim').toArray()
var activeSims = () => $('.sim:not(.halted)').toArray()

function setIndents() {
  $('.sim').toArray().forEach ((s) => {
    $(s).css ('padding-left', params.indent.value * parseInt ($(s).attr (simGenAttr)))
  })
}

// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
  
  return [r * 255, g * 255, b * 255].map (Math.floor);
}
var rgbToHex = (rgb) => rgb.reduce ((hex, n) => hex + (n < 16 ? '0' : '') + n.toString(16), '');

var nextId = 1
var assignId = (e) => e.attr ('id', nextId++)
var newResidue = () => assignId (setRandomColor ($('<div class="residue">')))
var newResidues = (n) => new Array(n).fill(0).map (newResidue)
var setRandomColor = (div, hueRange) => {
  var hue
  if (div.attr(hueAttr)) {
    hue = parseFloat (div.attr(hueAttr)) + 1 + (rand() - 0.5) * hueRange
    while (hue > 1)
      hue -= 1
  } else
      hue = rand()
  div.attr (hueAttr, hue)
  return div.css('background-color','#'+rgbToHex(hsvToRgb(hue,1,1)))
}

var geomLen = (pExtend) => {
  return Math.ceil (Math.log (rand()) / Math.log (1 - pExtend))
}

var getResidues = (seq) => seq.children('.residue').not('.deleting')

var timer = {}
var setTimer = (id, func, delay) => {
  if (timer[id]) {
    window.clearTimeout (timer[id])
    timer[id] = null
  }
  timer[id] = window.setTimeout (func, delay)
}

var totalTime, totalLenTime
var resetStats = () => {
  totalTime = totalLenTime = 0
  console.warn ("Reset length statistics")
}
var updateStats = (seqLen, millisecs) => {
  totalTime += millisecs
  totalLenTime += seqLen * millisecs
  console.warn ("At " + (totalTime / 1000).toPrecision(3) + "s, <length>=" + (totalLenTime / totalTime).toPrecision(3))
}
resetStats()

var evolve = (seq) => {
  if (!seq.hasClass ('halted')) {
    var id = seq.attr('id')
    var residues = getResidues (seq)
    var seqLen = residues.length
    var minLen = params.minLen.value || 0
    var maxLen = params.maxLen.value || 0
    var subRate = params.subRate.value || 0
    var delRate = params.delRate.value || 0
    var insDelRatio = 1 - 1 / (1 + params.eqmLen.value)  // insDelRatio = P(extend eqm sequence by one res)
    var clockRate = params.clockRate.value
    var delExtend = 1 - 1 / params.delLen.value  // At any given site, rate(k-deletion) = delRate * delExtend^{k-1} * (1-delExtend)   for k >= 1
    var insExtend = delExtend * insDelRatio  // rate(k-insertion) = rate(k-deletion) * insDelRatio^k
    var insRate = delRate * insDelRatio * (1 - delExtend) / (1 - insExtend)  // rate(k-insertion) = insRate * insExtend^{k-1} * (1-insExtend)
    var totalInsRate = (seqLen + 1) * insRate
    var totalDelRate = seqLen * delRate
    var totalSubRate = seqLen * subRate
    var totalRate = () => totalInsRate + totalDelRate + totalSubRate
    if (clockRate > 0) {
      var millisecs = -1000 * Math.log(rand()) / (totalRate() * clockRate)
      updateStats (seqLen, millisecs)
      if (seqLen < minLen) {
        millisezcs = 0  // skip boring empty sequence
        totalDelRate = totalSubRate = 0
      } else if (seqLen > maxLen && maxLen > 0) {
        totalInsRate = totalSubRate = 0
      }
      setTimer
      (id,
       () => {
         var r = rand() * totalRate()
         if ((r -= totalInsRate) < 0) {
           // insertion
           var pos = Math.floor (rand() * (seqLen + 1))
           var len = geomLen (insExtend)
           if (maxLen <= 0 || seqLen + len <= maxLen)
             doInsert (seq, pos, len)
         } else if ((r -= totalDelRate) < 0) {
           // deletion
           var pos = Math.floor (rand() * seqLen)
           var len = geomLen (delExtend)
           if (seqLen - len >= Math.max (minLen, 0))
             doDelete (seq, pos, len)
         } else {
           // substitution
           var pos = Math.floor (rand() * seqLen)
           doSub (seq, pos)
         }
         evolve (seq)
       }, millisecs)
    }
  }
}

// indel animations
var resWidth = 20, resHeight = 20
var insertDelay = 500, insertFrames = 10
var deleteDelay = 500, deleteFrames = 10

var doInsert = (seq, pos, len) => {
  var toInsertArray = newResidues (len)
  var toInsert = $(toInsertArray)
  if (pos) {
    var before = getResidues(seq).eq (pos - 1)
    toInsertArray.forEach ((res) => before.after ($(res)))
  } else
    seq.prepend (toInsertArray)
  const initWidth = toInsertArray.map ((ti) => $(ti).width())
  const initHeight = toInsertArray.map ((ti) => $(ti).height())
  let frame = 0, nextInsertFrame = () => {
    ++frame
    if (frame < insertFrames) {
      var scale = (frame + 1) / insertFrames
      var w, h
      toInsertArray.forEach ((ti, n) => {
        var tij = $(ti)
        if (!tij.hasClass ('deleting'))
          tij.css ({ width: w = scale * initWidth[n],
                     height: h = scale * initHeight[n],
                     'margin-top': (resHeight - h) / 2 })
      })
      window.setTimeout (nextInsertFrame,
                         insertDelay / insertFrames)
    } else
      toInsertArray.forEach ((ti) => $(ti).removeClass ('inserting')
                             .css ({ width: '',
                                     height: '',
                                     'margin-top': '' }))
  }
  toInsertArray.forEach ((ti) => $(ti).addClass ('inserting'))
  nextInsertFrame()
}

var doDelete = (seq, pos, len) => {
  var toDelete = getResidues(seq).slice (pos, pos + len)
  var toDeleteArray = toDelete.toArray()
  toDelete.addClass ('deleting')
  const initWidth = toDeleteArray.map ((td) => $(td).width())
  const initHeight = toDeleteArray.map ((td) => $(td).height())
  let frame = 0, nextDeleteFrame = () => {
    ++frame
    if (frame < deleteFrames) {
      var scale = 1 - frame / deleteFrames
      var w, h
      toDeleteArray.forEach ((td, n) =>
                             $(td).css ({ width: w = scale * initWidth[n],
                                          height: h = scale * initHeight[n],
                                          'margin-top': (resHeight - h) / 2 }))
      window.setTimeout (nextDeleteFrame,
                         deleteDelay / deleteFrames)
    } else
      toDelete.remove()
  }
  nextDeleteFrame()
}

var doSub = (seq, pos) => {
  var res = getResidues(seq).eq (pos)
  res.removeClass ('mutating')
  setRandomColor (res, params.hueRange.value)
  window.setTimeout (() => res.addClass('mutating'), 0)
}

var drawAlignments = () => {
  var div = $('<div class="alignment">')
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", anim.width())
  svg.setAttribute("height", anim.height())
  anim.children('.alignment').remove()
  anim.prepend (div)
  div.append (svg)
  allSims().forEach ((sim) => {
    var residues = getResidues ($(sim))
    for (var r = 0; r < residues.length; ++r) {
      var res = $(residues[r])
      var ancId = res.attr (ancestorAttr)
      if (ancId) {
        var anc = $('#' + ancId)
        if (!anc.length)
          console.error (ancId)
        var pos = res.position(), ancPos = anc.position()

        var l1 = ancPos.left, y1 = ancPos.top
        var l2 = pos.left, y2 = pos.top

        if (y1 < y2) {
          y1 += anc.height() + 3
          y2 -= 2
        } else {
          y2 += res.height() + 3
          y1 -= 2
        }

        var r1 = l1 + anc.width()
        var r2 = l2 + res.width()
        var ancSib = anc
        while (r < residues.length) {
          var sib = $(residues[r+1])
          ancSib = ancSib.next()
          if (ancSib.length && ancSib.attr('id') && ancSib.attr('id') === sib.attr(ancestorAttr)) {
            r1 = ancSib.position().left + ancSib.width()
            r2 = sib.position().left + sib.width()
            ++r
          } else
            break
        }
        
        var newPoly = document.createElementNS('http://www.w3.org/2000/svg','polygon')
        newPoly.setAttribute ('points', [[l1,y1], [r1,y1], [r2,y2], [l2,y2]].map((xy)=>xy[0]+','+xy[1]).join(' '))
        svg.appendChild(newPoly)
      }
    }
  })
}
window.setInterval (drawAlignments, 1)
