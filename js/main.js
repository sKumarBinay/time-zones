import { buildWatch } from './logic.js'

buildWatch().then(() => {
  setTimeout(() => {
    document.querySelector('.watch').classList.remove('d-none')
  }, 1000)
})
// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_site.js')
      .catch(err => console.log(`Service Worker: Error: ${err}`));
  });
}

// fetch('https://www.amdoren.com/api/timezone.php?api_key=5s7hVwd4xv2wVjKrEWQjcC79BM2nH2&loc=New+York')
// .then(res => {
//   debugger
//   console.log(res)
// })
// .catch(err => {
//   debugger
//   console.log(err)
// })

// function calcTime(city, offset) {
//   // create Date object for current location
//   var d = new Date();

//   // convert to msec
//   // subtract local time zone offset
//   // get UTC time in msec
//   var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

//   // create new Date object for different city
//   // using supplied offset
//   var nd = new Date(utc + (3600000*offset));

//   // return time as a string
//   return "The local time for city"+ city +" is "+ nd.toLocaleString();
// }

// alert(calcTime('Bombay', '+5.5'));

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