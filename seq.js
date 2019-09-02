var rand = Math.random

var paramList = [ { name: 'insRate', value: .1, label: 'Insertion rate' },
                  { name: 'delRate', value: .1, label: 'Deletion rate' },
                  { name: 'gapLen', value: 4, label: 'Mean gap length' },
                  { name: 'subRate', value: 1, label: 'Substitution rate' } ]
var params = {}
paramList.forEach ((p) => { params[p.name] = p })

var container, anim
var initLen = 10
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
var setRandomColor = (div) => div.css('background-color','#'+rgbToHex(hsvToRgb(rand(),1,1)))

var gapLen = () => {
  var p = 1 / params.gapLen.value, len = 1
  while (rand() < p)
    ++len
  return len
}

var timer
var evolve = () => {

  var seq = $('.sim'), residues = seq.children()
  var seqLen = residues.length
  var insRate = params.insRate.value
  var delRate = params.delRate.value
  var subRate = params.subRate.value
  var totalInsRate = (seqLen + 1) * insRate
  var totalDelRate = seqLen * delRate
  var totalSubRate = seqLen * subRate
  var totalRate = totalInsRate + totalDelRate + totalSubRate
  var millisecs = -1000 * Math.log(rand()) / totalRate
  if (timer) {
    window.clearTimeout (timer)
    timer = null
  }
  timer = window.setTimeout (() => {
    var r = rand() * totalRate
    if ((r -= totalInsRate) < 0) {
      // insertion
      var pos = Math.floor (rand() * (seqLen + 1))
      var len = gapLen()
      doInsert (pos, len)
    } else if ((r -= totalDelRate) < 0) {
      // deletion
      var pos = Math.floor (rand() * seqLen)
      var len = gapLen()
      doDelete (pos, len)
    } else {
      // substitution
      var pos = Math.floor (rand() * seqLen)
      doSub (pos)
    }
    evolve()
  }, millisecs)
}

var doInsert = (pos, len) => {
  if (pos) {
    var before = $('.sim').children().eq (pos - 1)
    for (var n = 0; n < len; ++n)
      before.after (newResidue())
  } else
    $('.sim').prepend (newResidues(len))
}

var doDelete = (pos, len) => {
  $('.sim').children().slice (pos, pos + len).remove()
}

var doSub = (pos) => {
  setRandomColor ($('.sim').children().eq (pos))
}
