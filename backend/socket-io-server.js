const {p2pServerPlugin} = require('@gigasource/socket.io-p2p-plugin');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

  const {io, socket: socketIOServer} = cms;
  const serverPlugin = p2pServerPlugin(io, {
    saveMessage, loadMessages, deleteMessage,
  });

  socketIOServer.on('connect', socket => {
    socket.on('createOrder', async (storeId, orderData) => {
      storeId = ObjectId(storeId);
      const device = await DeviceModel.findOne({storeId});
      const deviceId = device._id.toString();

      serverPlugin.emitToPersistent(deviceId, 'createOrder', [orderData]);
    });
  })
}
