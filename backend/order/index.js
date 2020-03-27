module.exports = (cms) => {
  cms.socket.on('connection', async (socket) => {
    socket.on('join-room', () => {
      socket.join('room')
    })

    socket.on('update-table-status', ({table, status}) => {
      cms.socket.to('room').emit('update-table-status', ({table, status}))
    })
  })
}
