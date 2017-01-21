var express     = require('express');   // The npm package you will be using to start an HTTP server is called Express
var app         = express();
var bodyParser  = require('body-parser'); /* The bodyParser object exposes various factories to create middlewares. 
                                              All middlewares will populate the req.body property with the parsed body,
                                               or an empty object ({}) if there was no body to parse 
                                               (or an error was returned).*/
var morgan      = require('morgan');    /* Morgan is used for logging request details
                                            
                                            morgan(format, options)
                                                Create a new morgan logger middleware function using the given format 
                                              and options. The format argument may be a string of a predefined name 
                                              (see below for the names), a string of a format string, or a function 
                                              that will produce a log entry.

                                                Write log line on request instead of response. This means that a 
                                              requests will be logged even if the server crashes, but data from 
                                              the response (like the response code, content length, etc.) cannot be logged.
                                            */
var mongoose    = require('mongoose');  // 1. Mongoose, which is the most popular object document mapper, 
                                        // or ODM for short for MongoDB and node.js. Mongoose provides features like 
                                        // schema validation, pseudo joins, and
var passport  = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model having User Schema
var port        = process.env.PORT || 8080;   /* The process.env property returns an object containing
                                                   the user environment. 
                                                  you can set the environment variable PORT to 
                                                   tell your web server what port to listen on.
                                                */
var jwt         = require('jwt-simple');      /* JWT(JSON Web Token) encode and decode module*/
 

/* app.use() - Reference (Expressjs)
  Middleware functions are functions that have access to the request object (req), the response object (res), 
  and the next middleware function in the application’s request-response cycle. The next middleware function 
  is commonly denoted by a variable named next.

Middleware functions can perform the following tasks:
1) Execute any code.
2) Make changes to the request and the response objects.
3) End the request-response cycle.
4) Call the next middleware function in the stack.

  If the current middleware function does not end the request-response cycle, it must call next() 
  to pass control to the next middleware function. Otherwise, the request will be left hanging.

  Bind application-level middleware to an instance of the app object by using the app.use() and 
  app.METHOD() functions, where METHOD is the HTTP method of the request that the middleware 
  function handles (such as GET, PUT, or POST) in lowercase.

*/
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));    /*  bodyParser.urlencoded(options)
                                                            Returns middleware that only parses urlencoded bodies.
                                                            
                                                            A new body object containing the parsed data is populated on 
                                                            the request object after the middleware (i.e. req.body). 
                                                            This object will contain key-value pairs, where the value can 
                                                            be a string or array (when extended is false), 
                                                            or any type (when extended is true).

                                                            The "extended" syntax allows for rich objects and arrays 
                                                            to be encoded into the URL-encoded format, allowing for 
                                                            a JSON-like experience with URL-encoded.
                                                          */

app.use(bodyParser.json());                         /* 
                                                      bodyParser.json(options)

                                                      Returns middleware that only parses json.

                                                      A new body object containing the parsed data is populated on 
                                                      the request object after the middleware (i.e. req.body).
                                                    */
 
// log to console
app.use(morgan('dev'));                               /* 
                                                        dev

                                                        Concise output colored by response status for development use.
                                                         The :status token will be colored red for server error codes,
                                                          yellow for client error codes, cyan for redirection codes, 
                                                          and uncolored for all other codes.

                                                        :method :url :status :response-time ms - :res[content-length]
                                                        */
 
// Use the passport package in our application
app.use(passport.initialize());
 
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

/* 
// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
*/

// demo Route (GET http://localhost:8080)
// ...
 
// connect to database
/* 
  In order to use schema, you first need to make Mongoose connect to MongoDB.
This mongoose.connect function is the most concise way to make Mongoose connect to this mongod server.
*/
mongoose.connect(config.database);  // 'database': 'mongodb://localhost/backend' is defined in '/config/database.js'
                                      /* The config database supports sharded cluster operation.
                                        config.databases
                                        INTERNAL MONGODB METADATA
                                        The config database is internal: applications and administrators should 
                                        not modify or depend upon its content in the course of normal operation.
                                      */

/*
  Once you have called connect, you can then use the mongoose.model function
  to create a user model from the schema and collection.

  Please refer user.js
*/
 
// pass passport for configuration
require('./config/passport')(passport);
 
// bundle our routes
var apiRoutes = express.Router();                         /* 
                                                            Route methods - Reference
                                                            A route method is derived from one of the HTTP methods, 
                                                            and is attached to an instance of the express class.

                                                            The following code is an example of routes that are 
                                                            defined for the GET and the POST methods to the root 
                                                            of the app.

                                                            // GET method route
                                                            app.get('/', function (req, res) {
                                                              res.send('GET request to the homepage')
                                                            })

                                                            // POST method route
                                                            app.post('/', function (req, res) {
                                                              res.send('POST request to the homepage')
                                                            })
                                                            */

/*
  Express route-specific - Reference
  This example demonstrates adding body parsers specifically to the routes that need them.
   In general, this is the most recommended way to use body-parser with Express.

  var express = require('express')
  var bodyParser = require('body-parser')
   
  var app = express()
   
  // create application/json parser 
  var jsonParser = bodyParser.json()
   
  // create application/x-www-form-urlencoded parser 
  var urlencodedParser = bodyParser.urlencoded({ extended: false })
   
  // POST /login gets urlencoded bodies 
  app.post('/login', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    res.send('welcome, ' + req.body.username)
  })
   
  // POST /api/users gets JSON bodies 
  app.post('/api/users', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    // create user in req.body 
  })
*/

/*
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.' + err});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});
*/
// create a new user account after getting a customerRefNo (POST http://localhost:8080/api/signup)

apiRoutes.put('/signup', function(req, res){
    if (!req.body.name || !req.body.password || !req.body.customerRefNo) {
      res.json({success: false, msg: 'Please pass name, password & customer reference number'});
  } else {
      User.findOneAndUpdate({
          query: {customerRefNo: req.body.customerRefNo},
          update: { $set: {
                      name: req.body.name,
                      password: req.body.password 
                    }
                  },
          //new: true          
        }, function(err, res){
              if (err){
                throw err;
              } 

              if (res == req.body.name) {
                res.send({success: false, msg: 'User name already exists!'});
              } else {
                  res.json({success: true, msg: 'Successful created new user.'});
                }
            }
      );
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// Code to disply the user name and password
// route to authenticate a user (GET http://localhost:8080/api/info)
 apiRoutes.get('/info', function(req, res){
    console.log('Fetching user information');
    User.find(function(err, docs){
      if (err){
        res.send({success: false, msg:'User information not availabele'});
      } else {
        res.json(docs);
      }
    });
 });

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

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);


/*
XMLHttpRequest cannot load http://127.0.0.1:8100/api/authenticate. 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource. 
Origin 'http://localhost:8100' is therefore not allowed access.
*/

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);

