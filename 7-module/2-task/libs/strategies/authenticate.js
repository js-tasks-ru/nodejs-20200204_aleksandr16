const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');
  try {
    const user = await User.findOne({email});
    if (user) return done(null, user);

    const oauthUser = new User({email, displayName});
    await oauthUser.save();
    return done(null, oauthUser);
  } catch (e) {
    return done(e, false, e.message);
  }
};
