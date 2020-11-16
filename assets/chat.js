class chatBox {
    constructor(chatBoxId, email) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = email;
        this.socket = io.connect('http://localhost:5000');
        if (this.userEmail) {
            this.setUpConnections();
        }
    }
    setUpConnections = () => {
        this.socket.on('connect', () => {
            console.log('success to 5000')
            this.socket.emit('join_room', {
                user_email: this.userEmail,
                chatroom: 'codeial'
            });
            this.socket.on('user_joined', (data) => {
                console.log('new User', data)
            });
        })
        $('#sendChat').click((e) => {
            let message = $('#chatInput').val();
            if (message === '') {
                console.log('no text');
                return;
            }
            this.socket.emit('send_message', {
                message: message,
                user_email: this.userEmail,
                chatroom: 'codeial'
            })
        });
        this.socket.on('new_message', (data) => {
            let newmessage = document.createElement('div');
            newmessage.innerText = data.message;
            newmessage.classList.add('chat-bubble');
            if (data.user_email === this.userEmail) {
                newmessage.classList.add('self-chat');
            }
            else {
                newmessage.classList.add('other-chat');
            }
            $('.chat-messages')[0].appendChild(newmessage);
            $('.chat-messages')[0].scrollTop = $('.chat-messages')[0].scrollHeight;
        })

    }

}
