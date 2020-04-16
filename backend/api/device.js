const _ = require('lodash')
const randomstring = require('randomstring')
const express = require('express')
const router = express.Router()

const OnlineOderDeviceModel = cms.getModel('Device');

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

async function getUniqueDeviceName(storeId, prefix) {
  const aliases = _.map(await OnlineOderDeviceModel.find({ storeId }, { alias: 1 }), item => item.alias)
  let n = 0
  let alias
  do {
    n++
    alias = `${prefix} ${n}`
  } while(_.includes(aliases, alias))
  return alias
}

async function addPairedDeviceToStore(deviceId, storeId) {
  const store = await cms.getModel('Store').findOne({ _id: storeId}, { devices: 1 })
  const devices = _.map(store.devices, device => device._id)
  devices.push(deviceId)
  await cms.getModel('Store').updateOne({ _id: storeId }, { devices })
}

async function removePairedDeviceFromStore(deviceId, storeId) {
  const store = await cms.getModel('Store').findOne({ _id: storeId}, { devices: 1 })
  const devices = _.map(store.devices, device => device._id)
  const newDevices = _.xor(devices, [deviceId])
  await cms.getModel('Store').updateOne({ _id: storeId }, { devices: newDevices })
}

router.get('/pairing-code', async (req, res) => {
  const {storeId, name} = req.query

  // try to find created pairing code but not paired
  const device = await OnlineOderDeviceModel.findOne({storeId, paired: false, name})
  if (device)
    return res.status(200).json({pairingCode: device.pairingCode})

  // if not, then generate new pairing code
  const pairingCode = await generateUniqueDeviceCode()
  await OnlineOderDeviceModel.create({pairingCode, name, storeId, paired: false})

  res.status(200).json({pairingCode})
})

router.post('/register', async (req, res) => {
  // hardware: Sunmi, Kindle-Fire, etc, ...
  // appName: Pos-Germany.apk
  // appVersion: 1.51
  // feature: onlineOrder | remoteControl | updatable | proxy

  const { pairingCode, hardware, appName, appVersion, features } = req.body;

  if (!pairingCode)
    return res.status(400).json({message: 'Missing pairingCode in request body'});

  const deviceInfo = await OnlineOderDeviceModel.findOne({pairingCode, paired: false});
  if (deviceInfo) {
    await OnlineOderDeviceModel.updateOne({pairingCode}, { paired: true, hardware, appName, appVersion, features })
    await addPairedDeviceToStore(deviceInfo._id, deviceInfo.storeId)
    res.status(200).json({deviceId: deviceInfo._id})
  } else {
    res.status(400).json({message: 'Invalid pairing code or pairing code has been used by another device'})
  }
})

router.post('/un-register', async (req, res) => {
  const {_id} = req.body;
  const deviceInfo = await OnlineOderDeviceModel.findOne({_id});
  if (deviceInfo) {
    await OnlineOderDeviceModel.remove({_id})
    await removePairedDeviceFromStore(_id, deviceInfo.storeId)
    res.status(200).json({deviceId: deviceInfo._id})
  } else {
    res.status(400).json({message: 'Bad request: Invalid id'})
  }
})


module.exports = router
