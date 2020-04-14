const _ = require('lodash')
const randomstring = require('randomstring')
const express = require('express')
const router = express.Router()

const OnlineOderDeviceModel = cms.getModel('OnlineOrderDevice');

function generateDeviceCode() {
  return randomstring.generate({length: 6})
}

async function generateUniqueDeviceCode() {
  const deviceCodes = _.map(await OnlineOderDeviceModel.find({}, {deviceCode: 1}), device => device.deviceCode)
  let newDeviceCode = generateDeviceCode()
  while (_.includes(deviceCodes, newDeviceCode))
    newDeviceCode = generateDeviceCode()
  return newDeviceCode
}

router.get('/pairing-code', async (req, res) => {
  const {storeId} = req.query

  // if pairing code of specified store has been created then return this value
  const device = await OnlineOderDeviceModel.findOne({storeId})
  if (device) return res.status(200).json({pairingCode: device.pairingCode})

  // if not, then generate new pairing code
  const pairingCode = await generateUniqueDeviceCode()
  await OnlineOderDeviceModel.create({pairingCode, storeId, paired: false})

  // // after 15 minutes, if no device register to system by this pairing code, then delete it
  // setTimeout(async() => {
  //   const device = await OnlineOderDeviceModel.find({ code, store: storeId })
  //   if (!device.token)
  //     await OnlineOderDeviceModel.remove({ code, store: storeId })
  // }, 15 * 60 * 1000) // 15 minutes

  res.status(200).json({pairingCode})
})

router.post('/register', async (req, res) => {
  const {pairingCode} = req.body;

  if (!pairingCode) return res.status(400).json({message: 'Missing pairingCode in request body'});

  const device = await OnlineOderDeviceModel.findOne({pairingCode});

  if (device) {
    await OnlineOderDeviceModel.findOneAndUpdate({pairingCode}, {paired: true})
    res.status(200).json({deviceId: device._id})
  } else {
    res.status(400).json({message: 'Invalid pairing code'})
  }
})

module.exports = router
