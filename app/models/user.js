var mongoose = require('mongoose'); // 1. Mongoose, which is the most popular object document mapper, 
                                        // or ODM for short for MongoDB and node.js. Mongoose provides features like 
                                        // schema validation, pseudo joins, and

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model //Refer MongoDB Schema Design/ Introduction to mongoose/ 2-Example
var UserSchema = new Schema({
  name: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    },
 //Added new fields to the UserSchema
  customerRefNo:{
       type: Number,
        required: true
  },
     oldAccNo: {
     	type: String,
     	//required: true
     },
     customerName: {
           type: String,
           //required: true
      },
      address1: {
        type: String,
        //required: true
   		},
       status: {
       	type: String,
       	//required: true
       },
       category: {
       	type: String,
       	//required: true
       },
       cd: {
       	type: String,
       	//required: true
       },
       cdUnit: {
        type: String,
        //required: true
       },
       billMonth: {
       	type: String,
       	//required: true
       },
       consumption: {
       	type: Number,
       	//required: true
       },
       energyCharges: {
       	type: Number,
       	//required: true
       },
       mmfc: {
       	type: Number,
       	//required: true
       },
       meterRent: {
       	type: Number,
       	//required: true
       },
       ed: {
       	type: Number,
       	//required: true
       },

       dps: {
       	type: Number,
       	//required: true
       },
       currentBillAmt: {
       	type: Number,
       	//required: true
       },

       arrearAmt: {
       	type: Number,
       	//required: true
       },
       totalBillAmt: {
       	type: Number,
       	//required: true
       },
       currentReading: {
        type: Number,
        //required: true
       },
       receiptNo: {
        type: String,
        //required: true
       },
       receiptDate: {
        type: Number,
        //required: true
       },
       receiptAmt: {
        type: Number,
        //required: true
       }
}); 
 
UserSchema.pre('save', function (next) {                        /* 
                                                                    Middleware (also called pre and post hooks) are 
                                                                    functions which are passed control during execution 
                                                                    of asynchronous functions.             
                                                                    */
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {                       /*
                                                                            genSalt(rounds, callback)
rounds - [OPTIONAL] - the number of rounds to process the data for. (default - 10)
callback - [REQUIRED] - a callback to be fired once the salt has been generated.
error - First parameter to the callback detailing any errors.
result - Second parameter to the callback providing the generated salt.
                                                                        */
            if (err) {
                return next(err);                           /*
                                                                Calls to next() and next(err) indicate that the current 
                                                                handler is complete and in what state. next(err) will 
                                                                skip all remaining handlers in the chain except for 
                                                                those that are set up to handle errors as described above.
                                                            */
            }
            bcrypt.hash(user.password, salt, function (err, hash) {     /*
                                                                            hash(data, salt, progress, cb)
data - [REQUIRED] - the data to be encrypted.
salt - [REQUIRED] - the salt to be used to hash the password.
progress - a callback to be called during the hash calculation to signify progress
callback - [REQUIRED] - a callback to be fired once the data has been encrypted.
error - First parameter to the callback detailing any errors.
result - Second parameter to the callback providing the encrypted form.
                                                                        */
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {      /*
                                                                            compare(data, encrypted, cb)
data - [REQUIRED] - data to compare.
encrypted - [REQUIRED] - data to be compared to.
callback - [REQUIRED] - a callback to be fired once the data has been compared.
error - First parameter to the callback detailing any errors.
result - Second parameter to the callback providing whether the data and encrypted forms match [true | false]. 
                                                                        */
        if (err) {
            return cb(err);                                             /*
                                                                            cb()
                                                                            Super simple callback mechanism with support 
                                                                            for timeouts and explicit error handling 

                                                                            Features
.timeout(): Simple callback timeouts
.error(): Explicit error handling
.once(): Once-and-only-once callback semantics
Guaranteed asynchronous callback execution (protects against code that breaks this assumption)
                                                                        */
        }
        cb(null, isMatch);
    });
};

// Parameters are: model name, schema
module.exports = mongoose.model('User', UserSchema);

/*
  Once you have called connect, you can then use the mongoose.model function
  to create a user model from the schema and collection.

  Please refer server.js
*/