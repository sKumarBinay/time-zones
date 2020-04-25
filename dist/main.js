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