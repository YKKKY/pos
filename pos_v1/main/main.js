'use stirct';
let buildCartItems = (inputs, allItems)=> {

  let cartItems = [];
  for (let input of inputs) {
    let spiltBarcode = input.split("-");
    let barcode = spiltBarcode[0];
    let count = parseFloat(spiltBarcode[1] || 1);

    let cartItem = cartItems.find((cartItem)=> {
      return cartItem.item.barcode === barcode;
    });

    if (cartItem) {
      cartItem.count++;
    } else {
      const item = allItems.find((item)=> {
        return item.barcode === barcode;
      });
      cartItems.push({item: item, count: count});
    }
  }
  return cartItems;
}

let buildCartItemsTotal = (cartItems, promotions)=> {
  let cartItemsTotal = [];

  for (let cartItem of cartItems) {
    let subTotal=0.0;
    let total=0.0;
    let count=cartItem.count;
    let save=0.0;

    promotions.forEach(function (promotion) {
    let discountCartItem = promotion.barcodes.find((barcode)=> {
      return cartItem.item.barcode === barcode;
    });
      total=cartItem.item.price*count;

    if (discountCartItem != null && promotion.type === 'BUY_TWO_GET_ONE_FREE') {
       count = cartItem.count - parseInt(cartItem.count / 3);
    }
      subTotal = cartItem.item.price * count*1.0;
      save=total-subTotal;
      cartItemsTotal.push({cartItem: cartItem, subTotal: subTotal,save:save});
    });
  }
  return cartItemsTotal;
};




