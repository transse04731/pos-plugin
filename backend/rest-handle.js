const authenticateAPI = require('./api/authenticate')

module.exports = cms => {
  cms.data['loginUrl'] = '/view/od-login';
  cms.data['nonAuthenticateUrls'] = ['/login']

  cms.app.use('/user', authenticateAPI)
}
