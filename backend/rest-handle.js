const authenticateAPI = require('./api/authenticate')

module.exports = cms => {
  cms.data['loginUrl'] = '/view/od-login';
  cms.data['nonAuthenticateUrls'] = ['/login']

  cms.app.use('/user', authenticateAPI)

  cms.app.use(/^\/$/, async (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/view/od-login')
    }
    if (req.session.userRole.name !== 'admin') {
      return res.redirect('/view/od-management')
    }
    next()
  })
}
