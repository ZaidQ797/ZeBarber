const Params = new FormData();
const product = {
  count: 1,
  id: 3,
  price: 2,
  proid: 2,
  // proimage: restaurantproducts / ptwo.png,
  proname: 'Sprie Can',
  proweight: '350ml',
  resid: 2,
  totalprice: 1.5,
  userid: 13,
};
Params.append('action', 'PlaceOrder');
Params.append('products', product);
Params.append('u_id', 1);
Params.append('delivery_type', 'sdsafsfsff');
Params.append('street1', 'sdsafsf');
export {Params};
