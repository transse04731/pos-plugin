const _ = require('lodash')
const randomstring = require('randomstring')
const express = require('express')
const router = express.Router()

const ONLINE_ORDER_DEVICE_COLLECTION = 'OnlineOrderDevice'

function generateDeviceCode() {
  return randomstring.generate({ length: 6 })
}

async function generateUniqueDeviceCode() {
  const deviceCodes = _.map(await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).find({}, { deviceCode: 1 }), device => device.deviceCode)
  let newDeviceCode = generateDeviceCode()
  while(_.includes(deviceCodes, newDeviceCode))
    newDeviceCode = generateDeviceCode()
  return newDeviceCode
}

router.get('/pairing-code', async (req, res) => {
  const { storeId } = req.query
  // if paring code of specifed store has been created then return this value
  const device = await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).findOne({ store: storeId })
  if (device) {
    res.status(200).json({ code: device.code })
    return
  }

  // if not, then generate new paring code
  const code = generateUniqueDeviceCode()
  await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).create({ code, store: storeId })

  // // after 15 minutes, if no device register to system by this pairing code, then delete it
  // setTimeout(async() => {
  //   const device = await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).find({ code, store: storeId })
  //   if (!device.token)
  //     await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).remove({ code, store: storeId })
  // }, 15 * 60 * 1000) // 15 minutes

  res.status(200).json({ code })
})

router.post('/register', async(req, res) => {
  const { token, code } = req.body
  if (!token) {
    res.status(400).end()
    return
  }
  const device = await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).findOne({code})
  if (device) {
    await cms.getModel(ONLINE_ORDER_DEVICE_COLLECTION).findOneAndUpdate({code}, {token})
    res.status(200).json({message: 'Device registered'})
  } else {
    res.status(400).json({message: 'Invalid pairing code'})
  }
})

module.exports = router
