// after setting this file up, our server is indeed setting up web sockets support correctly and it also means that
// our client was able to connect to it but with this connection in place we're now able to facilitate
// real time communication.
const socket = io()

socket.on('message', (msg) => {
    console.log(msg);
})


document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if(error) {
            return console.log(error);
        }

        console.log('The message was delivered!');
    })
})


document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (msg) => {
            console.log(msg);
        })
    })

})