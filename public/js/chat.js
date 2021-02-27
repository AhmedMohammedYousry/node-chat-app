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
    socket.emit('sendMessage', message)
})
