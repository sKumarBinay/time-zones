'use strict';

var _logic = require('./logic.js');

var _data = require('../data.js');

var data = _interopRequireWildcard(_data);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _logic.buildWatch)().then(function (date) {
  var amPmDiv = document.querySelector('.am-pm');
  document.querySelector('.watch').classList.remove('d-none');
  amPmDiv.classList.remove('d-none');
  amPmDiv.textContent = date.split(':')[0] > 12 ? 'PM' : 'AM';
});

// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../sw_cached_site.js').catch(function (err) {
      return console.log('Service Worker: Error: ' + err);
    });
  });
}

var input = document.querySelector('input[name="country"]');
input.addEventListener('change', function (e) {
  var dayLightSaving = document.querySelector('#day-saving-checkbox');

  dayLightSaving.addEventListener('change', function (e) {
    var currentZone = document.querySelector('.current-zone').textContent.split('zone: ')[1];
    var findZone = data.data.filter(function (z) {
      return z.country === currentZone;
    })[0];
    e.target.checked ? calcTime(findZone.DST) : calcTime(findZone.UTCoffset);
  });

  var filtered = [];
  data.data.forEach(function (el) {
    if (el.country.toLowerCase().includes(e.target.value.toLowerCase())) {
      filtered.push(el);
    }
  });

  var filterDiv = document.querySelector('.filter-div');
  if (filtered.length > 1) {
    filterDiv.innerHTML = '';
    filtered.forEach(function (f) {
      filterDiv.innerHTML += '<span class="filtered"><a>' + f.country + '</a></span>';
    });
    filterDiv.querySelectorAll('a').forEach(function (a, index) {
      a.addEventListener('click', function () {
        calcTime(filtered[index].UTCoffset);
        afterTimeZoneSelection(filtered[index]);
      });
    });
  } else if (filtered.length === 1) {
    calcTime(filtered[0].UTCoffset);
    afterTimeZoneSelection(filtered[0]);
  } else {
    filterDiv.textContent = 'Sorry, No match found.';
  }
});

function calcTime(offset) {
  var amPmDiv = document.querySelector('.am-pm');
  var formatted = void 0;
  if (offset.includes(':30')) {
    formatted = offset.replace(':30', '.5');
  } else if (offset.includes(':45')) {
    formatted = offset.replace(':45', '.75');
  } else formatted = offset.replace(':', '.');
  (0, _logic.buildWatch)(true, formatted).then(function (date) {
    amPmDiv.textContent = date.split(':')[0] > 12 ? 'PM' : 'AM';
  });
}

function afterTimeZoneSelection(data) {
  var filterDiv = document.querySelector('.filter-div');
  var currentZone = document.querySelector('.current-zone');
  var dstInfo = document.querySelector('.dst-info');
  var input = document.querySelector('input[name="country"]');
  emptyParent(filterDiv);
  input.value = '';
  currentZone.textContent = 'Current zone: ' + data.country;
  var dstToggle = document.querySelector('#day-saving-checkbox');
  dstInfo.innerHTML = formatDSTinfo(data);
  dstToggle.checked = false;
  dstToggle.disabled = data.DST === '-' ? true : false;
}

function formatDSTinfo(info) {
  if (info.DST !== '-') {
    var startDate = void 0;
    var endDate = void 0;
    if (info.country !== 'Chatham Islands (New Zealand)' && info.country !== 'Iran') {
      startDate = info.DSTperiodStartEnd.split(':00 ')[0] + ':00';
      endDate = info.DSTperiodStartEnd.split(':00 ')[1];
    } else if (info.country === 'Chatham Islands (New Zealand)') {
      startDate = info.DSTperiodStartEnd.split(':45 ')[0] + ':45';
      endDate = info.DSTperiodStartEnd.split(':45 ')[1];
    } else if (info.country === 'Iran') {}
    return '<div class="start"><span>Starts on:</span><span>' + startDate + '</span></div>\n          <div class="end"><span>Ends on:</span><span>' + endDate + '</span></div>';
  } else {
    return '';
  }
}

function emptyParent(parent) {
  while (parent.children.length !== 0) {
    parent.childNodes[0].remove();
  }
}