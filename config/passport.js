var JwtStrategy = require('passport-jwt').Strategy;
 
// load up the user model
var User = require('../app/models/user');
var config = require('../config/database'); // get db config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};

/* Reference
  WT(JSON Web Token) encode and decode module
  Usage:

  var jwt = require('jwt-simple');
  var payload = { foo: 'bar' };
  var secret = 'xxx';
   
  // HS256 secrets are typically 128-bit random strings, for example hex-encoded: 
  // var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex) 
   
  // encode 
  var token = jwt.encode(payload, secret);
   
  // decode 
  var decoded = jwt.decode(token, secret);
  console.log(decoded); //=> { foo: 'bar' } 
*/