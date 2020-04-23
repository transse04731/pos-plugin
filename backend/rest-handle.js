const authenticateAPI = require('./api/authenticate')
const deviceAPI = require('./api/device')
const storeAPI = require('./api/store')

module.exports = cms => {
  cms.data['loginUrl'] = '/sign-in';
  cms.data['nonAuthenticateUrls'] = ['/login', '/admin', '/store']

  cms.app.use('/user', authenticateAPI)
  cms.app.use('/device', deviceAPI)
  cms.app.use('/store', storeAPI)

  // NOTE: If health-check API URL is changed, the URL used on frontend must be changed accordingly
  cms.app.get('/health-check', (req, res) => res.status(200).send('OK'));

  cms.app.use(/^\/$/, async (req, res, next) => {
    if (!req.session.userId)
      return res.redirect('/sign-in')
    else
      return res.redirect('/management')
    next()
  })
}
