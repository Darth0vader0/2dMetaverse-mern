const players = {};

const rooms = {}; // { roomId: Set of socket ids }
const gameSocket = (io) => {

    io.on('connection', (socket) => {
        socket.on('joinRoom', ({ username, nickname, avatar, roomId }) => {
            console.log(`User ${username} joined room ${roomId}`);
            socket.join(roomId);

            players[socket.id] = {
                username,
                nickname,
                avatar,
                roomId,
                x: 100,
                y: 100,
                direction: 'down',
                animKey: '',
                isSitting: false,
                chairDirection: null
            };

              // Add to rooms map
    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);

            // Send existing players to new one
            const existingPlayers = Object.entries(players)
                .filter(([id, player]) => id !== socket.id)
                .map(([id, player]) => ({ id, ...player }));
            socket.emit('currentPlayers', existingPlayers);

            // Notify others in the room
            socket.to(roomId).emit('newPlayer', {
                id: socket.id,
                username,
                nickname,
                avatar,
                x: 100,
                y: 100,
                direction: 'down'
            });
        });

        socket.on('playerMovement', ({ x, y, direction, animKey }) => {
            if (players[socket.id]) {
                const player = players[socket.id];
                player.x = x;
                player.y = y;
                player.direction = direction;
                player.animKey = animKey;

                socket.to(player.roomId).emit('playerMoved', {
                    id: socket.id,
                    x,
                    y,
                    direction,
                    animKey
                });
            }
        });

        socket.on('playerSitting', ({ direction }) => {
            const player = players[socket.id];
            if (player) {
                player.isSitting = true;
                player.chairDirection = direction;

                socket.to(player.roomId).emit('playerSitting', {
                    id: socket.id,
                    direction
                });
            }
        });

        socket.on('playerStanding', () => {
            const player = players[socket.id];
            if (player) {
                player.isSitting = false;
                player.chairDirection = null;

                socket.to(player.roomId).emit('playerStanding', {
                    id: socket.id
                });
            }
        });
      
socket.on("leaveRoom", () => {
    const player = players[socket.id];
    const roomId = removePlayerFromRoom(socket);
    if (player && roomId) {
        console.log(`User ${player.username} left room ${roomId}`);
        socket.to(roomId).emit('playerLeft', socket.id);
    }
});

socket.on('disconnect', () => {
    const player = players[socket.id];
    const roomId = removePlayerFromRoom(socket);
    if (player && roomId) {
        socket.to(roomId).emit('playerDisconnected', socket.id);
    }
});

    })



}

function removePlayerFromRoom(socket) {
    const player = players[socket.id];
    if (player) {
        const roomId = player.roomId;
        delete players[socket.id];
        socket.leave(roomId);

        // Remove from rooms map
        if (rooms[roomId]) {
            rooms[roomId].delete(socket.id);
            if (rooms[roomId].size === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted (now empty)`);
            }
        }
        return roomId;
    }
    return null;
}

module.exports = gameSocket;