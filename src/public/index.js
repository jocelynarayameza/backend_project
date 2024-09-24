const socketClient = io();

let userName = "";

function setUserName(result) {
    if (result.value) {
        userName = result.value;
        socketClient.emit('newUser', userName); 
    }
}

if (!userName) {
    Swal.fire({
        title: "Welcome to chat!",
        input: "text",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "Your username is required!";
            }
        }
    }).then(setUserName)
        
    }


const message = document.getElementById("message");
const btn = document.getElementById("send-button");
const output = document.getElementById("message-output");

btn.addEventListener('click', (e) => {
    e.preventDefault();
    socketClient.emit('chatMessage', {
        userName: userName,
        message: message.value
    })
    message.value = "";
})

socketClient.on('messages', (data) => {
    const chatRender = data.map((msg) => {
        return `<p><strong>${msg.userName}</strong>: ${msg.message}</p>`
    }).join(' ');

    output.innerHTML = chatRender;
});

