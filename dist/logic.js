'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildWatch = buildWatch;
function buildWatch() {
    return new Promise(function (resolve, rej) {
        var secHand = document.querySelector('.sec');
        var minHand = document.querySelector('.min');
        var hrHand = document.querySelector('.hr');
        setInterval(function () {
            var date = new Date().toTimeString();
            var time = date.split(/ /g)[0];
            var sec = time.split(/:/g)[2];
            var min = time.split(/:/g)[1];
            var hr = time.split(/:/g)[0] >= 12 ? time.split(/:/g)[0] - 12 : time.split(/:/g)[0];
            secHand.style.transform = 'rotate(' + sec * 6 + 'deg) translate(-50%, -50%)';
            minHand.style.transform = 'rotate(' + min * 6 + 'deg) translate(-50%, -50%)';
            hrHand.style.transform = 'rotate(' + (hr * 30 + min / 2) + 'deg) translate(-50%, -50%)';
        }, 1000);
        resolve();
    });
}

// 5s7hVwd4xv2wVjKrEWQjcC79BM2nH2

// {
//     "error" : 0,
//     "error_message" : "-",
//     "time" : "2020-04-25 12:10:31",
//     "timezone" : "Eastern Standard Time",
//     "offset" : -240,
//     "daylight_savings" : "In daylight savings"
//     }