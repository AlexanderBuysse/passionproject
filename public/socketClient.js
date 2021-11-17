{
    let socket = io();
    
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const btnRoomtwo = document.querySelector(`.btn-room-client`);
    const handleClickBtn = e => {
            socket.emit(`join room`, `one`);
    }
    btnRoomtwo.addEventListener(`click` , handleClickBtn);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });

    socket.on('chat message', function (msg) {
        console.log(msg);
        let item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}