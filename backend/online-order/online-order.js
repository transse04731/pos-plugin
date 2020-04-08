module.exports = cms => {
  cms.socket.on('connect', async socket => {
    socket.on('added-online-order', async order => {
      // const orderModel = cms.getModel('Order')
      // await orderModel.create(order)
      socket.emit('update-online-orders')
    })
  })
}