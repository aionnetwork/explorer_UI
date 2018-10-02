/* eslint-disable */
import { NCEntityInfo } from 'lib/NCEnums';
import { hashHistory } from 'react-router';
import moment from 'moment';
import {formatSI} from 'lib/SIPrefix';
import {BigNumber} from 'bignumber.js';

// Returns a random number between min (inclusive) and max (exclusive)
export function nc_getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/* Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution! */
export function nc_getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function nc_decimalPoint(num, scale=2) {
  if (num == null) return null;
  return (new BigNumber(String(num))).dp(scale).toString();
}

export function nc_roundNumber(num, scale=2) {
  if (num == null)
    return null;

  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);  
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

export function nc_d3RangeToDomainMap(scale, range) {
  return [scale.invert(range[0]), scale.invert(range[1])];
}

// given an object an a dot delimited path str, returns a value
export function nc_objLookupByPath(obj, path) {
  if (obj == null)
    return undefined;

  let paths = path.split('.');
  let current = JSON.parse(JSON.stringify(obj));

  for (let i = 0; i < paths.length; ++i) 
  {
    if (current[paths[i]] == undefined) {
      return undefined;
    } 
    else {
      current = current[paths[i]];
    }
  }

  return current;
};

export function nc_defaultSortAsc(a, b) {
  if (a < b) 
    return -1;

  if (a > b)
    return 1;
  
  return 0;
}

export function nc_defaultSortDesc(a, b) {
  if (a > b) 
    return -1;

  if (a < b)
    return 1;
  
  return 0;
}

export function nc_defaultFilter(a, filter) {
  return ((a).toString().toLowerCase().indexOf((filter).toLowerCase()) !== -1);
}

// assumed in ms
export function nc_parseLatency (latency) {
  if (latency == null)
    return "Disconnected"

  return (nc_roundNumber(latency, 2) + " ms");
}

export let nc_RegexpEscape;
(function () {
  // Referring to the table here:
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
  // these characters should be escaped
  // \ ^ $ * + ? . ( ) | { } [ ]
  // These characters only have special meaning inside of brackets
  // they do not need to be escaped, but they MAY be escaped
  // without any adverse effects (to the best of my knowledge and casual testing)
  // : ! , = 
  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

  var specials = [
    // order matters for these
      "-"
    , "["
    , "]"
    // order doesn't matter for any of these
    , "/"
    , "{"
    , "}"
    , "("
    , ")"
    , "*"
    , "+"
    , "?"
    , "."
    , "\\"
    , "^"
    , "$"
    , "|"
  ],

  // I choose to escape every character with '\'
  // even though only some strictly require it when inside of []
  regex = RegExp('[' + specials.join('\\') + ']', 'g');

  nc_RegexpEscape = function (str) {
    return str.replace(regex, "\\$&");
  };
}());

export function nc_numFormatter_with1Floor(num, digits=2) {
  if (num == null)
    return null;

  const bn = (new BigNumber(String(num)));

  if (bn.lt(1))
    return "< 1";

  const formatted = formatSI(bn);
  return formatted.value.dp(digits) + "" + formatted.prefix;  
}

export function nc_numFormatter(num, digits=2) {
  if (num == null)
    return null;

  const bn = (new BigNumber(String(num)));
  const formatted = formatSI(bn);
  
  return nc_numPrettify(formatted.value.dp(digits)) + "" + formatted.prefix;
}

export function nc_numFormatterBytes(num, digits) {
  if (num == null || digits == null)
    return null;

  var si = [
    { value: 1E18, symbol: "EB" },
    { value: 1E15, symbol: "PB" },
    { value: 1E12, symbol: "TB" },
    { value: 1E9,  symbol: "GB" },
    { value: 1E6,  symbol: "MB" },
    { value: 1E3,  symbol: "kB" },
    { value: 1E0,  symbol: "Bytes" }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + " " + si[i].symbol;
    }
  }

  return num.toFixed(digits).replace(rx, "$1");
}

