const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  const normalizedUsername = _.toLower(_.trim(username))
  if (!normalizedUsername || !password) {
    res.status(400).json({ success: false, message: 'Missing username or password.'})
    return
  }
  const userModel = cms.getModel('User')
  const user = await userModel.findOne({ username: normalizedUsername })
  if (user) {
    res.status(200).json({ ok: false, message: 'Email has been registered by other user.' })
  } else {
    const roleUser = await cms.getModel('Role').findOne({ name: 'user' });
    const createdUser = await userModel.create({
      username: normalizedUsername,
      password: password,
      role: roleUser._id,
    });
    if (createdUser) {
      res.status(200).json({ ok: true })
    } else {
      res.status(200).json({ ok: false, message: 'Something bad happened'})
    }
  }
})

module.exports = router
