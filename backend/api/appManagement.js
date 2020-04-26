const express = require('express')
const router = express.Router()

router.post('/meta-data', async (req, res) => {
  try {
    const {uploadPath, version, type, note, group, base, release} = req.body
    const app = await cms.getModel('App').findOne({name: group})
    if (!app) {
      res.json({ok:false, message: `App ${group} not found`})
      return
    }
    await cms.getModel('AppItem').create({ version, type, changeLog: note, uploadPath, uploadDate: new Date(), app: app._id, baseVersion: base, release })
    res.json({ok: true})
  } catch (e) {
    res.json({error: e})
  }
})

module.exports = router
