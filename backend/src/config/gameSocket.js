const players = {};
const gameSocket = (io) => {

    io.on('connection', (socket) => {
        socket.on('joinRoom', ({ username, nickname, avatar, roomId }) => {
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

            // Send existing players to new one
            const existingPlayers = Object.entries(players)
                .filter(([id, player]) => id !== socket.id && player.roomId === roomId)
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

        socket.on('disconnect', () => {
            const player = players[socket.id];
            if (player) {
                const roomId = player.roomId;
                delete players[socket.id];
                socket.to(roomId).emit('playerDisconnected', socket.id);
            }
        });

    })



}

module.exports = gameSocket;