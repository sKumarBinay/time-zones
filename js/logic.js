export function buildWatch (notLocal, offset) {
    return new Promise((resolve, reject) => {
        const secHand = document.querySelector('.sec')
        const minHand = document.querySelector('.min')
        const hrHand = document.querySelector('.hr')
        window.notLocal = notLocal
        window.offset = offset
        let date
        let dateFormat
        setInterval(() => {
            if (window.notLocal) {
                const d = new Date()
                // convert to msec, subtract local time zone offset, get UTC time in msec
                const utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                date = new Date(utc + (3600000*window.offset)).toTimeString()
                dateFormat = new Date(utc + (3600000*window.offset)).toDateString()
            } else {
                date = new Date().toTimeString()
                dateFormat = new Date().toDateString()
            }
            const time = date.split(/ /g)[0]
            const sec = time.split(/:/g)[2]
            const min = time.split(/:/g)[1]
            const hr = time.split(/:/g)[0] >= 12 ? time.split(/:/g)[0] - 12 : time.split(/:/g)[0]
        secHand.style.transform = `rotate(${sec * 6}deg) translate(-50%, -50%)`
        minHand.style.transform = `rotate(${min * 6}deg) translate(-50%, -50%)`
        hrHand.style.transform = `rotate(${(hr * 30) + (min / 2)}deg) translate(-50%, -50%)`
        if (date !== undefined) resolve([date, dateFormat])
        }, 1000)
    })
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