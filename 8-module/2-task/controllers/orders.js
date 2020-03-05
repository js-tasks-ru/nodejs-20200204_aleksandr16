const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user;

  try {
    const order = await Order.create({
      user: user.id,
      product,
      phone,
      address,
    });
    ctx.body = {order: order.id};

    sendMail({
      template: 'order-confirmation',
      locals: {id: order.id, product},
      to: user.email,
      subject: 'Подтверждение заказа', 
    });

    return next();
  } catch (e) {
    const errors = {};
    Object.keys(e.errors).forEach((errorKey) => {
      errors[errorKey] = e.errors[errorKey].message;
    });
    ctx.status = 400;
    ctx.body = {errors};
    return next();
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;
  const orders = await Order.find({user: user.id}).populate('product');
  
  ctx.body = {orders: orders.map((order) => mapOrder(order))};
};
