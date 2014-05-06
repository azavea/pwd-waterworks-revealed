function initialize() {
    console.log('Initializing...');
    document.getElementById('helloButton').addEventListener('click', toggleHello);
    console.log('Initialized');
}

function toggleHello(e) {
    console.log('Button clicked');
    var button = e.currentTarget;
    button.textContent = (button.textContent === 'Hello' ? 'Goodbye' : 'Hello');
}
