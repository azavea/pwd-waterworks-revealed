function initialize() {
    // Allow launching in desktop browser
    var event = (window.device ? 'deviceready' : 'DOMContentLoaded');
    document.addEventListener(event, start, false);
}

function start(e) {
    document.getElementById('helloButton').addEventListener('click', toggleHello);
}

function toggleHello (e) {
    var button = e.currentTarget;
    button.textContent = (button.textContent === 'Hello' ? 'Goodbye' : 'Hello');
}
