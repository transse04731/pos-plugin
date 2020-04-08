const authenticateAPI = require('./api/authenticate')

module.exports = cms => {
  cms.data['loginUrl'] = '/view/login';
  cms.data['nonAuthenticateUrls'] = ['/login']
  cms.data['nonAuthenticateUrls'].push('/admin');

  cms.app.use('/user', authenticateAPI)

  cms.socket.on('connect', socket => {
    socket.on('get-user-info', callback => callback(socket.request.user))
  })

  cms.app.use(/^\/$/, async (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/view/login')
    }
    if (req.session.userRole.name !== 'admin') {
      return res.redirect('/view/management')
    }
    // TODO: non-user
    next()
  })
}
