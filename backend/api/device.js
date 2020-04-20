const _ = require('lodash')
const randomstring = require('randomstring')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const DeviceModel = cms.getModel('Device');

function generateDeviceCode() {
  return randomstring.generate({length: 6})
}

async function generateUniqueDeviceCode() {
  const deviceCodes = _.map(await DeviceModel.find({}, {deviceCode: 1}), device => device.deviceCode)
  let newDeviceCode = generateDeviceCode()
  while (_.includes(deviceCodes, newDeviceCode))
    newDeviceCode = generateDeviceCode()
  return newDeviceCode
}

async function addPairedDeviceToStore(deviceId, storeId) {
  const store = await cms.getModel('Store').findOne({_id: storeId}, {devices: 1});
  const deviceIds = store.devices.map(e => e._id.toString());
  if (!deviceIds.includes(deviceId)) store.devices.push(ObjectId(deviceId))
  await cms.getModel('Store').updateOne({_id: storeId}, {devices: store.devices});
}

async function removePairedDeviceFromStore(deviceId, storeId) {
  const store = await cms.getModel('Store').findOne({_id: storeId}, {devices: 1});
  store.devices.filter(_id => deviceId !== _id.toString());
  await cms.getModel('Store').updateOne({_id: storeId}, {devices: store.devices});
}

router.get('/pairing-code', async (req, res) => {
  const {storeId, name} = req.query

  // Only 1 store can have "onlineOrder" feature
  const device = await DeviceModel.findOne({storeId, paired: false, features: 'onlineOrder', name})
  if (device) return res.status(200).json({pairingCode: device.pairingCode})

  // Create new device if none exists
  const pairingCode = await generateUniqueDeviceCode()
  await DeviceModel.create({
    features: ['onlineOrder', 'proxy'],
    pairingCode,
    name,
    storeId: ObjectId(storeId),
    paired: false,
    online: false,
  })

  res.status(200).json({pairingCode})
})

router.post('/register', async (req, res) => {
  // hardware: Sunmi, Kindle-Fire, etc, ...
  // appName: Pos-Germany.apk
  // appVersion: 1.51
  // feature: onlineOrder | remoteControl | updatable | proxy
  // const {pairingCode, hardware, appName, appVersion, features} = req.body;
  const {pairingCode, hardware, appName, appVersion, features } = req.body;

  if (!pairingCode) return res.status(400).json({message: 'Missing pairingCode in request body'});

  const deviceInfo = await DeviceModel.findOne({pairingCode, paired: false});
  if (deviceInfo) {
    await DeviceModel.updateOne({pairingCode}, {paired: true, online: true, hardware, appName, appVersion, features });
    await addPairedDeviceToStore(deviceInfo._id, deviceInfo.storeId)
    res.status(200).json({deviceId: deviceInfo._id})
  } else {
    res.status(400).json({message: 'Invalid pairing code or pairing code has been used by another device'})
  }
})

router.post('/unregister', async (req, res) => {
  const {_id} = req.body;
  const deviceInfo = await DeviceModel.findOne({_id});
  if (deviceInfo) {
    await DeviceModel.deleteOne({_id})
    await removePairedDeviceFromStore(_id, deviceInfo.storeId)
    res.status(200).json({deviceId: deviceInfo._id})
  } else {
    res.status(400).json({message: 'Bad request: Invalid id'})
  }
})


module.exports = router
