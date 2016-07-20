'use strict';
function printReceipt(tags){
  const allItems=loadAllItems();
  const promotions=loadPromotions();

  const cartItems=buildCartItems(tags,allItems);
  const receiptItems=buildReceiptItems(cartItems,promotions);
  const receipt=buildReceipt(receiptItems);
  const receiptText=buildReceiptText(receipt);

  console.log(receiptText);
}

function buildCartItems(tags,allItems){

  let cartItems=[];

  for(const  tag of tags ){
    const splitBarcode=tag.split("-");
    const barcode=splitBarcode[0];
    const count=parseFloat(splitBarcode[1]||1);

    const cartItem=cartItems.find(cartItem=>cartItem.item.barcode===barcode);
    if(cartItem){
      cartItem.count+=count;
    }else{
      const item=allItems.find(item=>item.barcode===barcode)
      cartItems.push({item,count});
    }
  }

  return cartItems;
}
function buildReceiptItems(cartItems,promotions) {

  return cartItems.map(cartItem=> {

    const promotionType =findPromotionType(cartItem.item.barcode, promotions);
    const {save,subtotal}=discount(cartItem.item.price,
      cartItem.count, promotionType);
    return {cartItem, save, subtotal}
  });
}
function findPromotionType(barcode,promotions){

  const promotion=promotions.find(promotion=>
    promotion.barcodes.some(b=>b===barcode));

  return promotion ?promotion.type:undefined;
}

function discount(price,count,promotion){
  let subtotal=price*count;
  let save=0;

  if(promotion==='BUY_TWO_GET_ONE_FREE'){
    save=parseInt(count/3)*price;
  }
  subtotal-=save;

  return {save,subtotal};
}

function buildReceipt(receiptItems){

  let subtotal=0;
  let save=0;

  for (const  receiptItem of receiptItems){
    subtotal+=receiptItem.subtotal;
    save    +=receiptItem.save;
  }
  return {receiptItems,save,subtotal};
}

function buildReceiptText(receipt) {
  let receiptItemsText = receipt.receiptItems.map(receiptItem=> {

    const cartItems = receiptItem.cartItem;
    return `名称：${cartItems.item.name}，\
数量：${cartItems.count}${cartItems.item.unit}，\
单价：${formatMoney(cartItems.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${receiptItemsText}
----------------------
总计：${formatMoney(receipt.subtotal)}(元)
节省：${formatMoney(receipt.save)}(元)
**********************`
}

function  formatMoney(money){
  return money.toFixed(2);
}