export function nc_numFormatterACSensitive(num, dp=null, isHex=false) {
  if (num == null)
    return null;

  let bn = null;
  try {
    if (isHex) {
      bn = (new BigNumber(String(num), 16));  
    } 
    else {
      bn = (new BigNumber(String(num), 10));
    }  
  } catch (e) {
    console.log(e);
    return null;
  }
  
  if (!bn || !BigNumber.isBigNumber(bn) || !bn.isFinite() || bn.isNegative())
    return null;

  return bn.shiftedBy(-18).toFormat(dp);
}

export function nc_numFormatterAionCoin(num, fixed=4, isHex=false) {
  if (num == null)
    return null;

  let bn = null;
  try {
    if (isHex) {
      bn = (new BigNumber(String(num), 16));  
    } 
    else {
      bn = (new BigNumber(String(num), 10));
    }  
  } catch (e) {
    console.log(e);
    return null;
  }
  
  if (!bn || !BigNumber.isBigNumber(bn) || !bn.isFinite() || bn.isNegative())
    return null;
  
  const formatted = formatSI(bn.shiftedBy(-18));
  
  let result;

  if (fixed == null)
    result = formatted.value + "" + formatted.prefix;
  else
    result = formatted.value.toFixed(fixed) + "" + formatted.prefix;

  return result;
}

// format to Amp
export function nc_numFormatterAmp(num, fixed=4, isHex=false) {
  if (num == null)
    return null;

  let bn = null;
  try {
    if (isHex) {
      bn = (new BigNumber(String(num), 16));  
    } 
    else {
      bn = (new BigNumber(String(num), 10));
    }  
  } catch (e) {
    console.log(e);
    return null;
  }
  
  if (!bn || !BigNumber.isBigNumber(bn) || !bn.isFinite() || bn.isNegative())
    return null;
  
  const formatted = formatSI(bn.shiftedBy(-9));
  
  let result;

  if (fixed == null)
    result = nc_numPrettify(formatted.value) + " " + formatted.prefix + "Amp";
  else
    result = nc_numPrettify(formatted.value.toFixed(fixed)) + " " + formatted.prefix + "Amp";

  return result;
}

export function nc_trim (x) {
  //return String(x).replace(/^\s+|\s+$/gm,'');
  return String(x).trim();
}

export function nc_isStrEmpty(x) {
  return (!x || String(x).trim().length == 0);
}

export function nc_cleanDisplayString (x, undefinedStr) {
  if (nc_isStrEmpty(x))
    return undefinedStr;

  return x;
}

// Search Types -----------------------------------------------------

const CHAR_LENTH_HASH = 64;
const reIsHash = new RegExp('^[a-f0-9]{'+CHAR_LENTH_HASH+'}$', 'i');

export function nc_isNumber(input) {
  //return !isNaN(input);
  return !isNaN(parseFloat(input)) && isFinite(input);
}

export function nc_isPositiveInteger(input) {
  return /^[0-9]+$/.test(input);
}

export function nc_isValidHash(input) {
  let x = nc_sanitizeHex(input);
  return reIsHash.test(x);
}

export function nc_isValidEntity(input) {
  let x = nc_sanitizeHex(input);
  return reIsHash.test(x);
}

export function nc_sanitizeHex(input) {
  let x = nc_trim(input);

  if (
    x.indexOf("0x") == 0 || 
    x.indexOf("0X") == 0 || 
    x.indexOf("oX") == 0 || 
    x.indexOf("ox") == 0 ||
    x.indexOf("OX") == 0 || 
    x.indexOf("Ox") == 0) {
    return x.slice(2); // remove the first two characters 
  }

  return x;
}

export function nc_hexPrefix(input) {
  let x = nc_trim(input);
  
  if (x.length == 0 || x.indexOf("0x") == 0)
    return x
  else
    return ("0x" + x)
}

/*
  expected data-structure: 
  {
    content: [{}, {}, ..] ,
    page: {
      "size" : 5,
      "totalElements" : 1000,
      "totalPages" : 2000,
      "number" : 0 
    } 
  }
*/

export function nc_isObjectValid(obj) {
  const isValid = (
    obj && 
    obj.content != null && 
    Array.isArray(obj.content)
  );
  return isValid;
}

