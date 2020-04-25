function checkBrowserSupport () {
    "use strict";
    try {
        eval("class Foo {}");
        eval("var bar = (x) => x+1");
    } catch (e) { return false; }

    return true;
}

window.onload = function () {
    if (checkBrowserSupport()) {
        // The engine supports ES6 features you want to use
        const s = document.createElement('script')
        s.src = "./js/logic.js"
        document.head.appendChild(s)
    } else {
        window.alert('Your browser doesn\'t support ES6')
    }
}

