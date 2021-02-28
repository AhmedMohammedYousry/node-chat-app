// after setting this file up, our server is indeed setting up web sockets support correctly and it also means that
// our client was able to connect to it but with this connection in place we're now able to facilitate
// real time communication.
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (msg) => {
    console.log(msg);
    // first Mustache compiles the template
    const html = Mustache.render(messageTemplate, {
        message: msg
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // disable form
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        // enable form again here in the acknowledgment
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            return console.log(error);
        }

        console.log('The message was delivered!');
    })
})


$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (msg) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log(msg);
        })
    })

})