const authenticateAPI = require('./api/authenticate')
const deviceAPI = require('./api/device')
const storeAPI = require('./api/store')

module.exports = cms => {
  cms.data['loginUrl'] = '/sign-in';
  cms.data['nonAuthenticateUrls'] = ['/login', '/admin', '/store']

  cms.app.use('/user', authenticateAPI)
  cms.app.use('/device', deviceAPI)
  cms.app.use('/store', storeAPI)

  cms.app.use(/^\/$/, async (req, res, next) => {
    if (!req.session.userId)
      return res.redirect('/sign-in')
    if (req.session.userRole.name === 'admin')
      return res.redirect('/admin')
    else
      return res.redirect('/management')
    next()
  })
}
