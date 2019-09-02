var rand = Math.random

var paramList = [ { name: 'subRate', value: 1, label: 'Substitution rate' },
                  { name: 'delRate', value: .1, label: 'Deletion rate' },
                  { name: 'eqmLen', value: 4, label: 'Mean sequence length' },
                  { name: 'delLen', value: 4, label: 'Mean deletion length' },
                  { name: 'minLen', value: 10, label: 'Min sequence length' },
                  { name: 'clockRate', value: 1, label: 'Events/sec' } ]
var params = {}
paramList.forEach ((p) => { params[p.name] = p })

var container, anim
var initLen = 10
var hueTag = 'residue-hue'
window.onload = () => {
  var paramContainer
  container = $('.seq')
  container.append (anim = $('<div class="anim">')
                    .append ($('<div class="row">')
                             .append ($('<div class="sim">')
                                      .append (newResidues (initLen)))),
                    paramContainer = $('<div class="params">'))
  paramList.forEach ((param) => {
    paramContainer.append ($('<div class="param">')
                           .append ($('<div class="label">').text (param.label),
                                    param.input = $('<input type="number">').val (param.value)))
    var updateValue = () => {
      param.value = parseFloat (param.input.val())
      if (param.update)
        param.update()
      evolve()
    };
    param.input.keyup (updateValue)
    param.input.click (updateValue)
  })
  evolve()
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

var newResidue = () => setRandomColor ($('<div class="residue">'))
var newResidues = (n) => new Array(n).fill(0).map (newResidue)
var setRandomColor = (div) => {
  var hue
  if (div.attr(hueTag)) {
    hue = parseFloat (div.attr(hueTag)) + 1 + (rand() - 0.5) * hueRange
    while (hue > 1)
      hue -= 1
  } else
      hue = rand()
  div.attr (hueTag, hue)
  return div.css('background-color','#'+rgbToHex(hsvToRgb(hue,1,1)))
}

var geomLen = (pExtend) => {
  var len = 1
  while (rand() < pExtend)
    ++len
  return len
}

var getResidues = () => $('.sim').children().not('.deleting')

var timer
var evolve = () => {

  var seq = $('.sim'), residues = getResidues()
  var seqLen = residues.length
  var minLen = params.minLen.value || 0
  var subRate = params.subRate.value || 0
  var delRate = params.delRate.value || 0
  var insDelRatio = 1- 1 / (1 + params.eqmLen.value)  // insDelRatio = P(extend eqm sequence by one res)
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
    if (seqLen < minLen) {
      millisecs = 0  // skip boring empty sequence
      totalDelRate = totalSubRate = 0
    }
    if (timer) {
      window.clearTimeout (timer)
      timer = null
    }
    timer = window.setTimeout (() => {
      var r = rand() * totalRate()
      if ((r -= totalInsRate) < 0) {
        // insertion
        var pos = Math.floor (rand() * (seqLen + 1))
        var len = geomLen (insExtend)
        doInsert (pos, len)
      } else if ((r -= totalDelRate) < 0) {
        // deletion
        var pos = Math.floor (rand() * seqLen)
        var len = geomLen (delExtend)
        if (seqLen - len >= minLen)
          doDelete (pos, len)
      } else {
        // substitution
        var pos = Math.floor (rand() * seqLen)
        doSub (pos)
      }
      evolve()
    }, millisecs)
  }
}

var doInsert = (pos, len) => {
  if (pos) {
    var before = getResidues().eq (pos - 1)
    for (var n = 0; n < len; ++n)
      before.after (newResidue())
  } else
    $('.sim').prepend (newResidues(len))
}

var deleteDelay = 500, deleteFrames = 10
var doDelete = (pos, len) => {
  var toDelete = getResidues().slice (pos, pos + len)
  var toDeleteArray = toDelete.toArray()
  toDelete.addClass ('deleting')
  const initWidth = toDeleteArray.map ((td) => $(td).width())
  const initHeight = toDeleteArray.map ((td) => $(td).height())
  let frame = 0, nextDeleteFrame = () => {
    ++frame
    if (frame < deleteFrames) {
      var scale = 1 - frame / deleteFrames
      toDeleteArray.forEach ((td, n) => {
        $(td).width (scale * initWidth[n])
        $(td).height (scale * initHeight[n])
        $(td).css ('margin-top', initHeight[n] * (1 - scale) / 2)
      })
      window.setTimeout (nextDeleteFrame,
                         deleteDelay / deleteFrames)
    } else
      toDelete.remove()
  }
  nextDeleteFrame()
}

var hueRange = .4
var doSub = (pos) => {
  setRandomColor (getResidues().eq (pos))
}
