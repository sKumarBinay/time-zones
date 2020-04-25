'use strict';

var _logic = require('./logic.js');

(0, _logic.buildWatch)();
// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../sw_cached_site.js').catch(function (err) {
      return console.log('Service Worker: Error: ' + err);
    });
  });
}

fetch('https://www.amdoren.com/api/timezone.php?api_key=5s7hVwd4xv2wVjKrEWQjcC79BM2nH2=New+York').then(function (res) {
  debugger;
  console.log(res);
}).catch(function (err) {
  debugger;
  console.log(err);
});