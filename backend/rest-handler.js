module.exports = cms => {
  cms.app.use(/^\/$/, async (req, res, next) => {
    return res.redirect('/pos-login')
    next()
  })
}