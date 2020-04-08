module.exports = cms => {
  cms.socket.on('connect', async socket => {
    socket.on('added-delivery-order', async order => {
      // const orderModel = cms.getModel('Order')
      // await orderModel.create(order)
      socket.emit('update-delivery-orders')
    })
  })
}