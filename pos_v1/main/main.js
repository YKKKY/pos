'use strict';
let printReceipt=(inputs)=>{
  let allItems=loadAllItems();
  let promotions=loadPromotions();

  let cartItems=buildCartItems(inputs, allItems);
      cartItems=buildCartItemsTotal(cartItems,promotions);
  let total=buildTotal(cartItems);
  let expectText=buildPrint(total);
    console.log(expectText);
}

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
};

let buildCartItemsTotal =(cartItems,promotions)=> {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal,save}=discount(cartItem, promotionType);

    return {cartItem, subtotal, save};
  });
}

let getPromotionType=(barcode,promotions)=>{
  let  promotion=promotions.find(promotion =>
    promotion.barcodes.includes(barcode)
  );
  return promotion ? promotion.type :'';
}

let discount=(cartItem, promotionType)=>{
  let freeItemCount=0;
  if(promotionType==='BUY_TWO_GET_ONE_FREE'){
    freeItemCount=parseInt(cartItem.count/3);
  }

  let save=freeItemCount*cartItem.item.price;
  let subtotal=cartItem.count*cartItem.item.price-save;

  return {save,subtotal};
};

let buildTotal=(cartItems)=>{
  let total={};
  let subtotal=0.0;
  let subSave=0.0;

  for(let cart of cartItems){
    subSave+=cart.save;
    subtotal+=cart.subtotal;
  }

  total={cartItems,subtotal,subSave};
  return total;
}

let buildPrint=(total)=>{
  let expectText=`***<没钱赚商店>收据***\n`;
  for(let cart of total.cartItems){

    expectText +=`名称：`+cart.cartItem.item.name
      +`，数量：`+cart.cartItem.count +cart.cartItem.item.unit
      +`，单价：`+cart.cartItem.item.price.toFixed(2)
      + `(元)，小计：`+cart.subtotal.toFixed(2)+`(元)\n`;
  }
  expectText+=`----------------------
总计：`+total.subtotal.toFixed(2)+ `(元)
节省：`+total.subSave.toFixed(2)+`(元)
**********************`;

 return expectText;
 }

