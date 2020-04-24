const {p2pServerPlugin} = require('@gigasource/socket.io-p2p-plugin');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ProxyServer = require('@gigasource/nodejs-proxy-server/libs/server.js');
const {remoteControlExpressServerPort, remoteControlSocketIOServerPort} = global.APP_CONFIG;
const deviceStatusSubscribers = {};
const _ = require('lodash');

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
  const DeviceModel = cms.getModel('Device');

  const proxyServer = new ProxyServer({
    expressServerPort: remoteControlExpressServerPort,
    socketIOServerPort: remoteControlSocketIOServerPort || 8901,
    ignoreStreamError: true,
  });
  // for destroy: proxyServer.destroy();

  const {io, socket: internalSocketIOServer} = cms;
  const externalSocketIOServer = p2pServerPlugin(io, {
    saveMessage, loadMessages, deleteMessage,
  });

  function updateDeviceAndNotify(online, clientId) {
    const DeviceModel = cms.getModel('Device');
    DeviceModel.updateOne({_id: clientId}, {online}, err => {
      if (err) console.error(err);

      Object.keys(deviceStatusSubscribers).forEach(socketId => {
        const deviceWatchList = deviceStatusSubscribers[socketId]

        if (deviceWatchList && deviceWatchList.includes(clientId)) {
          internalSocketIOServer.connected[socketId].emit('updateDeviceStatus');
        }
      });
    })
  }

  // externalSocketIOServer is Socket.io namespace for store/restaurant app to connect (use default namespace)
  externalSocketIOServer.on('connect', socket => {
    if (socket.request._query && socket.request._query.clientId) {
      const clientId = socket.request._query.clientId;
      updateDeviceAndNotify(true, clientId);
      socket.once('disconnect', () => updateDeviceAndNotify(false, clientId));
    }
  });

  // internalSocketIOServer is another Socket.io namespace for frontend to connect (use /app namespace)
  internalSocketIOServer.on('connect', socket => {
    let remoteControlDeviceId = null;

    socket.on('watchDeviceStatus', clientIdList => {
      deviceStatusSubscribers[socket.id] = _.uniq((deviceStatusSubscribers[socket.id] || []).concat(clientIdList));
    });

    socket.on('unwatchDeviceStatus', clientIdList => {
      deviceStatusSubscribers[socket.id] = _.uniq((deviceStatusSubscribers[socket.id] || []).filter(id => !clientIdList.includes(id)));
    });

    socket.on('createOrder', async (storeId, orderData) => {
      storeId = ObjectId(storeId);
      const device = await DeviceModel.findOne({storeId});
      const deviceId = device._id.toString();

      externalSocketIOServer.emitToPersistent(deviceId, 'createOrder', [orderData]);
    });

    socket.on('updateApp', async (deviceId, uploadPath) => {
      externalSocketIOServer.emitToPersistent(deviceId, 'updateApp', [uploadPath]);
    })

    socket.on('startRemoteControl', async (deviceId, callback) => {
      if (!deviceId) {
        callback(null);
      } else {
        remoteControlDeviceId = deviceId;
        externalSocketIOServer.emitTo(deviceId, 'startRemoteControl', remoteControlSocketIOServerPort || 8901, async () => {
          const proxyPort = await proxyServer.startProxy(`${deviceId}-proxy-client`);
          callback(proxyPort);
        })
      }
    });

    socket.on('stopRemoteControl', async deviceId => {
      if (!deviceId) return
      proxyServer.stopProxy(`${deviceId}-proxy-client`);

      externalSocketIOServer.emitTo(deviceId, 'stopRemoteControl', () => {
        remoteControlDeviceId = null;
      })
    });

    socket.once('disconnect', () => {
      delete deviceStatusSubscribers[socket.id]

      if (!remoteControlDeviceId) return
      proxyServer.stopProxy(`${remoteControlDeviceId}-proxy-client`);
      remoteControlDeviceId = null;
    });
  });
}
