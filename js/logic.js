export function buildWatch () {
    const secHand = document.querySelector('.sec')
    const minHand = document.querySelector('.min')
    const hrHand = document.querySelector('.hr')
    setInterval(() => {
        const date = new Date().toTimeString()
        const time = date.split(/ /g)[0]
        const sec = time.split(/:/g)[2]
        const min = time.split(/:/g)[1]
        const hr = time.split(/:/g)[0] >= 12 ? time.split(/:/g)[0] - 12 : time.split(/:/g)[0]
    secHand.style.transform = `rotate(${sec * 6}deg) translate(-50%, -50%)`
    minHand.style.transform = `rotate(${min * 6}deg) translate(-50%, -50%)`
    hrHand.style.transform = `rotate(${(hr * 30) + (min / 2)}deg) translate(-50%, -50%)`
    }, 1000)
}
