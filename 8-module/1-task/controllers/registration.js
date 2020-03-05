const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  let user = await User.findOne({email});
  const errors = {};
  if (user) {
    errors.email = 'Такой email уже существует';
    ctx.body = {errors};
    ctx.status = 400;
    return next();
  }

  const verificationToken = uuid();
  try {
    user = await User.create({
      verificationToken,
      email,
      displayName,
    });
    await user.setPassword(password);
    await user.save();
  } catch (e) {
    errors = e.message;
    ctx.body = {errors};
    ctx.status = 400;
    return next();
  }

  user.setPassword(password);
  await user.save();

  const result = await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });

  if (result.messageId) {
    ctx.body = {status: 'ok'};
    return next();
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    const error = 'Ссылка подтверждения недействительна или устарела';
    ctx.body = {error};
    ctx.status = 400;
    return next();
  }
  
  const token = user.verificationToken;
  user.verificationToken = undefined;
  await user.save();
  ctx.body = {token};
  return next();
};
