'use strict';

var _logic = require('./logic.js');

var _data = require('../data.js');

var data = _interopRequireWildcard(_data);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _logic.buildWatch)().then(function () {
  setTimeout(function () {
    document.querySelector('.watch').classList.remove('d-none');
  }, 1000);
});
// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../sw_cached_site.js').catch(function (err) {
      return console.log('Service Worker: Error: ' + err);
    });
  });
}

var input = document.querySelector('input');
input.addEventListener('change', function (e) {
  var offset = void 0;
  data.data.forEach(function (el) {
    if (el.country.toLowerCase().includes(e.target.value.toLowerCase())) {
      offset = el.UTCoffset;
      calcTime(el.country, offset);
      return;
    }
  });
  console.log('offset:' + offset);
});

function calcTime(city, offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;

  // create new Date object for different city
  // using supplied offset

  var formatted = offset.includes(':30') ? offset.replace(':30', '.5') : offset.replace(':', '.');

  var nd = new Date(utc + 3600000 * formatted);

  // return time as a string
  console.log("The local time for city " + city + " is " + nd.toLocaleString());
  return "The local time for city " + city + " is " + nd.toLocaleString();
}

// alert();

// const dataDiv = document.querySelector('.data')
// debugger
// const data = []
// const head = dataDiv.querySelectorAll('thead tr th')
// const body = dataDiv.querySelectorAll('tbody tr').forEach(r => {
//   if (r.children.length > 1) {
//     const obj = {
//       country: r.querySelectorAll('td')[0].textContent,
//       UTCoffset: r.querySelectorAll('td')[1].textContent,
//       DST: r.querySelectorAll('td')[2].textContent,
//       DSTperiodStartEnd: r.querySelectorAll('td')[3].textContent
//     }

//     data.push(obj)
//   }
// })

// console.log(data)