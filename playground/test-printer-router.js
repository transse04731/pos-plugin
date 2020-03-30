const order = {
  items: [
    {
      name: 'Cola',
      groupPrinter: 'Drink',
      groupPrinter2: 'Sushi',
      course: 1,
    },
    {
      name: 'Fanta',
      groupPrinter: 'Drink',
      course: 2,
    },
    {
      name: 'Pepsi',
      groupPrinter: 'Drink',
      groupPrinter2: 'Sushi',
      course: 2,
    },
    {
      name: 'Orange',
      groupPrinter: 'Drink',
      course: 1,
    },
    {
      name: 'pineapple',
      groupPrinter: 'Drink',
      course: 1,
      takeAway: true
    },
    {
      name: 'Rice',
      groupPrinter: 'Kitchen',
      course: 1
    },
    {
      name: 'BurgerMenu',
      groupPrinter: 'Kitchen',
      course: 1,
      modifiers: [
        {
          name: 'Burger'
        },
        {
          name: 'Cola',
          groupPrinter: 'Drink'
        }
      ]
    }
  ]
}

const _ = require('lodash');

let entireReceiptSetting = {
  active: true,
  include: ['Drink']
}

const receipts = _.reduce(order.items, function (obj, item) {
  function addItem(i) {
    const groupPrinter = i === 1 ? item.groupPrinter : item.groupPrinter2;
    if (!groupPrinter) return;
    const receiptKey = JSON.stringify({
      groupPrinter: groupPrinter,
      course: item.course,
      takeAway: item.takeAway
    })

    if (!obj[receiptKey]) obj[receiptKey] = [];

    if (!_.find(item.modifiers, m => m.groupPrinter && m.groupPrinter !== groupPrinter)) {
      obj[receiptKey].push(item);
    } else {
      // case modifiers have another groupPrinter
      const modifierGroup = _.groupBy(item.modifiers, i => i.groupPrinter ? i.groupPrinter : groupPrinter);
      for (let _groupPrinter in modifierGroup) {
        const _item = {
          ...item,
          groupPrinter: _groupPrinter,
          modifiers: modifierGroup[_groupPrinter]
        }

        const _receiptKey = JSON.stringify({
          groupPrinter: _groupPrinter,
          course: item.course,
          takeAway: item.takeAway
        })

        if (!obj[_receiptKey]) obj[_receiptKey] = [];

        obj[_receiptKey].push(_item);
      }
    }
  }

  [1, 2].forEach(addItem);

  /*function addEntireReceipt() {
    const receiptKey = JSON.stringify({
      name: 'entireReceipt'
    })
    obj[receiptKey] = obj[receiptKey] || [];

  }

  if (entireReceiptSetting.active) addEntireReceipt()*/

  return obj;
}, {})

console.log(receipts);