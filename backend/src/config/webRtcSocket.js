const groupUsers = new Map(); // groupId => Set of user objects

const webrtcSocket = (io) => {
  const webrtcNamespace = io.of('/webrtc');

  webrtcNamespace.on('connection', (socket) => {
    // ----------- SINGLE CALL EVENTS -----------
    socket.on('join-single', ({ roomId, user }) => {
      socket.join(roomId);
      socket.to(roomId).emit('single-user-joined', { user, socketId: socket.id });
    });

    socket.on('leave-single', ({ roomId, user }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('single-user-left', { user, socketId: socket.id });
    });

    socket.on('single-media', ({ roomId, data, to }) => {
      if (to) {
        webrtcNamespace.to(to).emit('single-media', { data, from: socket.id });
      } else {
        socket.to(roomId).emit('single-media', { data, from: socket.id });
      }
    });

    // ----------- GROUP CALL EVENTS -----------
    socket.on('join-group', ({ groupId, user }) => {
      socket.join(groupId);

      // Add user to groupUsers map
      if (!groupUsers.has(groupId)) groupUsers.set(groupId, new Set());
      groupUsers.get(groupId).add({ ...user, socketId: socket.id });

      // Notify others in the group
      socket.to(groupId).emit('group-user-joined', { user, socketId: socket.id });

      // Send current users in the group to the new joiner (excluding themselves)
      const users = Array.from(groupUsers.get(groupId)).filter(u => u.socketId !== socket.id);
      socket.emit('current-group-users', users);
    });

    socket.on('leave-group', ({ groupId, user }) => {
      socket.leave(groupId);
      if (groupUsers.has(groupId)) {
        // Remove user from groupUsers map
        const updatedUsers = new Set([...groupUsers.get(groupId)].filter(u => u.socketId !== socket.id));
        groupUsers.set(groupId, updatedUsers);
        socket.to(groupId).emit('group-user-left', { user, socketId: socket.id });
      }
    });

    socket.on('group-media', ({ groupId, data }) => {
      socket.to(groupId).emit('group-media', { data, from: socket.id });
    });

    // ----------- CLEANUP ON DISCONNECT -----------
    socket.on('disconnecting', () => {
      for (const groupId of socket.rooms) {
        if (groupUsers.has(groupId)) {
          const updatedUsers = new Set([...groupUsers.get(groupId)].filter(u => u.socketId !== socket.id));
          groupUsers.set(groupId, updatedUsers);
          socket.to(groupId).emit('group-user-left', { socketId: socket.id });
        }
      }
    });
  });
}

module.exports = webrtcSocket;

