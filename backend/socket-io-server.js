const {p2pServerPlugin} = require('@gigasource/socket.io-p2p-plugin');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ProxyServer = require('@gigasource/nodejs-proxy-server/libs/server.js');
const {remoteControlExpressServerPort, remoteControlSocketIOServerPort} = global.APP_CONFIG;

const Schema = mongoose.Schema
const savedMessageSchema = new Schema({
  targetClientId: ObjectId,
  event: {
    type: String,
    trim: true,
  },
  args: Array,
  ackFnName: {
    type: String,
    trim: true,
  },
  ackFnArgs: Array,
}, {
  timestamps: true
});

const SavedMessagesModel = mongoose.model('SocketIOSavedMessage', savedMessageSchema);

async function saveMessage(targetClientId, message) {
  const result = await SavedMessagesModel.create(Object.assign({targetClientId}, message));
  return result._id;
}

async function deleteMessage(targetClientId, _id) {
  await SavedMessagesModel.deleteOne({_id});
}

function loadMessages(targetClientId) {
  return SavedMessagesModel.find({targetClientId});
}

module.exports = function (cms) {
  const DeviceModel = cms.getModel('OnlineOrderDevice');

  const proxyServer = new ProxyServer({
    expressServerPort: remoteControlExpressServerPort,
    socketIOServerPort: remoteControlSocketIOServerPort || 8901,
    ignoreStreamError: true,
  });
  // for destroy: proxyServer.destroy();

  const {io, socket: socketIOServer} = cms;
  const serverPlugin = p2pServerPlugin(io, {
    saveMessage, loadMessages, deleteMessage,
  });

  socketIOServer.on('connect', socket => {
    let remoteControlDeviceId = null;

    socket.on('createOrder', async (storeId, orderData) => {
      storeId = ObjectId(storeId);
      const device = await DeviceModel.findOne({storeId});
      const deviceId = device._id.toString();

      serverPlugin.emitToPersistent(deviceId, 'createOrder', [orderData]);
    });

    socket.on('startRemoteControl', async (deviceId, callback) => {
      if (!deviceId) {
        callback(null);
      } else {
        remoteControlDeviceId = deviceId;
        serverPlugin.emitTo(deviceId, 'startRemoteControl', remoteControlSocketIOServerPort || 8901, async () => {
          const proxyPort = await proxyServer.startProxy(`${deviceId}-proxy-client`);
          callback(proxyPort);
        })
      }
    });

    socket.on('stopRemoteControl', async deviceId => {
      if (!deviceId) return
      proxyServer.stopProxy(`${deviceId}-proxy-client`);

      serverPlugin.emitTo(deviceId, 'stopRemoteControl', () => {
        remoteControlDeviceId = null;
      })
    });

    socket.once('disconnect', () => {
      if (!remoteControlDeviceId) return
      proxyServer.stopProxy(`${remoteControlDeviceId}-proxy-client`);

      serverPlugin.emitTo(remoteControlDeviceId, 'stopRemoteControl', () => {
        remoteControlDeviceId = null;
      })
    });
  });
}
