const authenticateAPI = require('./api/authenticate')
const onlineOrderDeviceApi = require('./api/onlineOrderDevice')
const storeApi = require('./api/store')

module.exports = cms => {
  cms.data['loginUrl'] = '/view/sign-in';
  cms.data['nonAuthenticateUrls'] = ['/login', '/admin', '/stores']

  cms.app.use('/user', authenticateAPI)
  cms.app.use('/online-order-device', onlineOrderDeviceApi)
  cms.app.use('/store', storeApi)

  cms.socket.on('connect', socket => {
    // online-order
    socket.on('online-order--connect', code => socket.join(code))
    socket.on('online-order--create-order', (code, orderId) => socket.to(code).emit('create-order', orderId))
  })

  cms.app.use(/^\/$/, async (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/view/sign-in')
    }
    // if (req.session.userRole.name !== 'admin') {
    //   return res.redirect('/view/management')
    // }
    // TODO: non-user
    next()
  })
}
