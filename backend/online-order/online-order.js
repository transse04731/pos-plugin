module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('createOrder', orderData => {
      debugger
      console.log(orderData);

/* Sample data:
      {
        "orderType": "delivery",
          "paymentType": "cash",
          "customer": {
            "name": "",
            "phone": "",
            "address": "",
            "zipCode": ""
          },
        "products": [
        {
          "_id": "5e9004a74e9c0a1a20d07719",
          "image": "http://localhost:8888/cms-files/files/view//download (2).jpeg",
          "name": "Cocacola",
          "desc": "Delicious",
          "price": 1,
          "category": [
            "Object"
          ],
          "attributes": [],
          "layouts": [],
          "tax": 7,
          "id": "5",
          "groupPrinter": [
            "Object"
          ],
          "quantity": 1
        }
      ],
          "deliveryTime": "2020-04-11T12:00:01.819Z",
          "note": ""
      }
*/

      // socket.emit('update-online-orders')
    })
  })
}
