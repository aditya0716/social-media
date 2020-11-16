module.exports.chatSocket = (server) => {
    const io = require('socket.io')(server);
    io.sockets.on('connection', (socket) => {
        console.log('connected', socket.id);
        socket.on('disconnect', () => {
            console.log('left')
        });
        socket.on('join_room', (data) => {
            console.log('User|joined', data);
            socket.join(data.chatroom)
            io.in(data.chatroom).emit('user_joined', data)
        });
        socket.on('send_message', (data) => {
            console.log(data);
            io.in(data.chatroom).emit('new_message', data)
        })
    })
}