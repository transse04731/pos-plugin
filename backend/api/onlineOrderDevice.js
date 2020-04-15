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

async function getUniqueTerminalAlias(storeId) {
  const aliases = _.map(await OnlineOderDeviceModel.find({ storeId }, { alias: 1 }), item => item.alias)
  let n = 0
  let prefix = 'Terminal'
  let alias
  do {
    n++
    alias = `${prefix} ${n}`
  } while(_.includes(aliases, alias))
  return alias
}

router.get('/pairing-code', async (req, res) => {
  const {storeId} = req.query

  // if pairing code of specified store has been created then return this value
  const device = await OnlineOderDeviceModel.findOne({storeId})
  if (device) return res.status(200).json({pairingCode: device.pairingCode})

  // if not, then generate new pairing code
  const pairingCode = await generateUniqueDeviceCode()
  await OnlineOderDeviceModel.create({pairingCode, storeId, paired: false})

  res.status(200).json({pairingCode})
})

router.post('/register', async (req, res) => {
  // name: Sunmi, Kindle-Fire, etc, ...
  // appName: Pos-Germany.apk
  // appVersion: 1.51
  // type: terminal | webShopTerminal
  let alias
  const { pairingCode, name, appName, appVersion, type } = req.body;

  if (!pairingCode)
    return res.status(400).json({message: 'Missing pairingCode in request body'});

  const deviceInfo = await OnlineOderDeviceModel.findOne({pairingCode, paired: false});
  if (deviceInfo) {
    if (type === 'webShopTerminal')
      alias = 'WebShop Terminal'
    else if (type === 'terminal')
      alias = await getUniqueTerminalAlias(deviceInfo.storeId)
    else {
      res.status(400).json({message: 'Invalid device type'})
      return
    }
    await OnlineOderDeviceModel.findOneAndUpdate({pairingCode}, { paired: true, alias, name, appName, appVersion, type })
    res.status(200).json({deviceId: deviceInfo._id})
  } else {
    res.status(400).json({message: 'Invalid pairing code or pairing code has been used by another device'})
  }
})

router.post('/un-register', async (req, res) => {
  const {_id} = req.body;
  const device = await OnlineOderDeviceModel.findOne({_id});
  if (device) {
    await OnlineOderDeviceModel.remove({_id})
    res.status(200).json({deviceId: device._id})
  } else {
    res.status(400).json({message: 'Bad request: Invalid id'})
  }
})


module.exports = router