export function nc_isObjectEmpty(obj, isValid=null) {
  if (isValid == null) {
    if (!nc_isObjectValid(obj))
      return true;
  }
   
  else if (isValid == false)
    return true;

  if (obj.content.length > 0 && obj.content[0] && obj.content[0].rel !== null)
    return false;

  return true;
}

export function nc_isListValid(list) {
  const isValid = (
    list && 
    list.content != null && 
    //list.page != null &&
    Array.isArray(list.content)
  );
  return isValid;
}

export function nc_isListEmpty(list, isValid=null) {
  if (isValid == null && !nc_isListValid(list))
    return true;
  
  else if (!isValid)
    return true;

  if (list.content.length > 0 && list.content[0] && list.content[0].rel === undefined)
    return false;

  return true;
}

// -----------------------------------------------------------------------
// Misc
// -----------------------------------------------------------------------

export function nc_RenderLastUpdateTimeTag(moment) {
  let lastUpdated = moment;

  if (lastUpdated > 0) {
    return (
      <div className="pt-tag pt-minimal pt-intent-success">
        Last Updated: { moment(lastUpdated).format('LLLL') }
      </div>
    );
  } else {
    return (null);
  }
}

export function nc_GetEntityIcon(entity) {
  icon = "pt-icon-help";

  if (entity == null || NCEntityInfo[entity] == null || NCEntityInfo[entity].icon == null)
    return icon;

  let icon = NCEntityInfo[entity].icon;  

  return icon;
}

export function nc_CanLinkToEntity(entity, entityId) {
  if (entity != null && entityId != null && 
      NCEntityInfo[entity] != null && entityId !== "" &&
      NCEntityInfo[entity].absoluteUrl != null) {
    return true;
  }
  else {
    return false;
  }
}

export function nc_findEntity(queryStr){
  //get 1st 4 char
  let entity = 0;

  if(str.substr(0, 4).search('a0')==0){
    entity = 2;//account
    nc_LinkToEntity(entity, queryStr);
  }else if(!isNaN(queryStr)){
    //block number
    nc_LinkToEntity(entity, queryStr);
  }else{
    
    //block or transaction
    
    //search for block
    if(true){
      //search for a transaction
    }
    //route
  }
  

}

export function nc_LinkToEntity(entity, entityId) {
  if (nc_CanLinkToEntity(entity, entityId)) {
    //console.log(NCEntityInfo[entity].absoluteUrl+entityId);
    hashHistory.push(NCEntityInfo[entity].absoluteUrl+entityId);
  }
}


export function nc_LinkToEntityWithParam(entity, entityId, param) {
  if (nc_CanLinkToEntity(entity, entityId)) {
    hashHistory.push(NCEntityInfo[entity].absoluteUrl+entityId+"?"+param.name+"="+param.value);
  }
}

//formats numbers to be more human readable.
export function nc_numPrettify(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function nc_getChartData(data,charttype=null){

  //get first line
  if(charttype!==null){
    let chart =[]
   
    if(Array.isArray(data)&&data.length>1){
      //let chartType = data[0].chartype;
      data.forEach( (record,i)=>{
        //let arr =[record.timestamp,record.value]//datapoint
        chart.push(nc_datapoint(record,charttype,i));//nc_datapoint(record,charttype)
      })
   
    }else{
      return chart;
    }

    return chart;
  }

}

export function nc_datapoint(data,charttype=null,i){

if((nc_isNumber(data.timestamp) && nc_isNumber(data.value)) || (!nc_isStrEmpty(data.detail) && nc_isNumber(data.value)) ){
  
  let point =[];

  switch(charttype){
    case 'line':
        point =[data.timestamp,data.value];
        break;  
    case 'pie':        
        point ={name:data.detail,y:data.value};
        break;  
    case 'bar':        
        point =[];
        break;                
    default:
        point =[];
        break;    
  }

  return point;
 }else{
    return[0,0];
 }

}


export function nc_compare(a,b) {
  return a.y-b.y;
}



















