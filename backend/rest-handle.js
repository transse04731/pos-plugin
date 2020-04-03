const authenticateAPI = require('./api/authenticate')

module.exports = cms => {
  cms.app.use('/user', authenticateAPI)
}
