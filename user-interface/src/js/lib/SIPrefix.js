import {BigNumber} from 'bignumber.js';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parseunit = require('parseunit');

var _parseunit2 = _interopRequireDefault(_parseunit);

var PREFIXES = {
  '24': 'Y',
  '21': 'Z',
  '18': 'E',
  '15': 'P',
  '12': 'T',
  '9': 'G',
  '6': 'M',
  '3': 'k',
  '0': '',
  '-3': 'm',
  '-6': 'µ',
  '-9': 'n',
  '-12': 'p',
  '-15': 'f',
  '-18': 'a',
  '-21': 'z',
  '-24': 'y'
};

// expects a bignumber as input
export function formatSI(num, fixed=4, ) {
  if (num.eq(0)) {
    return {
      sign: '',
      value: BigNumber(0),
      prefix: ''
    };
  }
  var sig = num.abs(); // significand
  var exponent = 0;
  while (sig.gte(1000) && exponent < 24) {
    sig = sig.div(1000);
    exponent += 3;
  }
  while (sig.lt(1) && exponent > -24) {
    sig = sig.times(1000);
    exponent -= 3;
  }

  var signPrefix = num.lt(0) ? '-' : '';
  
  return {
    sign: signPrefix,
    value: sig,
    prefix: PREFIXES[exponent]
  }
}

var MULTIPLIERS = {
  Y: 1e24,
  Z: 1e21,
  E: 1e18,
  P: 1e15,
  T: 1e12,
  G: 1e9,
  M: 1e6,
  k: 1e3,
  '': 1,
  m: 1e-3,
  µ: 1e-6,
  u: 1e-6,
  n: 1e-9,
  p: 1e-12,
  f: 1e-15,
  a: 1e-18,
  z: 1e-21,
  y: 1e-24
};

export function unformatSI(string) {
  if (string == null || string === '') {
    return NaN;
  }

  var _parseUnit = (0, _parseunit2['default'])(string);

  var _parseUnit2 = _slicedToArray(_parseUnit, 2);

  var val = _parseUnit2[0];
  var unit = _parseUnit2[1];

  var multiplier = MULTIPLIERS[unit];
  return val * multiplier;
}